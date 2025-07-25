# FastAPI micro-service for UV / temperature risk scoring
from __future__ import annotations

import joblib, requests, numpy as np, pandas as pd
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Skin Risk API")

origins = [
    "http://localhost:3000",        # Next.js front-end during dev
    "https://alu-capstone-skin.onrender.com",
    "https://skin-frontend.onrender.com", #source in prod
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # or ["*"] to allow everything
    #allow_origin_regex=r"^(https?://localhost(:\d+)?|https://.*\.onrender\.com)$",
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],            # Authorization, Content-Type, etc.
)

# ---------------------------------------------------------------------- #
#  Model & metadata
# ---------------------------------------------------------------------- #
MODEL          = joblib.load("skin_uv_model.pkl")
MODEL_FEATURES = [
    "uv_load_j", "temp_day_mean", "rh_day_mean", "net_therm_j",
    "uv_load_j_7d", "temp_day_mean_7d", "rh_day_mean_7d",
    "uv_temp_combo", "season_sin", "season_cos",
]  

# ---------------------------------------------------------------------- #
#  Request schema
# ---------------------------------------------------------------------- #
class Payload(BaseModel):
    lat: float
    lon: float
    skinTone: int  # 1-4  (1 = light ... 4 = deep)
    gender: str    # kept for future use

# ---------------------------------------------------------------------- #
#  Helper – download today’s daylight records & compute features
# ---------------------------------------------------------------------- #
def daylight_features(lat: float, lon: float) -> pd.DataFrame:
    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        "&hourly=temperature_2m,dewpoint_2m,shortwave_radiation"
        "&timezone=auto"
    )
    data = requests.get(url, timeout=10).json()

    hourly = data.get("hourly")
    if not hourly:
        raise HTTPException(502, f"Weather provider error: {data}")

    df = pd.DataFrame(hourly)
    df["time"] = pd.to_datetime(df["time"])

    # daylight only – short-wave radiation > 0 W m-2
    df = df[df["shortwave_radiation"] > 0]

    if df.empty:          # night or polar darkness – return sentinel row
        now = pd.Timestamp.now(tz=data["timezone"])
        return pd.DataFrame([{
            "uv_load_j": 0.0,
            "temp_day_mean": np.nan,
            "rh_day_mean": np.nan,
            "net_therm_j": 0.0,
            "uv_load_j_7d": 0.0,
            "temp_day_mean_7d": np.nan,
            "rh_day_mean_7d": np.nan,
            "uv_temp_combo": 0.0,
            "season_sin": np.sin(2 * np.pi * now.dayofyear / 365.25),
            "season_cos": np.cos(2 * np.pi * now.dayofyear / 365.25),
            "temp_latest": np.nan,
            "uv_latest": 0.0,
        }])

    # derive RH%
    df["temp_c"] = df["temperature_2m"]
    df["dew_c"]  = df["dewpoint_2m"]
    alpha_d      = (17.625 * df["dew_c"])  / (243.04 + df["dew_c"])
    alpha_t      = (17.625 * df["temp_c"]) / (243.04 + df["temp_c"])
    df["rh_pct"] = 100 * np.exp(alpha_d - alpha_t)

    latest = df.sort_values("time").iloc[-1]  # most recent daylight reading

    features = {
        # single-day integrals / means
        "uv_load_j": df["shortwave_radiation"].sum(),
        "temp_day_mean": df["temp_c"].mean(),
        "rh_day_mean": df["rh_pct"].mean(),
        "net_therm_j": 0.0,                     # not available – keep placeholder

        # simple 7-day placeholders
        "uv_load_j_7d": df["shortwave_radiation"].sum(),
        "temp_day_mean_7d": df["temp_c"].mean(),
        "rh_day_mean_7d": df["rh_pct"].mean(),

        # interaction + seasonality
        "uv_temp_combo": df["shortwave_radiation"].sum() * df["temp_c"].mean(),
        "season_sin": np.sin(2 * np.pi * latest.time.dayofyear / 365.25),
        "season_cos": np.cos(2 * np.pi * latest.time.dayofyear / 365.25),

        # “extra” – sent back to UI
        "temp_latest": latest["temp_c"],
        "uv_latest":   latest["shortwave_radiation"],
    }

    return pd.DataFrame([features])

# ---------------------------------------------------------------------- #
#  Simple advice generator
# ---------------------------------------------------------------------- #
def advice_text(score: int, tone: int) -> tuple[str, str]:
    if score > 80:
        level, msg = "Very High", "SPF 50+, long sleeves, seek shade 11-3 pm."
    elif score > 60:
        level, msg = "High", "SPF 30-50 every 2 h and a wide-brim hat."
    elif score > 40:
        level, msg = "Moderate", "SPF 30 if outside > 30 min."
    else:
        level, msg = "Low", "SPF 15 moisturiser is enough."

    if tone <= 2 and level != "Low":
        msg += " (Fair skin → extra caution.)"
    return level, msg

# ---------------------------------------------------------------------- #
#  Endpoints
# ---------------------------------------------------------------------- #
@app.get("/healthz")
def health() -> dict[str, bool]:
    return {"ok": True}

@app.post("/predict")
def predict(p: Payload):
    df = daylight_features(p.lat, p.lon)
    night = df.iloc[0]["uv_latest"] == 0.0

    if night:
        score = 5                   # minimal risk after sunset
    else:
        prob  = float(MODEL.predict_proba(df[MODEL_FEATURES])[0, 1])
        score = int(round(prob * 100))

    # scale for complexion (light +30 → deep +0)
    score = min(100, max(0, score + 10 * (4 - p.skinTone)))

    level, rec = advice_text(score, p.skinTone)
    latest     = df.iloc[0]

    return {
        "score":  score,
        "level":  level,
        "advice": rec,
        "temp_c": None if night else round(float(latest["temp_latest"]), 1),
        "uv_wm2": 0.0  if night else round(float(latest["uv_latest"]),  1),
    }
