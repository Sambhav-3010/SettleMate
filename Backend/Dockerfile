FROM node

ENV PORT=5000 \
    NODE_ENV=development

RUN mkdir -p /backend
WORKDIR /backend

COPY package*.json .
RUN npm install

COPY . .

RUN DATABASE_URL="postgresql://dummy:dummy@dummy/dummy" npm run build
CMD [ "npm", "start" ]