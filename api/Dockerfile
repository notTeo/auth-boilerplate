# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

# Generate Prisma client (outputs to src/generated/prisma)
RUN npx prisma generate

# Compile TypeScript → dist/
RUN npm run build

# ── Stage 2: production image ────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled JS and generated Prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated

# Copy Prisma schema (needed at runtime for migrations)
COPY prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/app.js"]
