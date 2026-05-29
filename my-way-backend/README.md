# My Way Backend

Spring Boot API for competency tracking, career planning, and training recommendations.

## Features in this iteration

- Skills module: list/create/update/delete
- Career plans module: list/create/update/delete
- Trainings module: list + recommendations by category
- Networking module: professional connections CRUD
- JWT authentication: register/login + protected business endpoints
- Global API error handling and request validation
- CORS configuration for frontend integration

## Run locally

1. Configure `.env` in project root (auto-loaded at startup), or use OS environment variables
2. Start the API:

```bash
mvn spring-boot:run
```

The API runs by default on http://localhost:8080.

Environment loading order:
- Spring reads OS environment variables directly
- `.env` is also imported automatically via `spring.config.import`
- OS environment variables override values from `.env`

## Main endpoints

- GET /api/v1/health
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET/POST/PUT/DELETE /api/v1/skills
- GET/POST/PUT/DELETE /api/v1/career-plans
- GET /api/v1/trainings
- GET /api/v1/trainings/recommendations?category=backend
- GET/POST/PUT/DELETE /api/v1/networking/connections

## Database

- Default: H2 in-memory for quick startup
- Optional MySQL: set DB_URL, DB_USERNAME, DB_PASSWORD, DB_DRIVER
