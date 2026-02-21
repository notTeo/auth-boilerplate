# 🌐 Web — Auth Boilerplate

The React + Vite frontend for the auth boilerplate. Consumes the API to provide a full authentication UI — register, login, email verification, password reset, and Google OAuth.

Runs on: `http://localhost:5173`

---

## Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Dev server + bundler |
| React Router v6 | Client-side routing |
| TanStack Query | Server state management |
| Axios | HTTP client |

---

## Folder Structure

```
web/
├── src/
│   ├── api/
│   │   ├── client.ts          ← Axios instance with base URL + interceptors
│   │   ├── auth.api.ts        ← API call functions for auth endpoints
│   │   └── user.api.ts        ← API call functions for user endpoints
│   ├── components/
│   │   ├── ProtectedRoute.tsx ← Redirects unauthenticated users
│   │   ├── PublicRoute.tsx    ← Redirects already logged-in users
│   │   └── ui/                ← Reusable UI elements (Button, Input, etc.)
│   ├── hooks/
│   │   ├── useAuth.ts         ← Login, logout, register mutations
│   │   └── useUser.ts         ← GET /user/me query
│   ├── pages/
│   │   ├── RegisterPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── VerifyEmailPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   └── DashboardPage.tsx
│   ├── store/
│   │   └── authStore.ts       ← Access token stored in memory (not localStorage)
│   ├── App.tsx                ← Router setup
│   └── main.tsx               ← Entry point
├── .env.example
├── tsconfig.json
└── package.json
```

---

## Installation

### Prerequisites

- [ ] Node.js 18+ installed
- [ ] API is running at `http://localhost:3000` → see `api/README.md`

### Steps

- [ ] Navigate to the web folder
```bash
cd web
```

- [ ] Copy the example env file
```bash
cp .env.example .env
```

- [ ] Fill in the API base URL in `.env`

- [ ] Install dependencies
```bash
npm install
```

- [ ] Start the development server
```bash
npm run dev
```

Web app is now running at `http://localhost:5173`

---

## Environment Variables

```env
VITE_API_URL=http://localhost:3000
```

> All Vite env variables must be prefixed with `VITE_` to be accessible in the browser.

---

## Pages

| Page | Route | Protected | Description |
|---|---|---|---|
| Register | `/register` | ❌ | Email + password registration form |
| Login | `/login` | ❌ | Login form + Google OAuth button |
| Verify Email | `/verify-email` | ❌ | Waiting state + resend option |
| Forgot Password | `/forgot-password` | ❌ | Enter email to receive reset link |
| Reset Password | `/reset-password` | ❌ | New password form (token from URL) |
| Dashboard | `/dashboard` | ✅ | Shows current user info |

---

## Auth Flow (Frontend Side)

### Access Token Storage
The access token is stored **in memory only** (a React context or Zustand store) — never in `localStorage` or `sessionStorage`. This protects against XSS attacks.

### Refresh Token Storage
The refresh token is stored in an **HttpOnly cookie** set by the API. The frontend never reads it directly — it's automatically sent with requests to `/auth/refresh`.

### Token Refresh
The Axios instance includes a response interceptor. On a `401` response, it automatically calls `POST /auth/refresh`, gets a new access token, and retries the original request — transparent to the user.

---

## Build Phases

### Phase 1 — Project Foundation
- [ ] Vite + React + TypeScript scaffolded
- [ ] React Router set up with all page routes
- [ ] Axios client configured with base URL from `.env`
- [ ] TanStack Query provider added to `main.tsx`

### Phase 2 — Register & Login UI
- [ ] `RegisterPage.tsx` — form with email + password
- [ ] `LoginPage.tsx` — form with email + password
- [ ] `useAuth.ts` hook with register and login mutations
- [ ] Access token saved to memory store on login

### Phase 3 — Refresh Token Flow
- [ ] Axios interceptor calls `/auth/refresh` on 401
- [ ] Retries original request with new access token
- [ ] Logout clears token from memory and calls `/auth/logout`

### Phase 4 — Protected Routes
- [ ] `ProtectedRoute.tsx` — redirects to `/login` if no token
- [ ] `PublicRoute.tsx` — redirects to `/dashboard` if already logged in
- [ ] `DashboardPage.tsx` — calls `GET /user/me` and displays user

### Phase 5 — Email Verification UI
- [ ] After register, redirect to `VerifyEmailPage.tsx`
- [ ] Page shows "check your email" state
- [ ] Resend button calls `POST /auth/resend-verification`
- [ ] On successful verification, redirect to login

### Phase 6 — Password Reset UI
- [ ] `ForgotPasswordPage.tsx` — email input, calls `/auth/forgot-password`
- [ ] `ResetPasswordPage.tsx` — reads token from URL, calls `/auth/reset-password`
- [ ] Success state redirects to login

### Phase 7 — Google OAuth UI
- [ ] Google button on `LoginPage.tsx` links to `GET /auth/google`
- [ ] Callback handled by API, redirects back to frontend with tokens
- [ ] Frontend reads tokens from URL params and saves to store

### Phase 8 — Hardening
- [ ] All forms show proper error messages from API responses
- [ ] Loading states on all async actions
- [ ] Token expiry handled gracefully (auto logout if refresh fails)
- [ ] 404 page for unknown routes

---

## Scripts

```bash
npm run dev      # start Vite dev server with hot reload
npm run build    # compile and bundle for production
npm run preview  # preview production build locally
npm run lint     # ESLint
```