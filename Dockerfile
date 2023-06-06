FROM node:lts

WORKDIR /app

#USER node

COPY . .

RUN npm install --force
RUN ls

RUN npm run build:clean

ENV PORT=4001
EXPOSE 4001

CMD ["sh", "-c","node build/src/helpers/loadEnv.js && node build/src/app.js"]
