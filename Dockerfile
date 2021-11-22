FROM node:lts as dependencies
WORKDIR /client-app
COPY package.json yarn.lock ./
RUN npm install --frozen-lockfile

FROM node:lts as builder
WORKDIR /client-app
COPY . .
COPY --from=dependencies /client-app/node_modules ./node_modules
RUN npm run build

FROM node:lts as runner
WORKDIR /client-app
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /my-project/next.config.js ./
COPY --from=builder /client-app/public ./public
COPY --from=builder /client-app/.next ./.next
COPY --from=builder /client-app/node_modules ./node_modules
COPY --from=builder /client-app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]