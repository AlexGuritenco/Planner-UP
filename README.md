# Planner UP

Planner UP is a planning and productivity project split into a React frontend and an Express/TypeScript backend.

The frontend is connected to the backend API, and the backend now persists data in MongoDB instead of keeping it only in memory.

## Current Repository Layout

```text
project/
├── frontend/      # React + Vite client
├── backend/       # Express + TypeScript API + MongoDB
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
- Account page with username/password update flow
- Confirmation dialogs for task deletion and completion

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

### Backend Tech Stack

- Node.js
- Express 5
- TypeScript
- MongoDB Node Driver
- JWT (`jsonwebtoken`)
- bcryptjs
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

This is now a working split frontend/backend project with MongoDB persistence.

What is already implemented:

- frontend authentication, account, dashboard, agenda, and stats flows
- frontend integration with backend auth/account/task endpoints
- backend REST endpoints for auth, tasks, and account management
- MongoDB persistence for accounts and tasks
- JWT-based protected routes

What is still missing or partial:

- WebSockets implementation
