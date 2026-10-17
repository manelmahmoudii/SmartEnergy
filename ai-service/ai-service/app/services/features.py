import numpy as np
import pandas as pd


def time_features(idx: pd.DatetimeIndex) -> pd.DataFrame:
    return pd.DataFrame({
        "hour": idx.hour, "dow": idx.dayofweek, "month": idx.month,
        "is_weekend": (idx.dayofweek >= 5).astype(int),
        "hour_sin": np.sin(2 * np.pi * idx.hour / 24), "hour_cos": np.cos(2 * np.pi * idx.hour / 24),
    }, index=idx)


def training_frame(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series, list[str]]:
    X = time_features(df.index)
    X["lag_24"] = df["consumption"].shift(24)
    X["lag_168"] = df["consumption"].shift(168)
    if "temperature" in df.columns:
        X["temperature"] = df["temperature"]
    X = X.dropna()
    y = df["consumption"].loc[X.index]
    return X, y, list(X.columns)
