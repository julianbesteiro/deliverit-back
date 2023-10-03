FROM node:18-alpine

# Copiar los archivos de compilación y otros recursos necesarios
COPY package*.json ./
COPY dist ./dist
COPY start.sh ./
COPY .env .

# Instalar las dependencias
RUN npm install --omit=dev

COPY start.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start.sh

EXPOSE 5000

ENTRYPOINT ["/usr/local/bin/start.sh"]
CMD ["npm", "start"]