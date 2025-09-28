# agendaAI

### 1 - Initializate both postgres and redis docker containers
**NOTE: agendaAI uses Postgres as database, postgres container runs on port 5432 and redis container on port 6379, both ports should be free!**
***For agendaAI you should have postgres, pgadmin4 and docker already installed in your machine***

```sh
docker-compose up
```

### 2 - ENV (only for development purposes)

Create a file called **.env.development** in the root of the project with the following content:

```
NODE_ENV=development

BACKEND_URL=http://localhost
PORT=8080

DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=minirutter

REDIS_URI=localhost
REDIS_PORT=6379

PAGE_SIZE=50
```

### 3 - SYNC DATABASE AND RUN MIGRATIONS (while running docker on another terminal)
***First, create the user on the database to reuse the email and password***

```sh
yarn db:sync
```

```
yarn db:migrate
```

### 4 - START SERVER

```sh
yarn dev
```
