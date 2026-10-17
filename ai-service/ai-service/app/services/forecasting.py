import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from fastapi import HTTPException
from .features import training_frame, time_features


def build_model(name: str):
    if name == "random_forest":
        return RandomForestRegressor(n_estimators=150, n_jobs=-1, random_state=42)
    if name == "xgboost":
        from xgboost import XGBRegressor
        return XGBRegressor(n_estimators=300, learning_rate=0.05, max_depth=6, random_state=42)
    if name == "lightgbm":
        from lightgbm import LGBMRegressor
        return LGBMRegressor(n_estimators=300, learning_rate=0.05, random_state=42, verbose=-1)
    raise HTTPException(status_code=400, detail="Modèle inconnu")


def train(df: pd.DataFrame, name: str):
    X, y, features = training_frame(df)
    split = int(len(X) * 0.8)  # découpe chronologique, jamais aléatoire pour une série temporelle
    model = build_model(name).fit(X.iloc[:split], y.iloc[:split])
    pred = model.predict(X.iloc[split:])
    metrics = {"mae": round(float(mean_absolute_error(y.iloc[split:], pred)), 3),
               "rmse": round(float(np.sqrt(mean_squared_error(y.iloc[split:], pred))), 3),
               "r2": round(float(r2_score(y.iloc[split:], pred)), 4),
               "train_rows": split, "test_rows": len(X) - split}
    model.fit(X, y)  # réentraînement final sur toutes les données
    return model, metrics, features


def forecast(model, features: list[str], df: pd.DataFrame, horizon: int) -> list[dict]:
    hist = df["consumption"].to_dict()
    temp_profile = df.groupby(df.index.hour)["temperature"].mean().to_dict() if "temperature" in features else {}
    last, out = df.index[-1], []
    for i in range(1, horizon + 1):
        ts = last + pd.Timedelta(hours=i)
        row = time_features(pd.DatetimeIndex([ts])).iloc[0].to_dict()
        row["lag_24"] = hist.get(ts - pd.Timedelta(hours=24), df["consumption"].iloc[-1])
        row["lag_168"] = hist.get(ts - pd.Timedelta(hours=168), df["consumption"].iloc[-1])
        if temp_profile:
            row["temperature"] = temp_profile[ts.hour]
        y = float(model.predict(pd.DataFrame([row])[features])[0])
        hist[ts] = y
        out.append({"timestamp": ts.isoformat(), "predicted": round(y, 2)})
    return out
