# Web — Auth Boilerplate

React + Vite frontend. Provides the full authentication UI — home page, register, login, email verification, password reset, Google OAuth, and dashboard.

Runs on: `http://localhost:5173`

## Stack

| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Dev server + bundler |
| React Router v7 | Client-side routing |
| Axios | HTTP client with refresh interceptor |

## Folder Structure

```
web/
├── src/
│   ├── api/
│   │   ├── client.ts             ← Axios instance + refresh token interceptor
│   │   ├── auth.api.ts           ← register, login, logout, forgot/reset, verify, refresh
│   │   └── user.api.ts           ← GET /user/me
│   ├── components/
│   │   ├── Navbar.tsx            ← sticky nav with login/logout/dashboard links
│   │   ├── ProtectedRoute.tsx    ← redirects unauthenticated users to /login
│   │   └── PublicRoute.tsx       ← redirects authenticated users to /dashboard
│   ├── context/
│   │   └── AuthContext.tsx       ← user state, login/logout, session rehydration
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── VerifyEmailPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── OAuthCallbackPage.tsx ← receives accessToken from Google OAuth redirect
│   ├── store/
│   │   └── authStore.ts          ← in-memory access token (never localStorage)
│   ├── config/
│   │   └── env.ts                ← validated Vite env variables
│   ├── index.css                 ← dark theme design system
│   ├── App.tsx                   ← route definitions
│   └── main.tsx                  ← entry point
├── .env.example
├── index.html
└── package.json
```

## Setup

### Prerequisites

- Node.js 18+
- API running at `http://localhost:3000` — see `api/README.md`

### Steps

```bash
cd web
cp .env.example .env
npm install
npm run dev
```

## Environment Variables

```env
VITE_API_URL=http://localhost:3000
```

> All Vite env variables must be prefixed with `VITE_` to be accessible in the browser.

## Pages

| Route | Protected | Description |
|---|---|---|
| `/` | ❌ | Home page with navbar |
| `/register` | ❌ (redirects if logged in) | Register with email + password or Google |
| `/login` | ❌ (redirects if logged in) | Login with email + password or Google |
| `/verify-email?token=` | ❌ | Verifies email from link |
| `/forgot-password` | ❌ (redirects if logged in) | Request password reset email |
| `/reset-password?token=` | ❌ | Set new password from link |
| `/oauth/callback?accessToken=` | ❌ | Receives tokens after Google OAuth |
| `/dashboard` | ✅ | Authenticated user info |

## Auth Flow

**Access token** — stored in memory only (`authStore.ts`). Never written to `localStorage` or `sessionStorage`.

**Refresh token** — stored in an `httpOnly` cookie set by the API. The browser sends it automatically; the frontend never reads it.

**Session rehydration** — on page load, `AuthContext` calls `POST /auth/refresh` via a cookie-only axios instance. If the cookie is valid, it gets a fresh access token and then fetches the user. No flash, no redirect loop.

**Auto-refresh** — the Axios interceptor catches 401s, calls `/auth/refresh`, and retries the original request transparently.

## Scripts

```bash
npm run dev      # start Vite dev server with hot reload
npm run build    # compile and bundle for production
npm run preview  # preview production build locally
npm run lint     # ESLint
```
