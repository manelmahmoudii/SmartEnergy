import pandas as pd
from sklearn.ensemble import IsolationForest


def detect(df: pd.DataFrame, contamination: float) -> list[dict]:
    """IsolationForest sur la consommation et son écart au profil habituel (heure x jour de semaine)."""
    d = pd.DataFrame({"consumption": df["consumption"]})
    d["hour"], d["dow"] = df.index.hour, df.index.dayofweek
    profile = d.groupby(["dow", "hour"])["consumption"].transform("median")
    d["residual"] = d["consumption"] - profile
    iso = IsolationForest(contamination=contamination, random_state=42)
    d["flag"] = iso.fit_predict(d[["consumption", "residual", "hour", "dow"]])
    d["score"] = iso.decision_function(d[["consumption", "residual", "hour", "dow"]])
    bad = d[d["flag"] == -1].sort_values("score")
    n = len(bad)
    out = []
    for rank, (ts, r) in enumerate(bad.iterrows()):
        sev = "Critique" if rank < n / 3 else "Élevée" if rank < 2 * n / 3 else "Moyenne"
        out.append({"timestamp": ts.isoformat(), "value": round(float(r["consumption"]), 2),
                    "expected": round(float(profile.loc[ts]), 2), "severity": sev})
    return sorted(out, key=lambda a: a["timestamp"], reverse=True)
