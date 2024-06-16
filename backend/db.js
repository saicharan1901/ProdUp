const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

pool.connect()
  .then(client => {
    console.log('Connected to the database');
    client.release();
  })
  .catch(err => console.error('Error connecting to the database', err));

module.exports = pool;
