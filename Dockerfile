# Usar una imagen base oficial de Node.js
FROM node:22-alpine

# Crear y cambiar al directorio de trabajo
WORKDIR /app

# Copiar el package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos del proyecto al directorio de trabajo
COPY . .

# Construir el proyecto
RUN npm run build

# Exponer el puerto 80
EXPOSE 80

# Configurar la variable de entorno para producción y cambiar el puerto
ENV NODE_ENV=production
ENV PORT=80
ENV HOSTNAME=0.0.0.0

# Comando para iniciar la aplicación
CMD ["npm", "start"]
