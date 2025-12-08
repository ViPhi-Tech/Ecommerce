# Etapa 1: build
FROM node:22-alpine AS build
WORKDIR /usr/src/app

# Copia package.json e package-lock.json (se existir)
COPY package.json package-lock.json* ./

# Instala dependências (usa npm install para não dar erro)
RUN npm install --silent

# Copia o resto do código e prisma (incluindo .env se existir)
COPY . .

# Lê DATABASE_URL do arquivo .env se existir, caso contrário usa o ARG
# Isso permite que o build funcione mesmo sem passar DATABASE_URL como build arg
ARG DATABASE_URL
RUN if [ -f .env ] && grep -q '^DATABASE_URL=' .env; then \
      export DATABASE_URL=$(grep -E '^DATABASE_URL=' .env | cut -d '=' -f2- | sed 's/^"//;s/"$//' | sed "s/^'//;s/'$//"); \
    else \
      export DATABASE_URL="${DATABASE_URL}"; \
    fi && \
    DATABASE_URL="$DATABASE_URL" npx prisma generate

# ENV será definido pelo env_file em runtime, mas definimos aqui como fallback
ENV DATABASE_URL=${DATABASE_URL:-}

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

# DATABASE_URL será definido pelo env_file em runtime via docker-compose
# Gera prisma novamente para garantir (DATABASE_URL será lido do ambiente em runtime)
RUN npx prisma generate

# Usa usuário não-root
USER appuser

# Expõe porta da app
EXPOSE 8000

# Comando para rodar app
CMD ["node", "dist/server.js"]