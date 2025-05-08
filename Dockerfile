# ----------------------------
# Stage 1: Build
# ----------------------------
FROM node:20-alpine AS development

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build backend-api

# ----------------------------
# Stage 2: Production
# ----------------------------
FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

COPY --from=development /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/apps/backend-api/main"]
