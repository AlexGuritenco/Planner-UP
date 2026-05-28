# Planner UP

A personal productivity web application built with React and Vite.
Manage your tasks, track deadlines, and monitor your weekly goals — all in one place.

This is a pre-version, since it only includes the frontend.

## Features

- Task board with add, edit, delete, and mark as done
- Agenda view organized by due date
- Weekly goal tracker with live progress bar
- Confirmation dialogs for delete and log out
- Responsive design with mobile support
- Form validation on login and signup

## Tech Stack

- React 18 + Vite
- React Router v6
- Material UI
- React Icons
- Ant Design

## Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
git clone https://github.com/your-username/planner-up.git
cd planner-up
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Project Structure

```
src/
├── components/
│   ├── ConfirmDialog.jsx
│   ├── NavBar.jsx
│   ├── PasswordHandler.jsx
│   ├── TaskModal.jsx
│   └── validators.js
├── pages/
│   ├── Account.jsx
│   ├── Agenda.jsx
│   ├── Dashboard.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── SignUp.jsx
│   └── StatsCard.jsx
├── utils/
│   └── dateUtils.js
├── App.css
├── App.jsx
└── main.jsx
```
## Notes
- Backend will use: Node.js + Express + MongoDB
- Task data is stored in memory only and resets on page refresh
- Authentication will be added with the backend
