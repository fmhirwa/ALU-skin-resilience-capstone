# ---------- FastAPI micro-service ----------
import joblib, requests, pandas as pd, numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app  = FastAPI(title="Skin Risk API")
model = joblib.load("skin_uv_model.pkl")   # <-- your LightGBM model

# ---------- request / response schemas ----------
class Payload(BaseModel):
    lat: float
    lon: float
    skinTone: int  # 1-5
    gender: str    # 'Male' | 'Female' | 'Other'

# ---------- helper to fetch hourly weather (Open-Meteo) ----------
def fetch_daylight(lat, lon):
    # 1) Request only the fields the Forecast API actually provides
    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        "&hourly=temperature_2m,dewpoint_2m,shortwave_radiation"
        "&timezone=auto"
    )
    resp = requests.get(url, timeout=10)
    data = resp.json()
    # Debug if you want:
    # print("DEBUG keys:", data.keys())
    hourly = data.get("hourly")
    if not hourly:
        raise HTTPException(502, f"Weather provider error: {data.get('reason')}")
    df = pd.DataFrame(hourly)
    df["time"] = pd.to_datetime(df["time"])

    # 2) Only daylight hours (shortwave_radiation > 0)
    df = df[df["shortwave_radiation"] > 0]

    # 3) Compute temp (°C) & RH %
    df["temp_c"] = df["temperature_2m"]
    df["dew_c"]  = df["dewpoint_2m"]
    alpha_d = (17.625 * df["dew_c"]) / (243.04 + df["dew_c"])
    alpha_t = (17.625 * df["temp_c"]) / (243.04 + df["temp_c"])
    df["rh_pct"] = 100 * np.exp(alpha_d - alpha_t)

    # 4) Aggregate into one-row DataFrame
    out = {
        "uv_load_j":     df["shortwave_radiation"].sum(),  # J/m²
        "temp_day_mean": df["temp_c"].mean(),
        "rh_day_mean":   df["rh_pct"].mean(),
        # we no longer have net_therm_j from forecast
        "net_therm_j":   0.0
    }

    # 5) Fake the 7-day rolling stats with the same-day value
    for k in ["uv_load_j","temp_day_mean","rh_day_mean"]:
        out[f"{k}_7d"] = out[k]

    # 6) Interaction + seasonality
    out["uv_temp_combo"] = out["uv_load_j"] * out["temp_day_mean"]
    doy = df["time"].dt.dayofyear.iloc[0]
    out["season_sin"] = np.sin(2 * np.pi * doy / 365.25)
    out["season_cos"] = np.cos(2 * np.pi * doy / 365.25)

    return pd.DataFrame([out])


# ---------- basic text recommendation ----------
def make_advice(prob, skinTone):
    if prob>0.8: level, rec = "Very High", "SPF 50+, long sleeves, seek shade 11-3 pm."
    elif prob>0.6: level, rec = "High", "Apply SPF 30-50 every 2h, wear a hat."
    elif prob>0.4: level, rec = "Moderate", "Use SPF 30 if outdoors >30 min."
    else: level, rec = "Low", "Basic moisturizer with SPF 15 is fine."

    if skinTone<=2 and level!="Low":
        rec += " (Fair skin—extra caution.)"
    return level, rec

# ---------- POST /predict ----------
@app.post("/predict")
def predict(p: Payload):
    X = fetch_daylight(p.lat, p.lon)
    prob = float(model.predict_proba(X)[0,1])
    level, rec = make_advice(prob, p.skinTone)
    return {"prob":prob, "level":level, "recommendation":rec}
