# Use uma imagem estável e otimizada
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências
COPY package.json yarn.lock ./

# Instala apenas as dependências de produção
RUN yarn install --production

# Copia o restante do código do frontend
COPY . .

# Compila a aplicação Next.js
RUN yarn build

# Expõe a porta padrão do Next.js
EXPOSE 3000

# Comando para iniciar o Next.js no modo de produção
CMD ["yarn", "start"]
