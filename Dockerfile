FROM node:alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /client-app
COPY package*.json ./
RUN npm install

FROM node:alpine AS builder
WORKDIR /client-app
COPY . .
COPY --from=deps /client-app/node_modules ./node_modules
RUN npm run build && npm install --production --ignore-scripts --prefer-offline

FROM node:alpine AS runnder
WORKDIR /client-app

ENV NODE_ENV production

COPY --from=builder /client-app/next.config.js ./
COPY --from=builder /client-app/public ./public
COPY --from=builder --chown=nextjs:nodejs /client-app/.next ./.next
COPY --from=builder /client-app/node_modules ./node_modules
COPY --from=builder /client-app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node_modules/.bin/next", "start"]