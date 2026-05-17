# Bug Tracker

A full-stack bug tracking application for managing software defects, ticket lifecycles, and team workflows.

Built with **React 18 + TypeScript** on the frontend and **NestJS 11 + PostgreSQL** on the backend, with JWT authentication via httpOnly cookies, a State Pattern ticket lifecycle engine, and a full audit trail.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Backend | NestJS 11, TypeScript |
| Database | PostgreSQL 17 (Docker) |
| ORM | TypeORM (Code-First) |
| Auth | JWT via httpOnly cookies |
| Testing | Jest |
| API Docs | Swagger |
| Infrastructure | Docker + Docker Compose |

---

## Prerequisites

- Node.js v18+
- Docker Desktop

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/UladzislauSopat/project.git
cd project
```

### 2. Start the database
Make sure Docker Desktop is running, then:
```bash
docker compose up -d
```
This starts:
- PostgreSQL 17 on port `5433`
- Adminer (DB UI) on port `8080`

### 3. Backend setup
Create a `.env` file inside `backend/` — use `backend/.env.example` as reference:
```env
ENV=development
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=postgres

JWT_TOKEN=your-super-secret-jwt-key
JWT_EXPIRATION=15m
JWT_EXPIRATION_EXCHANGE=7d
```

Then:
```bash
cd backend
npm install
npm run start:dev
# runs on http://localhost:3000
# Swagger docs at http://localhost:3000/api/v1/docs
```

### 4. Frontend setup
```bash
cd frontend
npm install
npm run dev
# runs on http://localhost:5173
```

---

## Running Tests
```bash
cd backend
npm run test
```
Expected output:
```
Test Suites: 14 passed, 14 total
Tests:       84 passed, 84 total
```

---

## Architecture

### Module-Controller-Service (NestJS)
The backend follows NestJS's standard Module-Controller-Service pattern with dependency injection, strict DTO validation, and clean separation of concerns.

### Feature-based (React)
The frontend uses a feature-folder structure:
```
src/
├── api/              # Axios client with interceptors
├── app/              # App entry, Router, providers (Auth, Theme)
├── features/
│   ├── auth/         # Login, register, auth service
│   └── tickets/      # Kanban board, ticket detail, modals, service
├── pages/            # Page components
└── shared/           # Reusable UI components, layout, constants
```

---

## Authentication

- JWT tokens issued as **httpOnly cookies** (not localStorage or Authorization headers)
- **Access token** — 15 minute TTL
- **Refresh token** — 7 day TTL, rotated on every use, stored as SHA-256 hash in DB
- On app load, session is verified via `GET /api/v1/auth/me`
- Concurrent 401 responses are serialized into a single refresh call (no race condition)

---

## Role-Based Access Control (RBAC)

| Action | Admin | Developer | Tester |
|---|---|---|---|
| Create ticket | ✅ | ✅ | ✅ |
| View all tickets | ✅ | ✅ | ✅ |
| Update ticket | ✅ | ✅ | ✅ |
| Transition status | ✅ | ✅ | ✅ |
| Log time | ✅ | ✅ | ❌ |
| Assign to me | ✅ | ✅ | ❌ |
| Delete ticket | ✅ | ✅ | ✅ |

---

## Ticket State Machine

Implemented using the **State Design Pattern**. Each of the 11 states is a dedicated class extending `BaseTicketState`. Illegal transitions throw `BadRequestException` automatically.

```
To Do → In Progress → Code Review → Ready for QA → In Test → Done → Closed → Closed Out
           ↓               ↓                                    ↓       ↓
        Rejected      In Progress                           Reopened  Reopened
           ↓               
      Blocked/On Hold ←──────────────────────── (from any active state)
           ↓
       In Progress / To Do
