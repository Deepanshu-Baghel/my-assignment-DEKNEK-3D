# Auth + Backend (Topics 1 and 2)

This project implements the first two requested topics:

1. Authentication (signup, login, logout, JWT, bcrypt, validation, error handling)
2. Backend API with Node.js + Express in a clean MVC-like structure

It also includes a protected Task CRUD API as a practical data-handling feature.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- express-validator for input validation

## Folder Structure

```text
backend/
  src/
    app.js
    server.js
    config/
      db.js
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
    services/
      token.service.js
    utils/
      AppError.js
    validators/
      auth.validators.js
      task.validators.js
  .env.example
  .gitignore
  package.json
```

## Setup Instructions

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

Create a `.env` file in `backend/` and copy values from `.env.example`.

Required values:

- `MONGODB_URI` (MongoDB Atlas connection string)
- `JWT_SECRET` (long random secret)

Example:

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

### 3. Run the server

```bash
npm run dev
```

Health endpoint:

- `GET /api/health`

## Authentication APIs

Base URL: `http://localhost:5000`

### Signup

- `POST /api/auth/signup`
- Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Login

- `POST /api/auth/login`
- Body:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

### Logout

- `POST /api/auth/logout`

### Current User

- `GET /api/auth/me`
- Requires JWT in cookie (or `Authorization: Bearer <token>` header)

## Task APIs (Protected)

All task routes require authentication.

### Get my tasks

- `GET /api/tasks`

### Create task

- `POST /api/tasks`
- Body:

```json
{
  "title": "Finish assignment",
  "description": "Build auth and backend",
  "isCompleted": false
}
```

### Update task

- `PUT /api/tasks/:id`

### Delete task

- `DELETE /api/tasks/:id`

## Security Notes

- Passwords are hashed with bcrypt before saving.
- JWT is signed with `JWT_SECRET`.
- Token is stored in an HTTP-only cookie (and also returned in JSON for API clients).
- Input validation is enforced using `express-validator`.
- Centralized error middleware handles operational errors and validation errors.

## What is not included yet

As requested, this implementation covers only Topics 1 and 2.
Frontend pages (React), route protection in UI, and deployment steps can be added next.
