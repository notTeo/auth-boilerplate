# Auth Boilerplate

A full-stack TypeScript authentication starter with everything you need to ship auth in a real app.

## Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens) |
| Email | Resend |
| OAuth | Google OAuth 2.0 |
| Validation | express-validator |
| Frontend | React 19 + Vite + React Router + Axios |

## Features

- Register with email + password (pending email verification)
- Email verification via Resend
- Login with short-lived JWT access token (15 min)
- Rotating refresh tokens stored in DB (30 days, `httpOnly` cookie)
- Logout — invalidates refresh token in DB
- Forgot / reset password flow
- Google OAuth — creates new users or links to existing accounts
- `GET /user/me` protected route via Bearer token middleware
- Rate limiting on all auth routes
- Input validation on every endpoint
- Dark theme UI with Poppins font, mobile-first CSS

## Repo Structure

```
auth-boilerplate/
├── api/        ← Express + Prisma backend
├── web/        ← React + Vite frontend
└── README.md
```

## Quick Start

```bash
# Clone
git clone https://github.com/your-username/auth-boilerplate.git
cd auth-boilerplate

# Terminal 1 — API
cd api
cp .env.example .env   # fill in your values
npm install
npx prisma migrate dev
npm run dev

# Terminal 2 — Web
cd web
cp .env.example .env   # set VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

- API: `http://localhost:3000`
- Web: `http://localhost:5173`

See `api/README.md` and `web/README.md` for full setup details.
