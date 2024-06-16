const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3002; // Changed to 3002

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
