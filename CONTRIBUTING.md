# Guide de contribution

## Branches
- `main` : version stable, livrée à la fin de chaque Release
- `develop` : intégration du travail en cours
- `feature/US02-authentification` : une branche par User Story, créée depuis `develop`
- `fix/nom-du-bug` : corrections

Personne ne pousse directement sur `main` ou `develop` : tout passe par une Pull Request.

## Commits (Conventional Commits)
    feat(auth): add JWT login endpoint (US02)
    fix(buildings): handle null address on update
    docs: add sequence diagram for authentication
    test(users): add unit tests for user creation
Types : `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`. Scopes : `frontend`, `backend`, `ai`, ou le nom du module.

## Pull Request
1. Mettre `develop` à jour : `git pull origin develop`
2. Pousser la branche, ouvrir la PR vers `develop`, lier l'issue (`Closes #12`)
3. Au moins une personne de l'équipe relit et approuve
4. La CI doit être verte avant la fusion (fusion « Squash and merge »)

## Définition de « terminé »
- Le code fonctionne en local et les tests passent
- Aucun secret dans le code (utiliser `.env`, jamais commité)
- La PR est relue et fusionnée dans `develop`
- L'issue est déplacée dans « Done »

## Secrets
Chaque service a un `.env.example` : copiez-le en `.env` et remplissez vos valeurs.
Ne jamais commiter de mot de passe, de clé JWT ou d'identifiants e-mail.
