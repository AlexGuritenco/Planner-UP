# Planner UP

Planner UP is a planning and productivity project split into a React frontend and an Express/TypeScript backend.

The frontend is connected to the backend API, and the backend persists data in MongoDB. Real-time task synchronisation is handled via a native WebSocket server.

## Current Repository Layout

```text
project/
├── frontend/      # React + Vite client
├── backend/       # Express + TypeScript API + MongoDB + WebSocket
└── README.md
```

## Frontend

The frontend lives in `frontend/` and is built with React and Vite.

### Implemented Features

- Landing page with login and signup entry points
- Login form with client-side validation
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
- Account page with username/password update flow and account deletion
- Confirmation dialogs for task deletion, completion, and account deletion
- Real-time task sync via WebSocket (create, update, delete reflected instantly across tabs)

### Frontend Tech Stack

- React 19
- Vite
- React Router DOM 7
- Ant Design
- Material UI
- React Icons
- React Datepicker
- Axios

### Frontend Environment

`frontend/.env` should point to the backend API:

```env
VITE_API_URL=http://localhost:3000
VITE_API_BASE_URL=http://localhost:3000/api
```

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

- Data is stored in MongoDB collections
- Accounts are stored in the `accounts` collection
- Tasks are stored in the `tasks` collection
- Passwords are hashed with `bcryptjs`
- Login returns a JWT token
- Protected routes require `Authorization: Bearer <token>`
- The server connects to MongoDB before it starts listening for requests
- Deleting an account also deletes all tasks belonging to that user
- After each task mutation (create, update, delete), the server pushes a WebSocket event to all active sessions of that user

### WebSocket

The WebSocket server runs on the same port as the REST API (no second port needed).

**Connection flow:**
1. Client opens `new WebSocket('ws://localhost:3000')`
2. Client sends `{ type: 'subscribe', token: '<jwt>', interestedIn: ['task:created', 'task:updated', 'task:deleted'] }`
3. Server verifies the JWT and validates the requested event types
4. Server replies `{ type: 'subscribed' }`
5. Server pushes `{ type: 'task:created' | 'task:updated' | 'task:deleted', payload }` after each mutation

**Client behaviour:**
- Subscription mechanism: client declares which events it wants; server only sends matching events
- Idempotent handlers: each event type checks before applying to avoid duplicate state updates from optimistic UI
- Exponential backoff reconnection: starts at 1s, doubles each attempt, caps at 30s
- Re-fetches tasks via REST after reconnecting to catch any events missed while offline

### Backend Tech Stack

- Node.js
- Express 5
- TypeScript
- MongoDB Node Driver
- JWT (`jsonwebtoken`)
- bcryptjs
- ws (WebSocket server)
- Vitest
- ESLint
- Prettier

### Backend Environment

The backend expects env files under `backend/config/`.

Development runs use:

```text
backend/config/.env.development
```

At minimum, configure:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
DB_NAME=PlannerUp
```

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm
- A running MongoDB database or MongoDB Atlas connection string

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

WebSocket URL:

```text
ws://localhost:3000
```
## Project Status

### Implemented

- Frontend authentication, account, dashboard, agenda, and stats flows
- Frontend integration with backend auth/account/task endpoints
- Backend REST endpoints for auth, tasks, and account management
- MongoDB persistence for accounts and tasks
- JWT-based protected routes
- Account deletion with cascade delete of all user tasks
- WebSocket server with JWT authentication and subscription mechanism
- Real-time task sync across browser tabs with idempotent handlers and exponential backoff reconnection