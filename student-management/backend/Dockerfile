FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm ci && npm run build && npx prisma generate

EXPOSE 4000
CMD ["sh", "-c", "npx prisma db push && node dist/server.js"]
