# Etapa 1: build
FROM node:22-alpine AS build
WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
# Instalamos tudo (incluindo devDependencies como o Prisma)
RUN npm install

COPY . .

# No Prisma 7 com prisma.config.ts, o generate não precisa de DATABASE_URL real
# Mas precisamos garantir que ele encontre o caminho.
RUN npx prisma generate

RUN npm run build

# Etapa 2: imagem final
FROM node:22-alpine
WORKDIR /usr/src/app

# Cria usuário para rodar sem root
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001

COPY package.json package-lock.json* ./

# Instalamos apenas produção, MAS precisamos do CLI do prisma 
# temporariamente se você quiser gerar no final, ou apenas copiar o que foi gerado.
RUN npm install --production --silent

# --- O PULO DO GATO ---
# Copiamos o código buildado
COPY --from=build /usr/src/app/dist ./dist
# Copiamos a pasta prisma (schemas e migrations)
COPY --from=build /usr/src/app/prisma ./prisma
# COPIAMOS O CLIENT GERADO (importante!)
COPY --from=build /usr/src/app/src/generated ./src/generated
# Copiamos o config do prisma
COPY --from=build /usr/src/app/prisma.config.ts ./ 

# REMOVEMOS o "RUN npx prisma generate" daqui da Etapa 2.
# Ele já foi gerado na Etapa 1 e copiado acima. 
# Isso evita erro de falta de DATABASE_URL ou CLI em runtime.

USER appuser
EXPOSE 8000

CMD ["node", "dist/server.js"]