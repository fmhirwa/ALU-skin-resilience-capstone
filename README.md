# ALU-skin-resilience-capstone
Project Proposal: https://docs.google.com/document/d/1rYyHFnxY5h8V_OoRysODZJEo1P_sO1S_znwrXnp56BU/edit?usp=sharing

## Description: 

This project builds a daylight-focused machine-learning pipeline that links ERA5-Land atmospheric reanalysis with self-reported skin-damage data to predict daily “high-damage” risk for urban East Africa. We aggregate daylight surface-solar-radiation, 2-m temperature and relative humidity into daily totals and rolling seven-day indices—capturing the cumulative photo-thermal stress that drives premature skin ageing. A lightweight LightGBM gradient-boosted-tree model, trained with temporal cross-validation and class-balancing, transforms these engineered features into a calibrated probability that any given day will exceed a high-risk skin-damage threshold, providing a fast, interpretable baseline that already improves F1 from 0.40 to the mid-0.60s and sets the stage for future additions such as air-quality and cloud-cover effects.

## UI mockups can be found in the UI folder.
## Demo: https://youtu.be/CjdaFZ9JN3Q
