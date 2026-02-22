# API — Auth Boilerplate

Express + TypeScript backend. Handles all authentication logic, token management, email, and Google OAuth.

Runs on: `http://localhost:3000`

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

## Setup

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

## Environment Variables

```env
# App
PORT=3000
CLIENT_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/auth_boilerplate

# JWT
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

> Never commit `.env`. It is already in `.gitignore`.

For Google OAuth, add `http://localhost:3000/auth/google/callback` as an authorized redirect URI in your Google Cloud Console.

## Endpoints

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
