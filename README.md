# ToDo App

This is a simple ToDo app, built in javascript.

> Disclaimer: For simplicity, this project was build in a single repository and using open source boilerplate tools.
> Server: express-generator, Front: create-react-app.

## Tech Stack:

- Node v13.1.0 + Express
- React v16.11.0
- Postgres
- Docker + Docker compose

## Getting started

> Tip: This application is based on docker. So, to lift it, you need to have [docker installed in your machine](https://docs.docker.com/install/).

If you already have docker installed, skip the previous step.

### Run

```bash
cp server/.env.default server/.env

docker-compose up
```

### Apps

- Front is running on port 8080
- Server is running on port 3000
- Db is running on port 5432