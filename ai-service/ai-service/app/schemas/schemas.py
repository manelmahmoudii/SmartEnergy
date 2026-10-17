from pydantic import BaseModel, Field
from typing import Literal, Optional

ModelName = Literal["random_forest", "xgboost", "lightgbm"]


class QualityReport(BaseModel):
    dataset: str
    rows_raw: int
    rows_clean: int
    duplicates_removed: int
    missing_filled: int
    outliers_clipped: int
    quality_score: float


class TrainRequest(BaseModel):
    dataset: str
    model: ModelName = "random_forest"


class ModelInfo(BaseModel):
    id: str
    model: str
    dataset: str
    created_at: str
    metrics: dict
    features: list[str]


class ForecastRequest(BaseModel):
    model_id: str
    horizon: int = Field(24, ge=1, le=168, description="Heures à prévoir")


class ForecastPoint(BaseModel):
    timestamp: str
    predicted: float


class PeakRequest(ForecastRequest):
    percentile: float = Field(90, ge=50, le=99.9)


class PeakPoint(BaseModel):
    timestamp: str
    predicted: float
    risk: Literal["Faible", "Moyen", "Élevé"]


class AnomalyRequest(BaseModel):
    dataset: str
    contamination: float = Field(0.01, gt=0, lt=0.2)


class Anomaly(BaseModel):
    timestamp: str
    value: float
    expected: float
    severity: Literal["Moyenne", "Élevée", "Critique"]


class ExplainRequest(BaseModel):
    model_id: str
    samples: int = Field(300, ge=20, le=2000)


class FeatureImportance(BaseModel):
    feature: str
    importance: float