```

Every transition requires a **mandatory comment**, recorded permanently in the `ticket_events` audit table.

---

## Audit Trail

Every ticket lifecycle event is recorded in the `ticket_events` table:

| Event | Trigger |
|---|---|
| `CREATED` | Ticket created |
| `TRANSITIONED` | Status changed |
| `UPDATED` | Ticket fields updated |
| `ASSIGNED` | Assigned to a user |
| `TIME_LOGGED` | Time logged |
| `DELETED` | Ticket deleted |

Events are stored **without FK constraints** — they survive ticket and user deletion. `ticketTitle` and `userUsername` are denormalized for readable history.

Retrieve events: `GET /api/v1/tickets/:id/events`

---

## Security

| Feature | Detail |
|---|---|
| httpOnly cookies | JWT tokens inaccessible to JavaScript |
| Refresh token rotation | New token pair on every refresh |
| SHA-256 token hashing | Raw tokens never stored in DB |
| bcrypt | Cost factor 12 |
| RBAC | `@Roles()` decorator + `RolesGuard` |
| Rate limiting | 5/min on login, 10/min on register and refresh |
| Helmet | Explicit CSP + security headers |
| Body size limit | 50kb max request body |
| Input validation | `class-validator` with `whitelist` + `forbidNonWhitelisted` |
| Env-gated config | `synchronize` and `cookie.secure` off in production |

---

## Database Schema

### Table: `users`
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `username` | TEXT | Unique login credential |
| `email` | TEXT | Unique email address |
| `password` | TEXT | bcrypt hash |
| `role` | ENUM | `admin`, `developer`, `tester` |
| `createdAt` | TIMESTAMP | Creation time |
| `updatedAt` | TIMESTAMP | Last update time |

### Table: `tickets`
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `title` | TEXT | Ticket summary |
| `description` | TEXT | Detailed description |
| `type` | ENUM | `Bug`, `Task`, `Epic` |
| `priority` | ENUM | `Low`, `Medium`, `High`, `Critical` |
| `status` | VARCHAR | Current lifecycle state |
| `statusComment` | TEXT | Last transition comment |
| `reporterId` | UUID | FK → users |
| `assigneeId` | UUID | FK → users |
| `timeLogged` | INTEGER | Total minutes logged |
| `createdAt` | TIMESTAMP | Creation time |
| `updatedAt` | TIMESTAMP | Last update time |

### Table: `ticket_events`
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `ticketId` | UUID | Ticket reference (no FK) |
| `ticketTitle` | VARCHAR | Denormalized ticket title |
| `userId` | UUID | User reference (no FK) |
| `userUsername` | VARCHAR | Denormalized username |
| `eventType` | ENUM | `CREATED`, `TRANSITIONED`, `UPDATED`, `ASSIGNED`, `TIME_LOGGED`, `DELETED` |
| `fromStatus` | VARCHAR | Previous status |
| `toStatus` | VARCHAR | New status |
| `comment` | TEXT | Reason or comment |
| `createdAt` | TIMESTAMP | Event time |

### Table: `refresh_tokens`
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `tokenHash` | TEXT | SHA-256 hash of refresh token |
| `userId` | UUID | FK → users |
| `expiresAt` | TIMESTAMP | Token expiry time |

---

## API Reference

Base URL: `http://localhost:3000/api/v1`
Interactive docs: `http://localhost:3000/api/v1/docs`

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login, sets httpOnly cookies | No |
| POST | `/auth/refresh` | Rotate tokens | Cookie |
| POST | `/auth/logout` | Invalidate refresh token | Cookie |
| GET | `/auth/me` | Get current user | Cookie |

### Tickets
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/tickets` | List all tickets | Yes |
| POST | `/tickets` | Create ticket | Yes |
| GET | `/tickets/:id` | Get ticket by ID | Yes |
| PUT | `/tickets/:id` | Update ticket | Yes |
| PATCH | `/tickets/:id/transition` | Transition status | Yes |
| PATCH | `/tickets/:id/log-time` | Log time (minutes) | Yes |
| PATCH | `/tickets/:id/assign-to-me` | Assign to current user | Yes |
| DELETE | `/tickets/:id` | Delete ticket (requires reason) | Yes |
| GET | `/tickets/:id/events` | Get audit event history | Yes |

---

## Adminer (Database UI)

Available at `http://localhost:8080` when Docker is running.

| Field | Value |
|---|---|
| System | PostgreSQL |
| Server | `db` |
| Username | `postgres` |
| Password | `postgres` |
| Database | `postgres` |

> ⚠️ **Development only.** Adminer is not password-protected and should never be exposed in a production environment.