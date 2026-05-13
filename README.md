# Bug Tracker

**Bug Tracker** is a full-stack desktop application designed for tracking software defects, managing ticket lifecycles, and coordinating development team workflows. The system utilizes a React-based frontend (wrapped in Electron) for the user interface and a NestJS backend with PostgreSQL for persistent data storage.

The entire application is strictly typed using **TypeScript**, ensuring highly reliable code, predictable data models, and a robust developer experience. It implements a decoupled client-server architecture with stateless authentication via JSON Web Tokens (JWT), ensuring secure and scalable user session management.

---

## Technical Architecture

The project follows a professional **Module-Controller-Service** pattern utilizing NestJS dependency injection, strictly typed classes, and clean separation of concerns.

### 1. Frontend (Client)
* **Framework:** React 18 with TypeScript, utilizing Functional Components and Hooks.
* **Build Tool:** Vite for fast development and optimized production builds.
* **Routing:** React Router DOM (v6) for client-side navigation and protected route management.
* **State Management:** React Context API (AuthProvider, ThemeProvider) for global state handling.
* **Drag & Drop:** `@dnd-kit` for Kanban board drag-and-drop ticket management.
* **HTTP Client:** Axios with request interceptors for automatic JWT token injection.
* **UI/UX:** Custom CSS variables-based theming system supporting Light and Dark modes.

### 2. Backend (Server)
* **Framework:** NestJS 11 — a scalable, modular Node.js framework built on top of Express.
* **Architecture:** Module-based OOP with Controllers, Services, and Guards for maximum code reuse.
* **Database:** PostgreSQL 17 managed via Docker, accessed through TypeORM (Code-First approach).
* **Authentication:**
    * **JWT (JSON Web Token):** Signed tokens with embedded user roles and configurable expiration.
    * **Bcrypt:** Cryptographic password hashing with salt rounds for secure credential storage.
* **Security & Validation:**
    * `class-validator` — strict DTO payload validation on all endpoints.
    * `@nestjs/throttler` — rate limiting to prevent brute-force attacks (10 req/min).
    * `helmet` — HTTP security headers protection.
* **Guards:** `JwtAuthGuard` for authentication, `RolesGuard` for role-based access control (RBAC).

### 3. Data Flow
1. **Request:** Client sends HTTP request with `Authorization: Bearer <token>` header for protected routes.
2. **Verification:** `JwtAuthGuard` verifies the JWT signature and extracts user identity and role.
3. **Authorization:** `RolesGuard` checks if the user's role has permission for the requested operation.
4. **Execution:** Controller processes the request, delegates business logic to the Service layer.
5. **Response:** Server returns JSON data to the client.

### 4. State Machine (Ticket Lifecycle)
The ticket lifecycle is implemented using the **State Design Pattern**. Each of the 11 states is a dedicated class extending `BaseTicketState`. Illegal transitions automatically throw `BadRequestException`, enforcing workflow integrity at the code level.

```
To Do → In Progress → Code Review → Ready for QA → In Test → Done → Closed → Closed out
                                                        ↓
                                                    Reopened
         ↓                                              ↓
      Rejected                                    Blocked/On Hold
```

Every state transition requires a mandatory comment, creating a full audit trail.

### 5. Automated Testing
* **Framework:** Jest for unit testing.
* **Coverage:** 82 tests across 14 test suites — **100% passing**.
* **Strategy:** One spec file per state class, covering all valid transitions and illegal transition rejection.
* **Mocking:** TypeORM repositories and NestJS services mocked with `jest.fn()` for isolated unit tests.

---

## Security Features Implemented

* **Strict TypeScript Interfaces:** End-to-end type safety preventing payload mismatches and runtime errors.
* **JWT Authentication:** Secure token-based authentication with role-based claims (Admin, Developer, Tester).
* **RBAC (Role-Based Access Control):** `@Roles()` decorator on controller endpoints restricts actions by user role.
* **Input Validation:** `class-validator` DTOs prevent malformed data and injection vectors on every endpoint.
* **Password Hashing:** bcrypt with 10 salt rounds ensures credentials are never stored in plaintext.
* **Rate Limiting:** Global throttler guard limits requests per IP to prevent brute-force attacks.
* **Security Headers:** Helmet middleware sets secure HTTP headers on every response.

