# Team Task Manager (Task Pilot)

A full-stack web application for teams to create projects, assign tasks, and track progress with role-based access control (Admin / Member).

---

## Features

- Authentication (JWT आधारित Signup/Login)
- Role-based access control (Admin / Member)
- Project management (create projects, add/remove members)
- Task assignment and tracking (Todo / In Progress / Done, due dates)
- Dashboard with stats (total tasks, completed, overdue)
- Responsive UI built with Tailwind CSS

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB (Mongoose)
- Authentication: JWT (JSON Web Tokens)
- Deployment: Railway-compatible

## Folder Structure

Brief overview of the main folders you will find in the repository:

- `backend/` — Express API, Mongoose models, controllers, routes, middleware, and seed scripts.
	- `src/models` — Mongoose schemas (`User`, `Project`, `Task`).
	- `src/controllers` — Route handlers and business logic.
	- `src/routes` — Express routes for auth, projects, tasks, dashboard.
	- `src/middlewares` — Auth, role-based access, validation, error handlers.
	- `src/seed` — Sample data seeding script.

- `frontend/` — React (Vite) app with Tailwind styling and Context API for auth.
	- `src/api` — API client wrappers (`axios`) for auth, projects, tasks, dashboard.
	- `src/context` — `AuthContext` to manage JWT session.
	- `src/pages` — App pages: Login, Signup, Dashboard, Projects, Task forms.
	- `src/components` — Reusable UI components and forms.

## Setup Instructions (Local)

Prerequisites:

- Node.js >= 18
- npm
- MongoDB (local or remote)

### Backend

1. Open a terminal and navigate to `backend/`:

```bash
cd backend
```

2. Copy the environment example and update values:

```bash
# Windows (PowerShell/CMD)
copy .env.example .env
# macOS / Linux
cp .env.example .env
```

3. Install dependencies, seed sample data, and start dev server:

```bash
npm install
npm run seed    # optional: creates sample admin/user/project/tasks
npm run dev     # starts server (nodemon)
```

Server health check: GET `http://localhost:5000/api/health`

### Frontend

1. Open a terminal and navigate to `frontend/`:

```bash
cd frontend
```

2. Copy the environment example and set the API base URL (must include `/api`):

```bash
# Windows
copy .env.example .env
# macOS / Linux
cp .env.example .env
```

3. Install and run the dev server:

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Demo Credentials

- Admin: admin@example.com / password123 (seed script creates this user)

## Environment Variables (`.env.example`)

### Backend (`backend/.env.example`)

```
MONGO_URI=mongodb://localhost:27017/teamtaskmanager
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

### Frontend (`frontend/.env.example`)

```
VITE_API_BASE_URL=http://localhost:5000/api
```

> Note: Do NOT commit `.env` files. The repository includes `.env.example` for reference.

## API Endpoints (Main)

Authentication:

- `POST /api/auth/signup` — Signup (name, email, password, role)
- `POST /api/auth/login` — Login (email, password)
- `GET /api/auth/me` — Get current user (protected)

Projects:

- `POST /api/projects` — Create project (admin)
- `GET /api/projects` — List accessible projects
- `GET /api/projects/:id` — Project details
- `PUT /api/projects/:id` — Update project (admin)
- `DELETE /api/projects/:id` — Delete project and related tasks (admin)
- `POST /api/projects/:id/members` — Add members (admin)
- `DELETE /api/projects/:id/members` — Remove members (admin)

Tasks:

- `POST /api/tasks` — Create task (admin)
- `GET /api/tasks` — List tasks (filters: project, assignedTo, status)
- `GET /api/tasks/:id` — Task details
- `PUT /api/tasks/:id` — Update task (admins or assignee limited)
- `DELETE /api/tasks/:id` — Delete task (admin)

Dashboard:

- `GET /api/dashboard` — Get stats and recent tasks (filters available)

## Deployment (Railway)

1. Create two Railway services (or a single monorepo setup): one for backend, one for frontend.
2. In Railway, set environment variables for the backend (`MONGO_URI`, `JWT_SECRET`, etc.).
3. For frontend, set `VITE_API_BASE_URL` to the deployed backend API URL.
4. Configure build/start commands:

- Backend: `npm install` -> `npm start` (ensure `PORT` env var is used)
- Frontend: `npm install` -> `npm run build` (or serve static build via Railway/static)

Railway specifics: point Railway to root repo; use separate services or environment variables to target the correct subfolders.

## Screenshots

Add screenshots of the app here (Dashboard, Project view, Task form).

## Author

Mukesh Choudhary

---

If you need, I can also add detailed API docs, Postman collection, or a short deployment guide for Railway with CI steps.
