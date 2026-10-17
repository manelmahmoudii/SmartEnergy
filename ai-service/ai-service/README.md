# Smart Energy – Service IA (FastAPI)

Python 3.10+ · FastAPI · pandas · scikit-learn · XGBoost · LightGBM · SHAP

## Démarrage
    python -m venv venv && venv\Scripts\activate      # Linux/Mac : source venv/bin/activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload --port 8000
Documentation interactive : http://localhost:8000/docs

## Structure
    app/
    ├── main.py            application FastAPI
    ├── core/              config (variables d'environnement), sécurité (clé API, noms de fichiers sûrs)
    ├── api/routes.py      endpoints
    ├── schemas/           modèles Pydantic (entrées/sorties)
    └── services/          preprocessing · features · forecasting · anomaly · explain · registry
    storage/               raw/ processed/ models/ (ignorés par Git)
    tests/                 pytest

## Pipeline
1. `POST /data/upload?dataset=bloc_b` : CSV `timestamp,consumption[,temperature]` (Kaggle ou export du backend)
2. `POST /data/preprocess?dataset=bloc_b` : doublons, manquants, aberrants, rapport de qualité
3. `POST /models/train` : `{"dataset":"bloc_b","model":"xgboost"}` → MAE, RMSE, R² (découpe chronologique)
4. `POST /forecast`, `POST /peaks` : prévision et risque de pic
5. `POST /anomalies/detect` : IsolationForest, gravité Moyenne / Élevée / Critique
6. `POST /explain` : importance SHAP des variables

## Intégration avec Spring Boot
Le backend appelle ce service avec l'en-tête `X-API-Key` (variable `AI_API_KEY`). Le navigateur ne doit jamais appeler FastAPI directement en production.

## Tests : `pytest`
