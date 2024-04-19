# A dockeried full stack application with MySQL DB, koa, react

## Tasks

### Task 1
- Use docker-compose to spin up the DB of your choice alongside your koa app
- Provisioning db tables/schemas and seeding data should happen at startup automatically
- Koa app has a new endpoint that returns data from the containerised db
- DB data should be persisted on host machine between runs

### Task 2
- Create a simple frontend app (don't use next)
- Dockerised FE app must not be served in dev mode (must serve static built files - HTML, CSS, JS)
- Dockerize the frontend app with NGINX
- Get the FE app to retrieve data from the Koa app (from the DB)

### Task 3
Get FE container to reload when FE files are changed


