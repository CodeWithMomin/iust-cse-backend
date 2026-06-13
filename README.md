# Backend Starter

Production-grade Express + MongoDB REST API.

## Stack
- **Express** — web framework
- **MongoDB + Mongoose** — database & ODM
- **JWT** — access + refresh token auth
- **Zod** — request validation
- **Winston** — structured logging
- **express-rate-limit** — rate limiting
- **bcryptjs** — password hashing

## Getting Started

```bash
cp .env.example .env     # fill in your values
npm install
npm run dev
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/v1/auth/register` | ❌ | Register user |
| POST | `/api/v1/auth/login` | ❌ | Login |
| POST | `/api/v1/auth/refresh-token` | ❌ | Refresh access token |
| POST | `/api/v1/auth/logout` | ✅ | Logout |
| GET | `/api/v1/auth/me` | ✅ | Get current user |
| GET | `/health` | ❌ | Health check |

## Folder Structure

```
src/
├── config/
│   ├── db.js            # MongoDB connection
│   └── env.js           # env variables
├── controllers/
│   └── auth.controller.js
├── middlewares/
│   ├── auth.middleware.js   # protect, restrictTo
│   ├── error.middleware.js  # global error handler
│   └── validate.middleware.js
├── models/
│   └── user.model.js
├── routes/
│   └── auth.routes.js
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   ├── logger.js
│   └── tokens.js
├── validations/
│   └── auth.validation.js
├── app.js               # express app
└── index.js             # entry point
```

## Adding a New Resource

1. Create `src/models/post.model.js`
2. Create `src/validations/post.validation.js`
3. Create `src/controllers/post.controller.js`
4. Create `src/routes/post.routes.js`
5. Register in `src/app.js`: `app.use("/api/v1/posts", postRoutes)`

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/myapp
ACCESS_TOKEN_SECRET=...
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=...
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
```
