FROM node

ENV PORT=5000 \
    NODE_ENV=development

RUN mkdir -p /backend
WORKDIR /backend

COPY package*.json .
RUN npm install

COPY . .

RUN npm run build
CMD [ "npm", "start" ]