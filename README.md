# Auth Boilerplate

A full-stack TypeScript authentication and billing starter. Clone it, configure your env, and start building your actual product.

## Features

- Register with email + password — sends a verification email
- Email verification — account is only active after the link is clicked
- Login / Logout — JWT access + refresh token rotation
- Refresh token — stored in an `httpOnly` cookie, rotated on every use
- Forgot / Reset password — token-based, invalidates all sessions on reset
- Google OAuth — sign in or register via Google
- Update profile — change email or password from the Settings page
- Delete account — password-confirmed, removes all data
- Stripe billing — checkout session, billing portal, webhook sync
- Subscription state — plan badge, renewal date, cancellation notice
- Dashboard with sidebar — collapsible sidebar navigation for authenticated pages
- Protected routes — frontend redirects unauthenticated users
- Security — helmet, CORS, rate limiting, bcrypt, input validation
- API docs — Swagger UI at `/docs` (local dev only)

## Stack

| Layer | Technology |
|---|---|
| API | Express, TypeScript, Prisma, PostgreSQL |
| Auth | JWT, bcrypt, Passport (Google OAuth), Resend (email) |
| Billing | Stripe (Checkout, Billing Portal, Webhooks) |
| Frontend | React 19, TypeScript, Vite, React Router v7, Axios |
| Infrastructure | Docker, Docker Compose, nginx |

## Repo Structure

```
auth-boilerplate/
├── api/               ← Express API
├── web/               ← React frontend
├── docker-compose.yml
└── .env               ← used by Docker Compose only
```

See [api/README.md](./api/README.md) and [web/README.md](./web/README.md) for full details on each.

---

## Quick Start — Docker

The fastest way to run the full stack locally.

### Prerequisites

- [Docker](https://www.docker.com/) installed and running
- A [Resend](https://resend.com) account and API key
- A [Google Cloud](https://console.cloud.google.com) OAuth 2.0 Client ID and Secret
- A [Stripe](https://stripe.com) account with a product/price created

### 1. Configure environment

```bash
cp .env.example .env
```

Fill in your values (see `.env.example` for all fields). Key ones:

```env
DB_PASSWORD=your_db_password
JWT_ACCESS_SECRET=    # node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_REFRESH_SECRET=   # same as above
RESEND_API_KEY=re_xxxxxxxxxxxx
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxx
```

> For Google OAuth, add `http://localhost:5001/auth/google/callback` as an authorized redirect URI in your [Google Cloud Console](https://console.cloud.google.com).

### 2. Run

```bash
docker compose up --build
```

### 3. Access

| Service | URL |
|---|---|
| Frontend | http://localhost |
| API | http://localhost:5001 |

---

## Local Development

Run the API and frontend separately with hot reload.

### Prerequisites

- Node.js 18+
- PostgreSQL running locally
- [Stripe CLI](https://stripe.com/docs/stripe-cli) for local webhook forwarding

### API

```bash
cd api
cp .env.example .env   # fill in your values
npm install
npx prisma migrate dev
npm run dev            # runs on http://localhost:3000
```

### Frontend

```bash
cd web
cp .env.example .env   # VITE_API_URL=http://localhost:3000 is already set
npm install
npm run dev            # runs on http://localhost:5173
```

### Stripe webhooks (local dev)

Stripe can't reach `localhost` directly. Run the CLI listener in a separate terminal:

```bash
stripe listen --forward-to localhost:3000/billing/webhook
```

Copy the `whsec_...` secret it prints and set it as `STRIPE_WEBHOOK_SECRET` in `api/.env`, then restart the API.

---

## Useful Docker Commands

```bash
docker compose ps           # check running containers
docker compose logs api     # view API logs
docker compose down         # stop everything
docker compose down -v      # stop and wipe the database
docker compose up --build   # rebuild after code or env changes
```
