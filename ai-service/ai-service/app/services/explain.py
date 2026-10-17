import numpy as np
import pandas as pd
from .features import training_frame


def shap_importance(model, df: pd.DataFrame, features: list[str], samples: int) -> list[dict]:
    import shap  # import tardif : bibliothèque lourde
    X, _, _ = training_frame(df)
    X = X[features].tail(samples)
    values = shap.TreeExplainer(model).shap_values(X)
    imp = np.abs(values).mean(axis=0)
    total = float(imp.sum()) or 1.0
    ranked = sorted(zip(features, imp), key=lambda t: -t[1])
    return [{"feature": f, "importance": round(float(v) / total, 4)} for f, v in ranked]
