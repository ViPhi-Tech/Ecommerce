# Etapa 1: build
FROM node:22-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npx prisma generate
RUN npm run build

# Etapa 2: imagem final
FROM node:22-alpine
WORKDIR /usr/src/app
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001
COPY package*.json ./
RUN npm ci --only=production --silent
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
RUN npx prisma generate
USER appuser
EXPOSE 8000
CMD ["node", "dist/server.js"]