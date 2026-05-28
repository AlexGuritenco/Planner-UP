# Planner UP

Planner UP is a planning and productivity project split into a React frontend and an Express/TypeScript backend.

At the current stage, the frontend already implements the full UI flow for authentication screens, task management, agenda grouping, weekly progress tracking, and account settings. The backend exposes basic REST endpoints for auth, tasks, and account operations, but it is not yet wired into the frontend and stores data in memory only.

## Current Repository Layout

```text
project/
├── frontend/      # React + Vite client
├── backend/       # Express + TypeScript API
└── README.md
```

## Frontend

The frontend lives in `frontend/` and is built with React and Vite.

### Implemented UI Features

- Landing page with login and signup entry points
- Login form with client-side email and password validation
- Signup form with username, email, password, and password confirmation validation
- Dashboard with:
  - add task
  - edit task
  - delete task
  - mark task as done
- Task modal with due date picker
- Agenda page that groups pending tasks into:
  - Overdue
  - Today
  - Tomorrow
  - Next Week
  - Later
- Stats page with:
  - total tasks
  - completed tasks
  - remaining tasks
  - progress bar
- Account page with username and password validation
- Confirmation dialogs for task deletion and completion

### Frontend Tech Stack

- React 19
- Vite
- React Router DOM 7
- Ant Design
- Material UI
- React Icons
- React Datepicker

### Frontend Notes

- Task state is currently kept in React component state.
- Tasks are lost on refresh.
- Login, signup, and account updates are currently client-side UI flows only.
- `frontend/.env` already defines:
  - `VITE_API_URL=http://localhost:3000`
  - `VITE_API_BASE_URL=http://localhost:3000/api`
  but the current frontend code does not yet call the backend.

## Backend

The backend lives in `backend/` and is built with Express and TypeScript.

### Implemented API Areas

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/account/:id`
- `PATCH /api/account/:id`
- `DELETE /api/account/:id`

### Backend Behavior

- Data is stored in in-memory arrays.
- Data resets when the server restarts.
- No database integration is implemented yet.
- No real session or token-based authentication is implemented yet.

### Backend Tech Stack

- Node.js
- Express 5
- TypeScript
- Vitest
- ESLint
- Prettier

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

## Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

## Run the Backend

```bash
cd backend
npm install
npm run dev
```

Default backend URL:

```text
http://localhost:3000
```

API base URL:

```text
http://localhost:3000/api
```

## Useful Scripts

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
cd backend
npm run dev
npm run build
npm run start
npm run test
npm run lint
npm run type-check
```

## Project Status

This is currently a split frontend/backend project, but it is not yet fully integrated end to end.

What is already implemented:

- frontend task management UI
- frontend validation for auth/account forms
- backend REST endpoints for auth, tasks, and account management

What is still missing or partial:

- frontend to backend API integration
- persistent database storage
- real authentication/session handling
- production-ready account and task ownership logic