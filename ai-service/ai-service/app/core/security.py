import re
from fastapi import Header, HTTPException
from .config import settings

NAME_RE = re.compile(r"^[A-Za-z0-9_\-]{1,80}$")


def require_api_key(x_api_key: str = Header(default="")) -> None:
    """Clé partagée avec Spring Boot. Si AI_API_KEY est vide, la protection est désactivée (dev)."""
    if settings.api_key and x_api_key != settings.api_key:
        raise HTTPException(status_code=401, detail="Clé API invalide")


def safe_name(name: str) -> str:
    """Empêche les chemins du type ../../x dans les noms de jeux de données ou de modèles."""
    if not NAME_RE.match(name):
        raise HTTPException(status_code=400, detail="Nom invalide (lettres, chiffres, - et _ uniquement)")
    return name
