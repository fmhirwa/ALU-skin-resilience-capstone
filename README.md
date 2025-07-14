# ALU-skin-resilience-capstone
Project Proposal: https://docs.google.com/document/d/1rYyHFnxY5h8V_OoRysODZJEo1P_sO1S_znwrXnp56BU/edit?usp=sharing

## Description: 

This project builds a daylight-focused machine-learning pipeline that links ERA5-Land atmospheric reanalysis with self-reported skin-damage data to predict daily “high-damage” risk for urban East Africa. We aggregate daylight surface-solar-radiation, 2-m temperature and relative humidity into daily totals and rolling seven-day indices—capturing the cumulative photo-thermal stress that drives premature skin ageing. A lightweight LightGBM gradient-boosted-tree model, trained with temporal cross-validation and class-balancing, transforms these engineered features into a calibrated probability that any given day will exceed a high-risk skin-damage threshold, providing a fast, interpretable baseline that already improves F1 from 0.40 to the mid-0.60s and sets the stage for future additions such as air-quality and cloud-cover effects.

## UI mockups can be found in the UI folder.
## Demo Frontend : https://youtu.be/CjdaFZ9JN3Q
## Demo Final: https://youtu.be/kJSIW8kwW5c

# Project Summary

This project delivers an end-to-end “skin-risk dashboard” that blends a lightweight ML model, a FastAPI micro-service, and a React/Next.js front-end.

Model & data training – Historical hourly weather from open-meteo is enriched (short-wave radiation, air-temperature, dew-point → relative humidity, seasonal sin/cos terms, 1-day integrals and 7-day rolling means). A LightGBM classifier is trained to predict UV-related skin-stress; model artefacts and the exact 10-feature schema are frozen to skin_uv_model.pkl.

Backend – main.py exposes two routes: /healthz for warm-up checks and /predict for scoring. On every request it queries open-meteo for the caller’s coordinates, derives the features expected by the model, adjusts the raw score for complexion (light → +30 %, deep → +0 %), clips night-time values to a minimal risk of 5 %, and returns JSON with score, level, advice, temp_c, and uv_wm2. The service is stateless and deploys easily to Render or any container host via uvicorn main:app.

Front-end – Built with Next.js 13 (app router) + TypeScript + MUI.
DataProvider pings /healthz until the dyno wakes, then calls /risk (a thin Next.js API proxy that relays to the backend). It stores risk, recommendation, and live weather in React context. UI components (RiskCard, RecommendationCard, AnalysisCard) subscribe to that context to render a colour-coded circular gauge, step-by-step analysis, and care tips. A profile sheet lets users set skin tone & gender; location is requested from the browser Geolocation API. Automatic refresh runs every 30 min.

Local dev – uvicorn main:app --reload starts the API on :8000; npm run dev launches the Next.js app on :3000 (proxying to :8000 unless NEXT_PUBLIC_BACKEND_URL is set). With both pieces live, the dashboard shows risk numbers immediately and updates on any change to location or profile.


# Local RUn

## Backend

cd backend

### create & activate a venv
python -m venv .venv
### on macOS/Linux:
source .venv/bin/activate
### on Windows:
.\.venv\Scripts\Activate.ps1

### install dependencies
pip install -r requirements.txt

### Run
python -m uvicorn main:app --reload

## Frontend

cd ../frontend
npm install
npm run dev

NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Hosted:

Repository: https://github.com/fmhirwa/ALU-skin-resilience-capstone/tree/main

Deployed app: https://skin-frontend.onrender.com/
If the free server has shut down, please use https://alu-capstone-skin.onrender.com/ (backend) to restart it.
