# Etapa 1: Construção da aplicação Angular
FROM node:18 AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração e dependências
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Compila a aplicação Angular para produção
RUN npm run build -- --configuration production

# Etapa 2: Servir a aplicação com Nginx
FROM nginx:alpine

# Copia os arquivos compilados da etapa anterior para o diretório padrão do Nginx
COPY --from=build /app/dist/kommerz /usr/share/nginx/html

# Copia o arquivo de configuração do Nginx (opcional)
# Você pode criar um arquivo nginx.conf personalizado, se necessário
# COPY nginx.conf /etc/nginx/nginx.conf

# Expõe a porta 80 para acessar a aplicação
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
