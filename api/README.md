# API — Auth Boilerplate

Express + TypeScript backend. Handles all authentication logic, token management, email, and Google OAuth.

Local dev runs on: `http://localhost:3000`
Docker runs on: `http://localhost:5001` (mapped from internal port 3000)

## Stack

| Tool | Purpose |
|---|---|
| Express | HTTP framework |
| TypeScript | Type safety |
| Prisma | ORM + migrations |
| PostgreSQL | Database |
| jsonwebtoken | Sign and verify JWTs |
| bcrypt | Password hashing |
| Resend | Transactional email |
| express-validator | Input validation |
| express-rate-limit | Rate limiting |
| helmet | Security headers |
| passport-google-oauth20 | Google OAuth strategy |

## Folder Structure

```
api/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── config/
│   │   ├── env.ts            ← validated env variables
│   │   └── passport.ts       ← Google OAuth strategy setup
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/
│   │   ├── authenticate.ts   ← JWT Bearer token guard
│   │   ├── validate.ts       ← express-validator error handler
│   │   ├── rateLimiter.ts    ← rate limit configs
│   │   └── errorHandler.ts   ← global error handler
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── user.routes.ts
│   ├── services/
│   │   ├── auth.service.ts   ← register, login, refresh, logout, verify, reset
│   │   ├── email.service.ts  ← Resend email templates
│   │   └── oauth.service.ts  ← Google OAuth user creation/linking
│   ├── utils/
│   │   ├── jwt.ts            ← sign/verify helpers + token expiry
│   │   ├── prisma.ts         ← Prisma client singleton
│   │   ├── logger.ts
│   │   └── response.ts       ← consistent success response shape
│   ├── validators/
│   │   └── authValidation.ts ← express-validator chains
│   └── app.ts
├── .env.example
├── tsconfig.json
└── package.json
```

## Local Dev Setup

### Prerequisites

- Node.js 18+
- PostgreSQL running locally or a remote connection string
- [Resend](https://resend.com) account and API key
- [Google Cloud](https://console.cloud.google.com) OAuth 2.0 credentials

### Steps

```bash
cd api
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

## Docker

In Docker, the API is built and run via the root `docker-compose.yml`. It reads env vars from the **root `.env`** — not from `api/.env`.

`api/.env` is only used for local development.

```bash
# From the project root
docker compose up --build
```

The API will be available at `http://localhost:5001`.

Prisma migrations run automatically on container start (`prisma migrate deploy`).

## Environment Variables

For **local dev**, copy and fill in `api/.env.example`:

```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

DATABASE_URL=postgresql://user:password@localhost:5432/auth_boilerplate

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

For **Docker**, fill in the root `.env`. Key differences:
- `CLIENT_URL=http://localhost` (frontend on port 80)
- `DATABASE_URL` uses `postgres` as the hostname (Docker service name)
- `GOOGLE_CALLBACK_URL=http://localhost:5001/auth/google/callback`

> Never commit `.env`. It is already in `.gitignore`.

## Endpoints

### System

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Returns `{ status: "ok", timestamp }` — useful for uptime checks |
| GET | `/docs` | Swagger UI — **local dev only**, disabled in production |

### Auth — `/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create pending registration, send verification email |
| POST | `/auth/login` | Login, set refresh token cookie, return access token |
| POST | `/auth/logout` | Invalidate refresh token |
| POST | `/auth/refresh` | Rotate refresh token, return new access token |
| GET | `/auth/verify-email?token=` | Verify email, create user account |
| POST | `/auth/forgot-password` | Send password reset email |
| POST | `/auth/reset-password` | Reset password, invalidate all sessions |
| GET | `/auth/google` | Redirect to Google OAuth |
| GET | `/auth/google/callback` | Handle Google OAuth callback |

### User — `/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/user/me` | Bearer token | Get current authenticated user |

## Scripts

```bash
npm run dev        # start with ts-node-dev (hot reload)
npm run build      # compile TypeScript to /dist
npm run start      # run compiled /dist/app.js
npm run lint       # ESLint
npx prisma studio  # open Prisma DB browser
```
