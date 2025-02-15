const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Database connection
const connection = mysql.createConnection(process.env.DATABASE_URL);

// Test the database connection
connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to the database:', err);
    return;
  }
  console.log('✅ Connected to the MySQL database');
});

// Example route to check if the backend is working
app.get('/', (req, res) => {
  res.send('✅ Backend is working!');
});

// Example route to fetch data from the MySQL database
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('❌ Error retrieving data:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results); // Send the data as a JSON response
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
