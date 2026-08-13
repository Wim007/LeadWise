# Carnegie Coach — één image die zowel de API als de gebouwde client draait.

# --- 1. De React-app bouwen ------------------------------------------------
FROM node:22-alpine AS client-build

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# --- 2. De server draaien --------------------------------------------------
FROM node:22-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY server/package.json server/package-lock.json ./server/
RUN npm --prefix server ci --omit=dev

COPY server/ ./server/
COPY package.json ./

# De gebouwde client komt naast de server te staan; Express serveert hem
# vanaf ../../client/dist, gezien vanuit server/src.
COPY --from=client-build /app/client/dist ./client/dist

EXPOSE 3001

# Het schema is idempotent, dus we werken het bij elke start bij.
CMD ["sh", "-c", "node server/src/migrate.js && node server/src/index.js"]
