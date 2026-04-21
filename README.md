# Secure Task Space (Full Stack)

MERN-style application with:

1. Authentication: signup, login, logout, JWT, bcrypt, validation, error handling
2. Backend: Node.js + Express, MVC-style organization, middleware, REST APIs
3. Database: MongoDB Atlas + Mongoose models (User, Task)
4. Frontend: React + protected routes (Signup, Login, Dashboard)
5. Bonus feature: Task Manager with full CRUD per authenticated user

## Tech Stack

- Frontend: React (Vite), React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB Atlas + Mongoose
- Security: bcrypt, JWT, HTTP-only cookies, express-validator

## Project Structure

```text
backend/
  src/
    app.js
    server.js
    config/db.js
    controllers/
      auth.controller.js
      task.controller.js
    middleware/
      auth.middleware.js
      error.middleware.js
      validate.middleware.js
    models/
      User.js
      Task.js
    routes/
      auth.routes.js
      task.routes.js
    services/token.service.js
    utils/AppError.js
    validators/
      auth.validators.js
      task.validators.js
  .env.example

frontend/
  src/
    api/
      authApi.js
      http.js
      taskApi.js
    components/
      ProtectedRoute.jsx
      PublicOnlyRoute.jsx
    context/AuthContext.jsx
    hooks/useAuth.jsx
    pages/
      SignupPage.jsx
      LoginPage.jsx
      DashboardPage.jsx
    App.jsx
    main.jsx
    index.css
  .env.example
```

## Local Setup

### 1. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/auth_backend
JWT_SECRET=replace-with-a-very-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

Run backend:

```bash
npm run dev
```

### 2. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

App URLs (local):

- Frontend: http://localhost:5173
- Backend health: http://localhost:5000/api/health

## API Reference

Base URL: `http://localhost:5000/api`

### Auth APIs

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me` (protected)

Signup payload:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Task APIs (protected)

- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

Create task payload:

```json
{
  "title": "Finish assignment",
  "description": "Complete dashboard",
  "isCompleted": false
}
```

## Security Notes

- Passwords are hashed with bcrypt.
- JWT is signed using `JWT_SECRET`.
- Token is set as HTTP-only cookie for browser security.
- API also returns token in JSON for non-browser API clients.
- Validation and error handling are centralized.

## MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster.
2. Create a database user and whitelist your IP (or use `0.0.0.0/0` for testing only).
3. Copy the connection string into `MONGODB_URI`.
4. Restart backend.

## Deployment Guide

Automatic live deployment cannot be completed from this environment because it requires your cloud account access and credentials. Use the steps below to publish with live URLs.

### Backend on Render (or Railway)

1. Create a new Web Service from this repo.
2. Set root directory to `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN=7d`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://<your-vercel-domain>`
   - `COOKIE_SECURE=true`
   - `COOKIE_SAME_SITE=none`
6. Deploy and note backend URL, for example: `https://your-api.onrender.com`

### Frontend on Vercel

1. Import the same repo into Vercel.
2. Set root directory to `frontend`.
3. Framework preset: Vite.
4. Add env variable:
   - `VITE_API_URL=https://your-api.onrender.com/api`
5. Deploy and note frontend URL.

### Final production check

1. Update backend `CLIENT_URL` to the actual Vercel URL.
2. Re-deploy backend.
3. Test flow: signup -> login -> create task -> update task -> delete task -> logout.

## Useful Commands

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
```
