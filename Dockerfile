FROM node:18-alpine

WORKDIR /deliverit-back

# Copiar los archivos de compilación y otros recursos necesarios
COPY package*.json ./
COPY dist ./dist

# Instalar las dependencias
RUN npm install --production --omit=dev

EXPOSE 5000

CMD ["npm", "start"]