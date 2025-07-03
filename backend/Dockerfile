# Etapa 1: build
FROM node:22-alpine AS build
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm ci --silent

# Copia todo o código fonte e pasta prisma
COPY . .

# Exporta variável DATABASE_URL temporariamente para gerar o prisma client
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Gera o Prisma Client
RUN npx prisma generate

# Roda build do projeto
RUN npm run build

# Etapa 2: imagem final de produção
FROM node:22-alpine
WORKDIR /usr/src/app

# Cria usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001

# Copia package.json para instalar dependências de produção
COPY package*.json ./

# Instala dependências de produção
RUN npm ci --only=production --silent

# Copia a saída do build e a pasta prisma gerada
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma

# Exporta variável DATABASE_URL para rodar no container
ENV DATABASE_URL=$DATABASE_URL

# Gera novamente o Prisma Client para garantir integridade
RUN npx prisma generate

# Muda para usuário não-root
USER appuser

# Expõe a porta da aplicação
EXPOSE 8000

# Comando para iniciar o servidor
CMD ["node", "dist/server.js"]