from fastapi import APIRouter, Depends, File, UploadFile
from ..core.security import require_api_key, safe_name
from ..core.config import settings
from ..schemas.schemas import *
from ..services import preprocessing as pre, forecasting as fc, registry, anomaly, explain

router = APIRouter(dependencies=[Depends(require_api_key)])


@router.post("/data/upload", tags=["Données"])
async def upload(dataset: str, file: UploadFile = File(...)):
    """CSV avec colonnes : timestamp, consumption, (temperature optionnelle)."""
    name = safe_name(dataset)
    (settings.raw_dir / f"{name}.csv").write_bytes(await file.read())
    return {"dataset": name, "status": "importé"}


@router.post("/data/preprocess", response_model=QualityReport, tags=["Données"])
def preprocess(dataset: str):
    name = safe_name(dataset)
    df, report = pre.clean(pre.read_raw(name), name)
    pre.save_processed(df, name)
    return report


@router.post("/models/train", response_model=ModelInfo, tags=["Modèles"])
def train(req: TrainRequest):
    df = pre.load_processed(safe_name(req.dataset))
    model, metrics, features = fc.train(df, req.model)
    return registry.save_model(model, req.model, req.dataset, metrics, features)


@router.get("/models", response_model=list[ModelInfo], tags=["Modèles"])
def models():
    return registry.list_models()


@router.post("/forecast", response_model=list[ForecastPoint], tags=["Prévision"])
def forecast(req: ForecastRequest):
    model, info = registry.load_model(safe_name(req.model_id))
    return fc.forecast(model, info["features"], pre.load_processed(info["dataset"]), req.horizon)


@router.post("/peaks", response_model=list[PeakPoint], tags=["Prévision"])
def peaks(req: PeakRequest):
    model, info = registry.load_model(safe_name(req.model_id))
    df = pre.load_processed(info["dataset"])
    threshold = float(df["consumption"].quantile(req.percentile / 100))
    out = []
    for p in fc.forecast(model, info["features"], df, req.horizon):
        ratio = p["predicted"] / threshold
        risk = "Élevé" if ratio >= 1 else "Moyen" if ratio >= 0.9 else "Faible"
        out.append({**p, "risk": risk})
    return out


@router.post("/anomalies/detect", response_model=list[Anomaly], tags=["Anomalies"])
def anomalies(req: AnomalyRequest):
    return anomaly.detect(pre.load_processed(safe_name(req.dataset)), req.contamination)


@router.post("/explain", response_model=list[FeatureImportance], tags=["Explicabilité"])
def explain_model(req: ExplainRequest):
    model, info = registry.load_model(safe_name(req.model_id))
    return explain.shap_importance(model, pre.load_processed(info["dataset"]), info["features"], req.samples)
