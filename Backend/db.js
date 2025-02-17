import pkg from 'pg'; 
const { Client } = pkg;  


// Set up PostgreSQL connection
const db = new Client({
  host: 'localhost', 
  user: 'postgres', 
  database: 'kyotoventure', 
  password: 'cloudcaiks232', 
  port: 5432
});

// Connect to PostgreSQL
db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

export default db;
