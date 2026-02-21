# 🛠 API — Auth Boilerplate

The Express + TypeScript backend for the auth boilerplate. Handles all authentication logic, token management, email sending, and Google OAuth.

Runs on: `http://localhost:3000`

---

## Stack

| Tool | Purpose |
|---|---|
| Express | HTTP framework |
| TypeScript | Type safety |
| Prisma | ORM + DB migrations |
| PostgreSQL | Database |
| jsonwebtoken | Sign and verify JWTs |
| bcrypt | Password hashing |
| Resend | Transactional email |
| express-validator | Input validation |
| express-rate-limit | Rate limiting |
| helmet | Security headers |
| passport-google-oauth20 | Google OAuth strategy |

---

## Folder Structure

```
api/
├── prisma/
│   ├── schema.prisma         ← DB models
│   └── migrations/           ← auto-generated migration files
├── src/
│   ├── config/
│   │   ├── env.ts            ← type-safe env variables
│   │   └── constants.ts      ← token expiry, limits, etc.
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/
│   │   ├── authenticate.ts   ← JWT access token guard
│   │   ├── validate.ts       ← express-validator error handler
│   │   └── errorHandler.ts   ← global error handler
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── user.routes.ts
│   ├── services/
│   │   ├── auth.service.ts   ← register, login, refresh, logout
│   │   ├── email.service.ts  ← Resend email sending
│   │   ├── token.service.ts  ← JWT + DB token helpers
│   │   └── oauth.service.ts  ← Google OAuth logic
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── hash.ts
│   └── app.ts                ← Express app entry point
├── .env.example
├── tsconfig.json
└── package.json
```

---

## Installation

### Prerequisites

- [ ] Node.js 18+ installed
- [ ] PostgreSQL running (local or remote)
- [ ] Resend account with an API key → [resend.com](https://resend.com)
- [ ] Google OAuth credentials → [console.cloud.google.com](https://console.cloud.google.com)

### Steps

- [ ] Navigate to the api folder
```bash
cd api
```

- [ ] Copy the example env file
```bash
cp .env.example .env
```

- [ ] Fill in all values in `.env` (see Environment Variables section below)

- [ ] Install dependencies
```bash
npm install
```

- [ ] Run Prisma migrations to create the DB tables
```bash
npx prisma migrate dev
```

- [ ] (Optional) Open Prisma Studio to inspect the DB
```bash
npx prisma studio
```

- [ ] Start the development server
```bash
npm run dev
```

API is now running at `http://localhost:3000`

---

## Environment Variables

```env
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

# App
PORT=3000
CLIENT_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

> Never commit your `.env` file. It is already in `.gitignore`.

---

## Endpoints

### Auth — `/auth`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Create account, send verification email |
| POST | `/auth/login` | ❌ | Login, receive access + refresh tokens |
| POST | `/auth/logout` | ✅ | Invalidate refresh token |
| POST | `/auth/refresh` | ❌ | Exchange refresh token for new access token |
| GET | `/auth/verify-email?token=...` | ❌ | Verify email address |
| POST | `/auth/resend-verification` | ❌ | Resend verification email |
| POST | `/auth/forgot-password` | ❌ | Send password reset email |
| POST | `/auth/reset-password` | ❌ | Reset password with token |
| GET | `/auth/google` | ❌ | Redirect to Google OAuth |
| GET | `/auth/google/callback` | ❌ | Handle Google OAuth callback |

### User — `/user`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/user/me` | ✅ | Get current authenticated user |

---

## Prisma Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?   // nullable — OAuth users have no password
  isVerified    Boolean   @default(false)
  googleId      String?   @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  refreshTokens          RefreshToken[]
  emailVerificationToken EmailVerificationToken?
  passwordResetToken     PasswordResetToken?
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model EmailVerificationToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## Build Phases

### Phase 1 — Project Foundation
- [ ] TypeScript config (`tsconfig.json`)
- [ ] Folder structure scaffolded
- [ ] Base Express app with global error handler
- [ ] Type-safe env config (`src/config/env.ts`)
- [ ] Prisma initialized and schema written
- [ ] First migration run

### Phase 2 — Register & Login (Access Token)
- [ ] `POST /auth/register` with bcrypt password hash
- [ ] `POST /auth/login` with JWT access token response
- [ ] express-validator on both routes

### Phase 3 — Refresh Token Flow
- [ ] Refresh token issued on login and stored in DB
- [ ] `POST /auth/refresh` — verify token, rotate, return new access token
- [ ] `POST /auth/logout` — delete refresh token from DB

### Phase 4 — Middleware & Protected Routes
- [ ] `authenticate` middleware validates access token
- [ ] User attached to `req.user`
- [ ] `GET /user/me` protected route

### Phase 5 — Email Verification (Resend)
- [ ] `email.service.ts` set up with Resend SDK
- [ ] Verification token generated and stored on register
- [ ] Verification email sent via Resend
- [ ] `GET /auth/verify-email?token=...` activates account
- [ ] `POST /auth/resend-verification` resends email
- [ ] Unverified users blocked from logging in

### Phase 6 — Password Reset
- [ ] `POST /auth/forgot-password` — generate token, send email
- [ ] `POST /auth/reset-password` — validate token, update password hash
- [ ] All refresh tokens invalidated on password reset
- [ ] Reset token marked as used after consumption

### Phase 7 — Google OAuth
- [ ] Google OAuth strategy configured
- [ ] `GET /auth/google` redirects to Google
- [ ] `GET /auth/google/callback` handles response
- [ ] New users created, existing users linked by googleId
- [ ] Tokens issued same as normal login

### Phase 8 — Hardening
- [ ] `express-rate-limit` on all `/auth` routes
- [ ] `helmet` added to Express app
- [ ] Consistent error response shape across all routes
- [ ] Env variable validation on app startup

---

## Scripts

```bash
npm run dev        # start with ts-node-dev (hot reload)
npm run build      # compile TypeScript to /dist
npm run start      # run compiled /dist/app.js
npm run lint       # ESLint
npx prisma studio  # open Prisma DB browser
```