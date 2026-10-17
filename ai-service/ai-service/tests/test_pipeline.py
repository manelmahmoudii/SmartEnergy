import numpy as np
import pandas as pd
from app.services import preprocessing as pre, forecasting as fc, anomaly


def make_raw(days=45):
    idx = pd.date_range("2026-01-01", periods=24 * days, freq="h")
    rng = np.random.default_rng(0)
    cons = 100 + 40 * np.sin((idx.hour - 6) / 24 * 2 * np.pi) + rng.normal(0, 3, len(idx))
    df = pd.DataFrame({"timestamp": idx, "consumption": cons, "temperature": 20 + 8 * np.sin(idx.dayofyear / 20)})
    df.loc[500, "consumption"] = 900          # valeur aberrante
    df.loc[600:610, "consumption"] = np.nan   # valeurs manquantes
    return pd.concat([df, df.iloc[[10]]])     # un doublon


def test_clean_reports_problems():
    df, rep = pre.clean(make_raw(), "t")
    assert rep.duplicates_removed == 1 and rep.missing_filled >= 1 and rep.outliers_clipped >= 1
    assert df["consumption"].isna().sum() == 0


def test_train_forecast_and_anomalies():
    df, _ = pre.clean(make_raw(), "t")
    model, metrics, features = fc.train(df, "random_forest")
    assert metrics["r2"] > 0.8
    out = fc.forecast(model, features, df, 24)
    assert len(out) == 24
    assert isinstance(anomaly.detect(df, 0.01), list)
