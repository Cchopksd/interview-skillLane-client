FROM node:24-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs

CMD ["node", "server.js"]
