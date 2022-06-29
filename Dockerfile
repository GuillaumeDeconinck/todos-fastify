FROM node:16-slim AS base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS dev
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
# trunk-ignore(hadolint/DL3008)
RUN apt-get update && \
  apt-get install -y --no-install-recommends curl ca-certificates && \
  curl https://get.trunk.io -fsSL | bash -s - -y
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait
COPY ./ ./
CMD ["sh", "-c", "npx db-migrate up -e localKube && npx nodemon src/index.ts"]

FROM base AS build
COPY ./ ./
RUN npm run build && npm ci --production

FROM node:16-slim AS production
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/openapi.yaml ./openapi.yaml
COPY --from=build /app/static ./static
CMD ["node", "dist/index.js"]
