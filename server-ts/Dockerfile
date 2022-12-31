FROM node:12.16.1-alpine3.9 as server
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run compile
EXPOSE 3000
CMD ["npm", "run", "start"]
