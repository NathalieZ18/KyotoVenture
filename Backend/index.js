const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://kyoto-venture.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// Database connection pool
const pool = mysql.createPool(process.env.DATABASE_URL);

// Test the database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to the MySQL database');
    connection.release(); // Release the connection
  } catch (err) {
    console.error('❌ Error connecting to the database:', err);
  }
})();

// Example route to check if the backend is working
app.get('/', (req, res) => {
  res.send('✅ Backend is working!');
});

// Example route to fetch data from the MySQL database
app.get('/users', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM users');
    res.json(results);
  } catch (err) {
    console.error('❌ Error retrieving data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});