---

## Database Schema

The application uses a relational PostgreSQL database managed by TypeORM with automatic schema synchronization in development.

### Table: users
| Column | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Auto-generated unique identifier. |
| `username` | TEXT | UNIQUE, NOT NULL | User login credential. |
| `email` | TEXT | UNIQUE, NOT NULL | User email address. |
| `password` | TEXT | NOT NULL | Hashed password string (bcrypt). |
| `role` | ENUM | DEFAULT 'developer' | Access level: admin, developer, tester. |
| `createdAt` | TIMESTAMP | NOT NULL | Record creation timestamp. |
| `updatedAt` | TIMESTAMP | NOT NULL | Record last update timestamp. |

### Table: tickets
| Column | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Auto-generated unique identifier. |
| `title` | TEXT | NOT NULL | Summary of the ticket. |
| `description` | TEXT | OPTIONAL | Detailed description of the issue. |
| `type` | ENUM | NOT NULL | Ticket type: Bug, Task, Epic. |
| `priority` | ENUM | DEFAULT 'Medium' | Priority level: Low, Medium, High, Critical. |
| `status` | VARCHAR | DEFAULT 'To Do' | Current state in the lifecycle. |
| `statusComment` | TEXT | OPTIONAL | Comment provided on last status change. |
| `reporterId` | UUID | FOREIGN KEY | ID of the user who created the ticket. |
| `assigneeId` | UUID | FOREIGN KEY | ID of the user assigned to the ticket. |
| `timeLogged` | INTEGER | DEFAULT 0 | Total time logged in minutes. |
| `createdAt` | TIMESTAMP | NOT NULL | Record creation timestamp. |
| `updatedAt` | TIMESTAMP | NOT NULL | Record last update timestamp. |

---

## API Documentation

The backend exposes a RESTful API running on port `3000`. Interactive Swagger documentation is available at `http://localhost:3000/api/docs`.

### Authentication
| Method | Endpoint | Description | Auth Required |
|:--- |:--- |:--- |:--- |
| **POST** | `/auth/register` | Registers a new user account and hashes credentials. | No |
| **POST** | `/auth/login` | Authenticates user and returns JWT token. | No |

### Tickets
| Method | Endpoint | Description | Auth Required |
|:--- |:--- |:--- |:--- |
| **GET** | `/tickets` | Retrieves all tickets. | Yes |
| **POST** | `/tickets` | Creates a new ticket. | Yes (Admin, Tester) |
| **GET** | `/tickets/:id` | Retrieves a ticket by ID. | Yes |
| **PUT** | `/tickets/:id` | Updates ticket details. | Yes |
| **PATCH** | `/tickets/:id/transition` | Changes ticket status (requires comment). | Yes |
| **PATCH** | `/tickets/:id/log-time` | Logs time on a ticket (minutes). | Yes (Developer) |
| **PATCH** | `/tickets/:id/assign-to-me` | Assigns ticket to current user. | Yes (Developer) |

---

## Installation and Setup

**Prerequisites:** Node.js (v18+), Docker Desktop.

### 1. Clone the Repository
```bash
git clone https://github.com/UladzislauSopat/project.git
cd project
```

---

### 2. Start the Database
Make sure **Docker Desktop is open and running**, then:
```bash
docker compose up -d
```
This starts PostgreSQL 17 on port `5433` and Adminer (DB UI) on port `8080`.

---

### 3. Backend Configuration
Create a `.env` file inside the `backend/` folder:
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

Then install dependencies and start:
```bash
cd backend
npm install
npm run start:dev
```
Backend runs on: `http://localhost:3000`
Swagger docs: `http://localhost:3000/api/docs`

---

### 4. Frontend Configuration
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

### 5. Running Tests
```bash
cd backend
npm run test
```
Expected output:
```
Test Suites: 14 passed, 14 total
Tests:       82 passed, 82 total
```