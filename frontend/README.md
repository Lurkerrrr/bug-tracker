# Bug Tracker — Frontend

React 18 + TypeScript + Vite frontend for the Bug Tracker application.

## Tech Stack

- React 18
- TypeScript
- Vite
- @dnd-kit (drag and drop)
- Axios (HTTP client)

## Prerequisites

- Node.js 18+
- Backend running on `http://localhost:3000`

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
# runs on http://localhost:5173
```

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── api/              # Axios client with interceptors
├── app/              # App entry, Router, providers (Auth, Theme)
├── features/
│   ├── auth/         # Login, register, auth service
│   └── tickets/      # Kanban board, ticket detail, modals, service
├── pages/            # Page components (BoardPage, LoginPage, etc.)
└── shared/           # Reusable UI components, layout, constants
```

## Features

- JWT authentication via httpOnly cookies
- Kanban board with drag and drop
- Ticket creation, transition, and deletion
- Light/Dark theme
- Auto token refresh