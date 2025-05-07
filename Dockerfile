FROM node:lts-alpine as build 
WORKDIR /app 

COPY tsconfig.json ./
COPY package*.json ./
COPY .env ./
COPY . . 

RUN npm install

FROM node:lts-alpine 

RUN apk update
WORKDIR /app 

COPY --from=build /app ./
COPY --from=build /app/dist ./dist
EXPOSE 8080

CMD ["npx","nodemon","dist/index.js"];