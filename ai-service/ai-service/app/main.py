from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.routes import router

app = FastAPI(title="Smart Energy – Service IA", version="1.0.0",
              description="Prétraitement, prévision, pics, anomalies et explicabilité (SHAP)")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins, allow_methods=["*"], allow_headers=["*"])
app.include_router(router)


@app.get("/health", tags=["Système"])
def health():
    return {"status": "ok"}
