FROM "node:22-alpine"

WORKDIR /app

COPY package*.json ./
COPY ./dist ./dist

RUN npm install --omit=dev

CMD ["npm", "start"]
