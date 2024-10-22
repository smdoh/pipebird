FROM node:16 AS build

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:16-slim
WORKDIR /app
RUN apt-get update
RUN apt-get install -y openssl
COPY package.json ./package.json
COPY .env ./.env
COPY schema.prisma ./schema.prisma
COPY migrations ./migrations
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
RUN npx prisma migrate deploy

CMD ["npm", "start"]