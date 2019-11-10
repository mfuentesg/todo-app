FROM node:13.1.0-alpine
LABEL mantainer="Marcelo Fuentes <marceloe.fuentes@gmail.com>"

WORKDIR /app
EXPOSE 8080

COPY package.json yarn.lock ./
RUN yarn

COPY . .

ENTRYPOINT ["yarn"]
CMD ["start"]