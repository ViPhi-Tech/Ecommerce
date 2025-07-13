# Etapa 1: build
FROM node:22-alpine AS build
WORKDIR /usr/src/app

# Copia package.json e package-lock.json
COPY package.json package-lock.json* ./

# Instala dependências
RUN npm install --silent

# Copia o restante do código-fonte e arquivos do prisma
COPY . .

# Exporta variável DATABASE_URL para prisma generate
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Gera cliente Prisma
RUN npx prisma generate

# Executa build do projeto (transpilar TypeScript)
RUN npm run build

# Etapa 2: imagem final para execução
FROM node:22-alpine
WORKDIR /usr/src/app

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001

# Copia package.json e package-lock.json para instalar dependências de produção
COPY package.json package-lock.json* ./

# Instala só dependências de produção
RUN npm install --production --silent

# Copia build e prisma do estágio anterior
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma

# Exporta variável DATABASE_URL para runtime
ENV DATABASE_URL=$DATABASE_URL

# Gera cliente Prisma para produção (garantia)
RUN npx prisma generate

# Define para rodar com usuário não-root
USER appuser

# Expõe porta da aplicação
EXPOSE 8000

# Comando para iniciar o servidor Node.js
CMD ["node", "dist/server.js"]