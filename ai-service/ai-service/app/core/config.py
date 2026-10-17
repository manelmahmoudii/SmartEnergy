import os
from pathlib import Path


class Settings:
    api_key: str = os.getenv("AI_API_KEY", "")
    storage: Path = Path(os.getenv("STORAGE_DIR", "./storage"))
    cors_origins: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:8080").split(",")

    @property
    def raw_dir(self) -> Path: return self.storage / "raw"
    @property
    def processed_dir(self) -> Path: return self.storage / "processed"
    @property
    def models_dir(self) -> Path: return self.storage / "models"

    def ensure_dirs(self) -> None:
        for d in (self.raw_dir, self.processed_dir, self.models_dir):
            d.mkdir(parents=True, exist_ok=True)


settings = Settings()
settings.ensure_dirs()
