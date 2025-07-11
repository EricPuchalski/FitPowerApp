FROM node:20-alpine

# Crear carpeta de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./
RUN npm install
COPY . .

# Exponer el puerto donde corre Vite (por defecto 5173)
EXPOSE 5173

# Comando para iniciar Vite
CMD ["npm", "run", "dev", "--", "--host"]
