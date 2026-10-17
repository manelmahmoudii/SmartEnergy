# Smart Energy

Plateforme intelligente de prédiction, détection d'anomalies et optimisation de la consommation énergétique.
TEK-UP University · Année universitaire 2026–2027

## Architecture
    frontend/    React + TypeScript + Vite        → http://localhost:5173
    backend/     Spring Boot + PostgreSQL + JWT   → http://localhost:8080
    ai-service/  FastAPI (ML, anomalies, SHAP)    → http://localhost:8000
    docs/        diagrammes UML et rapport
    scripts/     automatisation GitHub

Le navigateur parle au backend Spring Boot, qui appelle le service IA (clé `X-API-Key`).

## Lancer le projet en local
1. **Base de données** : installer PostgreSQL, créer la base `smartenergy`.
2. **Backend** : voir `backend/README.md` puis `mvn spring-boot:run`.
3. **Service IA** : voir `ai-service/README.md` puis `uvicorn app.main:app --reload --port 8000`.
4. **Frontend** : `cd frontend && npm install && npm run dev`.

## Équipe
| Nom | Rôle |
|---|---|
| Ines Agrebi | Product Owner |
| Nawres Mettichi | Scrum Master / Développeuse |
| Nour Ben Salem | Développeuse |
| Eya Karoui | Développeuse |
| Manel Mahmoudi | Développeuse |

## Organisation du travail
Voir [CONTRIBUTING.md](CONTRIBUTING.md) : branches, commits, Pull Requests, définition de « terminé ».
