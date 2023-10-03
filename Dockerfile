FROM node:18-alpine

RUN npm install --omit=dev
RUN npm run build

COPY package*.json ./
COPY dist ./dist
COPY start.sh ./
COPY .env .
COPY start.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/start.sh

EXPOSE 5000

ENTRYPOINT ["/usr/local/bin/start.sh"]
CMD ["npm", "start"]