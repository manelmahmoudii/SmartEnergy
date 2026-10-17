import json
import uuid
from datetime import datetime
import joblib
from fastapi import HTTPException
from ..core.config import settings

_INDEX = lambda: settings.models_dir / "registry.json"


def list_models() -> list[dict]:
    return json.loads(_INDEX().read_text()) if _INDEX().exists() else []


def save_model(model, name: str, dataset: str, metrics: dict, features: list[str]) -> dict:
    mid = f"{name}-{uuid.uuid4().hex[:8]}"
    info = {"id": mid, "model": name, "dataset": dataset, "created_at": datetime.now().isoformat(timespec="seconds"),
            "metrics": metrics, "features": features}
    joblib.dump(model, settings.models_dir / f"{mid}.joblib")
    _INDEX().write_text(json.dumps(list_models() + [info], indent=2))
    return info


def load_model(model_id: str):
    info = next((m for m in list_models() if m["id"] == model_id), None)
    if not info:
        raise HTTPException(status_code=404, detail="Modèle introuvable")
    return joblib.load(settings.models_dir / f"{model_id}.joblib"), info
