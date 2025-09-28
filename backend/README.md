# Mini Rutter

### 1 - Initializate both postgres and redis docker containers
**NOTE: Mini Rutter uses Postgres as database, postgres container runs on port 5432 and redis container on port 6379, both ports should be free!**

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

### 3 - SYNC DATABASE AND RUN MIGRATIONS

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

### 5 - QUEUES

Access the queues dashboard to see the jobs being processed!

**Note: the FETCH_PRODUCTS_QUEUE is setup to run every 5 minutes, can be promoted on the queues dashboard to run now**

```
http://localhost:8080/admin/queues
```

### 6 - API Routes

**getProducts**
```
http://localhost:8080/products
```

**getOrders**
```
http://localhost:8080/orders
```
