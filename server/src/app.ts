import Koa from 'koa'
import Router from 'koa-router'

import {
  getDBConnection,
  getAllJokes,
  getJokeById,
  getJokesByCategory,
} from './database'

const app = new Koa()
const router = new Router()

const hostname = process.env.DB_URL || 'localhost'
const port = process.env.DB_PORT || 3306


app.use(async (ctx, next) => {
  if (!app.context.db) {
    console.log('Getting the DB connection')
    try {
      const dbConnection = await getDBConnection({
        host: hostname,
        port: +port,
        user: 'root',
        password: 'root',
        database: 'jokes',
      })

      app.context.db = dbConnection

      await next()
    } catch (error) {
      ctx.status = 500
      ctx.body = 'Error connecting to the database'

      return
    }
  } else {
    await next()
  }
})

router.get('/jokes', async (ctx) => {
  const db = app.context.db
  const rows = await getAllJokes(db)

  ctx.type = 'application/json'
  ctx.status = 200
  ctx.body = {
    status: 'success',
    jokes: rows,
  }
})

router.get('/jokes/:id', async (ctx) => {
  if (!Number.isInteger(Number(ctx.params.id))) {
    ctx.status = 400
    ctx.type = 'application/json'
    ctx.body = {
      status: 400,
      success: false,
      error: 'Invalid ID',
    }

    return
  }

  const db = app.context.db
  const joke = await getJokeById(db, ctx.params.id)

  if (!joke) {
    ctx.status = 404
    ctx.type = 'application/json'
    ctx.body = {
      status: 404,
      success: false,
      error: 'Joke not found',
    }

    return
  }

  ctx.type = 'application/json'
  ctx.body = {
    joke,
  }
})

router.get('/category/:category', async (ctx) => {
  const db = app.context.db
  const rows = await getJokesByCategory(db, ctx.params.category)

  ctx.type = 'application/json'
  ctx.body = {
    status: 'success',
    jokes: rows,
  }
})

app.use(router.routes())

app.use(async (ctx) => {
  ctx.status = 404
  ctx.type = 'application/json'
  ctx.body = {
    status: 404,
    success: false,
    error: 'Resource not found',
  }
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
