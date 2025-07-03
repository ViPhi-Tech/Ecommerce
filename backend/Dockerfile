# Etapa 1: build
FROM node:22-alpine AS build
WORKDIR /usr/src/app

# Copia package.json e package-lock.json (se existir)
COPY package.json package-lock.json* ./

# Instala dependências (usa npm install para não dar erro)
RUN npm install --silent

# Copia o resto do código e prisma
COPY . .

# Exporta variável DATABASE_URL para prisma generate
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Gera cliente Prisma
RUN npx prisma generate

# Builda o projeto
RUN npm run build

# Etapa 2: imagem final
FROM node:22-alpine
WORKDIR /usr/src/app

# Cria usuário para rodar sem root
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001

# Copia package.json e package-lock.json (se existir)
COPY package.json package-lock.json* ./

# Instala só dependências de produção
RUN npm install --production --silent

# Copia build e prisma do estágio anterior
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma

# Exporta DATABASE_URL para rodar em runtime
ENV DATABASE_URL=$DATABASE_URL

# Gera prisma novamente para garantir
RUN npx prisma generate

# Usa usuário não-root
USER appuser

# Expõe porta da app
EXPOSE 8000

# Comando para rodar app
CMD ["node", "dist/server.js"]