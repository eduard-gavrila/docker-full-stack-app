import Mysql, { ConnectionOptions } from 'mysql2/promise'

export async function getDBConnection({
  host,
  user,
  port,
  password,
  database,
}: ConnectionOptions) {
    const connection = await Mysql.createConnection({
      host,
      user,
      port,
      password,
      database,
    })

    return connection
}

export async function getAllJokes(db: Mysql.Connection) {
  const [rows] = await db.query('SELECT * FROM jokes')
  return rows
}

export async function getJokeById(db: Mysql.Connection, id: string) {
  const [rows] = await db.query('SELECT * FROM jokes WHERE id = ?', [id])
  return (rows as Array<unknown>)[0]
}

export async function getJokesByCategory(db: Mysql.Connection, category: string) {
  const [rows] = await db.query('SELECT * FROM jokes WHERE category = ?', [category])
  return rows as Array<unknown>
}