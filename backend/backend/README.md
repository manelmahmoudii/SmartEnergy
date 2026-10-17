# Smart Energy – Backend (Spring Boot)

Java 17 · Spring Boot 3.3 · Spring Security + JWT · PostgreSQL · Flyway · Swagger

## Démarrage
1. Installer Java 17, Maven et PostgreSQL.
2. Créer la base : `CREATE DATABASE smartenergy;`
3. Copier `.env.example` vers `.env` et définir les variables dans votre IDE (DB_PASSWORD, JWT_SECRET, MAIL_*).
4. Lancer : `mvn spring-boot:run`
5. Swagger : http://localhost:8080/swagger-ui.html
Le premier administrateur est créé au démarrage (ADMIN_EMAIL / ADMIN_PASSWORD, voir application.yml).

## Structure
```
src/main/java/tn/tekup/smartenergy/
├── config/       SecurityConfig, DataInitializer
├── security/     JwtService, JwtAuthFilter, CustomUserDetailsService
├── controller/   Auth, User, Building
├── service/      logique métier + EmailService
├── repository/   Spring Data JPA
├── entity/       User, Building, PasswordResetToken + enums
├── dto/          requêtes et réponses (records validés)
└── exception/    ApiException, GlobalExceptionHandler
src/main/resources/db/migration/   scripts Flyway (V1__init_schema.sql)
```
Pour ajouter une table : nouveau script `V2__...sql`, jamais de modification d'un script déjà appliqué.

## API du Sprint 1
| Méthode | URL | Accès |
|---|---|---|
| POST | /api/auth/register, /login, /forgot-password, /reset-password | public |
| GET, PUT | /api/users/me | connecté |
| GET | /api/users?status=&role=&q= , /api/users/pending | ADMIN |
| PATCH | /api/users/{id}/approve, /reject, /ban | ADMIN |
| POST, PUT, DELETE | /api/users, /api/users/{id} | ADMIN |
| GET | /api/buildings, /api/buildings/{id} | connecté |
| POST, PUT, DELETE | /api/buildings | ADMIN |

## Règles
- Branche `feature/US0X-nom`, Pull Request vers `develop`, commits `feat(auth): ...`
- Jamais de secrets dans Git (`.env` est ignoré)
- Un test par service avant la PR (`mvn test`)

## À faire ensuite
Export des utilisateurs (US04, ST04.14), « Remember Me », packages `data`, `ml` et `optimization` pour les Sprints 2 à 5.
