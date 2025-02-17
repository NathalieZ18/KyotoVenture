import express from 'express';
import cors from 'cors';
import db from './db.js'; // Import the db connection
import bcrypt from 'bcryptjs'; // Import bcryptjs for hashing passwords

const app = express();
app.use(express.json());

// Allow frontend requests
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
        db.query(insertQuery, [username, email, hashedPassword])  // Use hashedPassword here
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

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
