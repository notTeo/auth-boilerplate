# 🔐 Auth Boilerplate

A full-stack TypeScript authentication boilerplate built step by step for deep understanding of modern auth patterns. Not a copy-paste starter — a learning project designed to be understood line by line.

---

## Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens) |
| Email | Resend |
| OAuth | Google |
| Validation | express-validator |
| Frontend | React + Vite + TanStack Query + React Router |

---

## Repo Structure

```
auth-boilerplate/
├── api/        ← Express + Prisma backend   →  see api/README.md
├── web/        ← React + Vite frontend      →  see web/README.md
└── README.md   ← you are here
```

> `api/` and `web/` never import from each other directly. They communicate only through HTTP.

---

## Getting Started

### Prerequisites

- [ ] Node.js 18+ installed
- [ ] PostgreSQL running locally (or a remote connection string)
- [ ] A [Resend](https://resend.com) account and API key
- [ ] A [Google Cloud](https://console.cloud.google.com) project with OAuth 2.0 credentials

### Run the full project

```bash
# 1. Clone the repo
git clone https://github.com/your-username/auth-boilerplate.git
cd auth-boilerplate

# 2. Setup and start the API (terminal 1)
cd api
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev

# 3. Setup and start the web app (terminal 2)
cd web
cp .env.example .env
npm install
npm run dev
```

- API runs at: `http://localhost:3000`
- Web runs at: `http://localhost:5173`

---

## Auth Features

- [ ] Register with email + password
- [ ] Login with JWT access token (short-lived, 15 min)
- [ ] Refresh token rotation (long-lived, stored in DB)
- [ ] Logout (invalidates refresh token)
- [ ] Email verification on register (via Resend)
- [ ] Password reset flow (email → token → new password)
- [ ] Google OAuth (authorization code flow)
- [ ] Protected routes via `authenticate` middleware
- [ ] Rate limiting on all auth routes
- [ ] Input validation with `express-validator` on every route

---

## Build Phases

### Phase 1 — Project Foundation
- [ ] Monorepo setup, TypeScript config, folder structure
- [ ] Base Express app with global error handler
- [ ] Environment variables with type-safe config file
- [ ] Prisma setup + full DB schema

### Phase 2 — Register & Login (Access Token)
- [ ] `POST /auth/register` — hash password with bcrypt, create user
- [ ] `POST /auth/login` — verify credentials, sign JWT access token
- [ ] Learn: JWT structure, signing, verification, expiry

### Phase 3 — Refresh Token Flow
- [ ] Issue refresh token on login, store in DB
- [ ] `POST /auth/refresh` — verify, rotate, issue new access token
- [ ] `POST /auth/logout` — delete refresh token from DB
- [ ] Learn: token rotation, why two tokens, token families

### Phase 4 — Middleware & Protected Routes
- [ ] `authenticate` middleware — extract and verify access token
- [ ] `GET /user/me` — first protected route
- [ ] Learn: 401 vs 403, middleware chains, attaching user to request

### Phase 5 — Email Verification (Resend)
- [ ] Generate signed token on register, send email via Resend
- [ ] `GET /auth/verify-email?token=...` — activate account
- [ ] Block unverified users from logging in
- [ ] Learn: email tokens vs auth JWTs, single-use tokens

### Phase 6 — Password Reset
- [ ] `POST /auth/forgot-password` — generate token, send reset email
- [ ] `POST /auth/reset-password` — consume token, update password, kill all refresh tokens
- [ ] Learn: single-use tokens, timing attacks, session invalidation

### Phase 7 — Google OAuth
- [ ] `GET /auth/google` → redirect to Google
- [ ] `GET /auth/google/callback` → exchange code, create/link account, issue tokens
- [ ] Learn: OAuth2 authorization code flow, account linking, state parameter

### Phase 8 — Hardening
- [ ] Rate limiting on all auth routes (`express-rate-limit`)
- [ ] Helmet for security headers
- [ ] Centralized error handling and consistent error responses
- [ ] Environment variable validation on startup

---

## Key Concepts Covered

**JWT** — what the three parts are, why access tokens are short-lived, how to sign and verify them.

**Refresh token rotation** — why storing a long-lived token in the DB gives you the ability to invalidate sessions, and how rotation prevents token theft.

**Email token security** — difference between a JWT and a random signed token, why reset tokens must be single-use, and how to handle expiry.

**OAuth2 authorization code flow** — what happens at each step from redirect to token issuance, and how to link OAuth accounts to existing users.

**Defense in depth** — rate limiting, input validation on every route, security headers, proper HTTP status codes.

---

*Built phase by phase. Every line understood.*