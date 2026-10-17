import pandas as pd
from fastapi import HTTPException
from ..core.config import settings
from ..schemas.schemas import QualityReport

REQUIRED = {"timestamp", "consumption"}


def read_raw(name: str) -> pd.DataFrame:
    path = settings.raw_dir / f"{name}.csv"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Jeu de données brut introuvable")
    return pd.read_csv(path)


def load_processed(name: str) -> pd.DataFrame:
    path = settings.processed_dir / f"{name}.csv"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Jeu de données non préparé : lancez d'abord /data/preprocess")
    return pd.read_csv(path, index_col=0, parse_dates=True)


def clean(df: pd.DataFrame, name: str) -> tuple[pd.DataFrame, QualityReport]:
    """Doublons, valeurs manquantes (interpolation), valeurs aberrantes (écrêtage IQR), pas horaire régulier."""
    missing = REQUIRED - set(df.columns)
    if missing:
        raise HTTPException(status_code=422, detail=f"Colonnes manquantes : {sorted(missing)}")
    rows_raw = len(df)
    df = df.copy()
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
    df["consumption"] = pd.to_numeric(df["consumption"], errors="coerce")
    if "temperature" in df.columns:
        df["temperature"] = pd.to_numeric(df["temperature"], errors="coerce")
    df = df.dropna(subset=["timestamp"])
    before = len(df)
    df = df.drop_duplicates(subset="timestamp", keep="first").sort_values("timestamp").set_index("timestamp")
    duplicates = before - len(df)
    cols = [c for c in ("consumption", "temperature") if c in df.columns]
    df = df[cols].resample("h").mean()
    missing_filled = int(df["consumption"].isna().sum())
    df = df.interpolate(method="time", limit_direction="both")
    q1, q3 = df["consumption"].quantile([0.25, 0.75])
    iqr = q3 - q1
    lo, hi = q1 - 3 * iqr, q3 + 3 * iqr
    outliers = int(((df["consumption"] < lo) | (df["consumption"] > hi)).sum())
    df["consumption"] = df["consumption"].clip(lo, hi)
    if len(df) < 24 * 14:
        raise HTTPException(status_code=422, detail="Au moins 14 jours de données horaires sont nécessaires")
    penalty = (missing_filled + outliers + duplicates) / max(rows_raw, 1) * 100
    report = QualityReport(dataset=name, rows_raw=rows_raw, rows_clean=len(df), duplicates_removed=duplicates,
                           missing_filled=missing_filled, outliers_clipped=outliers,
                           quality_score=round(max(0.0, 100 - penalty), 1))
    return df, report


def save_processed(df: pd.DataFrame, name: str) -> None:
    df.to_csv(settings.processed_dir / f"{name}.csv")
