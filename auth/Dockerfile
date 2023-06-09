FROM node:18-alpine as base

# Diretório de trabalho dentro do contêiner
WORKDIR /app
# Copiar os arquivos do aplicativo
COPY package.json package-lock.json ./

# Instalar as dependências
RUN npm install

# Copiar o código do aplicativo
COPY . .

# Expor a porta do aplicativo Node.js
ARG AUTH_PORT
ENV AUTH_PORT $AUTH_PORT
EXPOSE $AUTH_PORT


# Comando para iniciar o aplicativo
CMD [ "npm", "start" ]