# Bug Tracker

A full-stack bug tracking application for managing software defects, ticket lifecycles, and team workflows.

Built with **React 19 + TypeScript** on the frontend (served via nginx in production) and **NestJS 11 + PostgreSQL** on the backend, with JWT authentication via httpOnly cookies, a State Pattern ticket lifecycle engine, and a full audit trail. Also ships with an optional **Electron desktop client**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 8 |
| Web server | nginx (Alpine) - serves the production frontend |
| Backend | NestJS 11, TypeScript |
| Database | PostgreSQL 15 (Docker) |
| ORM | TypeORM (Code-First) |
| Auth | JWT via httpOnly cookies |
| Testing | Jest |
| API Docs | Swagger |
| Desktop client | Electron 42 |
| Package manager | yarn 1.22.22 (via Corepack) |
| Infrastructure | Docker + Docker Compose |

---

## Prerequisites

- **Docker Desktop** — required, runs the full stack (db + backend + frontend)
- **Node.js 22 + Corepack** — only required if you want to build the Electron desktop client locally. Not needed to use the web app.

---

## Installation & Setup

The canonical way to run the project is via Docker. Everything - database, backend, frontend runs in containers.

### 1. Clone the repository
```bash
git clone https://github.com/Lurkerrrr/bug-tracker.git
cd bug-tracker
```

### 2. Configure backend environment
Copy the example env file and fill in a secure JWT token:
```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and replace the `JWT_TOKEN` placeholder with a securely generated token. The file comments include generation commands:
```bash
# PowerShell
-join ((1..128) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })

# bash
openssl rand -hex 64
```

All other values (`DATABASE_HOST=db`, `PORT=5000`, etc.) are already correct for the Docker setup — don't change them.

### 3. Start the full stack
Make sure Docker Desktop is running, then:
```bash
docker compose up --build
```

This builds and starts three containers:
- **postgres_db** — PostgreSQL 15 on host port `5434` (container port `5432`)
- **nest_backend** — NestJS API on host port `5000`
- **react_frontend** — nginx serving the React app on host port `3000`

First build takes ~2-3 minutes. Subsequent builds are cached and start in seconds.

### 4. Open the web app
Once you see `Nest application successfully started` and the nginx workers booted, open:
```
http://localhost:3000
```

You'll land on the login page. Use **Sign up** to register a new account, then log in.

Swagger API docs are available at:
```
http://localhost:5000/api/v1/docs
```

### 5. Shutting down
Press `Ctrl+C` in the terminal running compose, then:
```bash
docker compose down
```

Data persists in the `postgres_data_docker` Docker volume. To wipe the database and start fresh:
```bash
docker compose down -v
```

---

## Desktop Client (Electron) — optional

The project ships with an Electron desktop client that wraps the web app in a native window. The Docker stack must be running for the desktop client to work — Electron loads the React app from `http://localhost:3000` (the dockerized nginx) and talks to the backend on `http://localhost:5000`.

> ℹ️ The instructions below were verified on Windows. macOS and Linux builds are supported by `electron-builder` (configured for `.dmg` and `.AppImage` respectively) but were not tested as part of the project's verified workflow.

### Prerequisites
- Node.js 22 installed (Electron 42 requires `engines.node >= 22.12`)
- Corepack enabled

### 1. Enable Corepack and activate yarn
Corepack ships with Node 22 but needs to be enabled once:
```bash
corepack enable
corepack prepare yarn@1.22.22 --activate
yarn --version
# expected: 1.22.22
```

On Windows, this typically requires running PowerShell as Administrator.

### 2. Install frontend dependencies
```bash
cd frontend
yarn install
```

### 3. Build the Electron app
```bash
yarn electron:build
```

This produces:
- `frontend/release/win-unpacked/Bug Tracker.exe` — the executable
- `frontend/release/Bug Tracker Setup 0.0.0.exe` — Windows installer (NSIS)

On macOS and Linux, electron-builder will produce `.dmg` and `.AppImage` respectively.

> ℹ️ On Windows, the first build downloads winCodeSign binaries that contain Unix symlinks. **Windows Developer Mode** must be enabled to extract them (Settings → Privacy & Security → For developers → Developer Mode). One-time setting.

### 4. Run the desktop client
With the Docker stack running, launch the unpacked executable (PowerShell):
```bash
# from frontend/
& ".\release\win-unpacked\Bug Tracker.exe"
```

Or install the NSIS installer and run "Bug Tracker" from the Start menu.

The app opens with the same Bug Tracker UI as the web app, in its own native window.

---

## Running Tests
```bash
cd backend
yarn test
```
Expected output:
```
Test Suites: 14 passed, 14 total
Tests:       85 passed, 85 total
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
│   ├── tickets/      # Kanban board, ticket detail, modals, service
│   └── users/        # User-related logic
├── pages/            # Page components (BoardPage, BacklogPage, etc.)
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
| Assign to me | ❌ | ✅ | ❌ |
| Delete ticket | ✅ | ✅ | ✅ |

---

## Ticket State Machine

Implemented using the **State Design Pattern**. Each of the 11 states is a dedicated class extending `BaseTicketState`. Illegal transitions throw `BadRequestException` automatically.

```
To Do → In Progress → Code Review → Ready for QA → In Test → Done → Closed → Closed Out
           ↓                                            ↓       ↓
        Rejected                                    Reopened  Reopened
                                                        
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

Base URL: `http://localhost:5000/api/v1`
Interactive docs: `http://localhost:5000/api/v1/docs`

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login, sets httpOnly cookies | No |
| POST | `/auth/refresh` | Rotate tokens | Cookie |
| POST | `/auth/logout` | Invalidate refresh token | Cookie |
| GET | `/auth/me` | Get current user | Cookie |

### Users
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/users` | List all users | Yes |

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
