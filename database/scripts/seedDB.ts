import Mysql from 'mysql2/promise'

const baseURL = 'https://v2.jokeAPI.dev'

type APIResponse = {
  error: string
  [key: string]: any
}

async function getJokes() {
  const jokesRaw = []
  // Get the number of jokes in jokeAPI
  const infoResponse = await fetch(`${baseURL}/info`)
  const infoData = (await infoResponse.json()) as APIResponse
  if (infoData.error) {
    console.error('Error getting info:', infoData.error)
    return
  }
  const jokesNo = infoData.jokes.idRange.en[1]

  // Get the jokes in batches of 10
  for (let i = 0; i <= jokesNo; i += 10) {
    let idRange = i + 9
    if (idRange > jokesNo) {
      idRange = jokesNo
    }

    const jokeResponse = await fetch(
      `${baseURL}/joke/Any?amount=10&idRange=${i}-${idRange}`
    )

    const jokeData = (await jokeResponse.json()) as APIResponse
    if (jokeData.error) {
      console.error('Error getting joke:', jokeData)
      return
    }

    jokesRaw.push(...jokeData.jokes)
  }

  return jokesRaw.map(({ id, category, type, joke, setup, delivery }) => {
    const jokeData = {
      category,
      type,
      id,
    }

    if (type === 'single') {
      return {
        ...jokeData,
        joke,
      }
    } else {
      return {
        ...jokeData,
        setup,
        delivery,
      }
    }
  })
}

async function seedDB(jokeData: any[]) {
  const dbConnection = await Mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'jokes',
  })

  // Delete the jokes table if it exists
  await dbConnection.query('DROP TABLE IF EXISTS jokes')

  // Create a new jokes table
  await dbConnection.query(
    'CREATE TABLE jokes (id INT PRIMARY KEY, category VARCHAR(255), type VARCHAR(255), joke TEXT, setup TEXT, delivery TEXT)'
  )

  // Populate the table with the jokes
  for (const joke of jokeData) {
    const { id, category, type, joke: jokeText, setup, delivery } = joke
    await dbConnection.query(
      'INSERT INTO jokes (id, category, type, joke, setup, delivery) VALUES (?, ?, ?, ?, ?, ?)',
      [id, category, type, jokeText, setup, delivery]
    )
  }

  // Close the connection
  await dbConnection.end()
}

getJokes().then(async (jokes) => {
  if (jokes) {
    try {
      await seedDB(jokes)
    } catch (error) {
      console.error('Error seeding the database:', error)
      process.exit(1)
    }
  }
  process.exit(0)
})
