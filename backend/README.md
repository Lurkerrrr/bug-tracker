# Bug Tracker — Backend

NestJS 11 + TypeScript backend for the Bug Tracker application.

## Tech Stack

- NestJS 11
- TypeScript
- PostgreSQL 17 (via Docker)
- TypeORM
- JWT authentication (httpOnly cookies)
- Bcrypt (cost factor 12)
- Swagger

## Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)

## Setup

```bash
# 1. Start the database
docker compose up -d

# 2. Install dependencies
npm install

# 3. Create .env file in backend/ (see .env.example in root)
```

## Development

```bash
npm run start:dev
# runs on http://localhost:3000
# Swagger docs at http://localhost:3000/api/v1/docs
```

## Tests

```bash
# unit tests
npm run test

# test coverage
npm run test:cov
```

## Project Structure

```
src/
├── auth/             # Register, login, refresh, logout, JWT strategy, guards
├── tickets/          # CRUD, state machine, transitions, DTOs
│   └── states/       # 11 ticket state classes + factory
├── users/            # User entity and service
└── config/           # JWT and TypeORM config
```

## Ticket State Machine

```
To Do → In Progress → Code Review → Ready for QA → In Test → Done → Closed → Closed Out
                                                        ↓              ↓
                                                    Reopened       Reopened
         ↓                                              ↓
      Rejected                                    Blocked/On Hold
```

## Environment Variables

| Variable | Example | Description |
|---|---|---|
| `ENV` | `development` | Environment |
| `PORT` | `3000` | Server port |
| `DATABASE_HOST` | `localhost` | PostgreSQL host |
| `DATABASE_PORT` | `5433` | PostgreSQL port |
| `DATABASE_USER` | `postgres` | PostgreSQL user |
| `DATABASE_PASSWORD` | `postgres` | PostgreSQL password |
| `DATABASE_NAME` | `postgres` | PostgreSQL database |
| `JWT_TOKEN` | `your-secret` | JWT signing secret |
| `JWT_EXPIRATION` | `15m` | Access token TTL |
| `JWT_EXPIRATION_EXCHANGE` | `7d` | Refresh token TTL |

## Security

- httpOnly cookies for JWT tokens
- Refresh token rotation with SHA-256 hashing
- RBAC with `@Roles()` decorator
- Rate limiting on auth endpoints
- Helmet with explicit CSP
- Request body size limit (50kb)