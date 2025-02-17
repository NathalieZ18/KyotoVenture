import express from 'express';
import cors from 'cors';
import db from './db.js'; // database connection
import bcrypt from 'bcryptjs'; // bcryptjs for hashing passwords

const app = express();
app.use(express.json());

// Allow frontend requests (node http server)
app.use(cors({
  origin: ['http://127.0.0.1:8080', 'http://localhost:8080'],
  credentials: true,
}));

// Signup route (handle POST request from frontend)
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body); // Log the request data

  // Simple validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  // Check if the user already exists (based on email)
  const query = 'SELECT * FROM users WHERE email = $1';
  db.query(query, [email])  
    .then(result => {
      if (result.rows.length > 0) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      // Hashes password before saving it to the database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error hashing password.' });
        }

        // Insert the new user into the database, including created_at column (timestamp for creation)
        const insertQuery = `
          INSERT INTO users (username, email, password_hash, created_at)
          VALUES ($1, $2, $3, NOW())
        `;
        db.query(insertQuery, [username, email, hashedPassword])  
          .then(() => {
            res.status(201).json({ success: true, message: 'Signup successful!' });
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error saving user to database.' });
          });
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Error checking if user exists.' });
    });
});

// LOGIN ROUTE
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  // Check if user exists
  const query = 'SELECT * FROM users WHERE email = $1';
  db.query(query, [email])
    .then(result => {
      if (result.rows.length === 0) {
        return res.status(400).json({ message: 'User not found.' });
      }

      const user = result.rows[0];

      // Compare hashed password
      bcrypt.compare(password, user.password_hash, (err, isMatch) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error verifying password.' });
        }

        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid password.' });
        }

        // Login successful
        res.status(200).json({ success: true, message: 'Login successful!' });
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Error logging in.' });
    });
});


app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
