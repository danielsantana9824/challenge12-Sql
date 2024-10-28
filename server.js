require('dotenv').config({ path: 'temporal.env' });;

const pool = new Pool(
    {
      user: process.env.DB_USER,
      password: process.env.DB_USER,
      host: process.env.DB_PASS,
      database: 'books_db'
    },
    console.log(`Connected to the books_db database.`)
  )