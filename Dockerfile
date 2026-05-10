# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Generate Prisma client before compiling TypeScript
COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# ── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install only runtime dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Prisma: generated client (runtime) + CLI (for migrate deploy at startup)
COPY --from=builder /app/node_modules/.prisma        ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/prisma         ./node_modules/prisma
COPY --from=builder /app/node_modules/.bin/prisma    ./node_modules/.bin/prisma

# Compiled app + schema (needed by migrate deploy)
COPY --from=builder /app/dist    ./dist
COPY --from=builder /app/prisma  ./prisma

EXPOSE 3005

# Run pending migrations then start the app
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node dist/main"]
