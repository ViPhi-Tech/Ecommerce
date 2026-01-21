# Etapa 1: build (Permanece igual)
FROM node:22-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Etapa 2: imagem final
FROM node:22-alpine
WORKDIR /usr/src/app
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001
COPY package.json package-lock.json* ./

# AQUI ESTÁ A CORREÇÃO:
RUN npm install --production --silent && npm install @prisma/adapter-pg pg --silent

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/src/generated ./src/generated
COPY --from=build /usr/src/app/prisma.config.ts ./ 

USER appuser
EXPOSE 8000
CMD ["node", "dist/server.js"]