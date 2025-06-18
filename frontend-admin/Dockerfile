# DENTRO DE frontend-admin/Dockerfile

# --- Estágio 1: Build do Angular ---
# O nome do estágio pode ser diferente (ex: build, angular_build), ajuste o seu
FROM node:22-alpine AS angular_build
WORKDIR /app

# CORRIJA ESTAS LINHAS:
# Adicione "frontend-admin/" no início dos caminhos
COPY frontend-admin/package.json frontend-admin/package-lock.json ./
RUN npm install
COPY frontend-admin/. .
RUN npm run build


# --- Estágio 2: Servidor Nginx ---
# O nome do estágio pode ser diferente (ex: final, final_serve), ajuste o seu
FROM nginx:alpine AS final_serve

# ESTA LINHA JÁ ESTAVA CORRETA E AGORA VAI FUNCIONAR:
# Ela busca o arquivo a partir do contexto raiz (.)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados do Angular
COPY --from=angular_build /app/dist/kommerz/browser /usr/share/nginx/html

EXPOSE 80