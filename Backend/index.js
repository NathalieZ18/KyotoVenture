import express from 'express';
import cors from 'cors';
import db from './db.js'; // database connection
import bcrypt from 'bcryptjs'; // bcryptjs for hashing passwords
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // Import cookie-parser to handle cookies

dotenv.config(); // Loads environment variables from .env

const app = express();
app.use(express.json());
app.use(cookieParser()); // Initialize cookie-parser middleware

// Private Key
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Login Route - Generates a JWT token when the user logs in
app.post('/api/login', (req, res) => {
  const { email, password } = req.body; // Gets the email and password from the request

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields.' }); // Checks if email and password fields are empty.
  }

  // Find if user exists in the database
  db.query('SELECT * FROM users WHERE email = $1', [email])
    .then(result => {
      if (result.rows.length === 0) {
        return res.status(400).json({ message: 'User not found.' }); // Sends error response
      }

      const user = result.rows[0]; // Gets the user from the query result

      // Compares the entered password with the hashed password in the database
      bcrypt.compare(password, user.password_hash, (err, isMatch) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error verifying password.' });
        }

        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid password.' });
        }

        // Password matched, generate a JWT token to keep the user logged in
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET_KEY, {
          expiresIn: JWT_EXPIRES_IN, // Set the token expiration
        });

        // Set the JWT token in an HTTP-only cookie to keep the user logged in
        res.cookie('token', token, {
          httpOnly: true, // Ensures the cookie is only accessible by the server
          secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
          maxAge: 1000 * 60 * 60 * 24 * 7, // Expiry time: 7 days
        });

        // Send response indicating login was successful
        res.status(200).json({ success: true, message: 'Login successful!' });
      });
    })
    .catch(err => {
      console.error(err); // Log the error if the query fails
      res.status(500).json({ message: 'Error logging in.' });
    });
});

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

// Middleware for verifying JWT token (to keep the user logged in)
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) { // If no token is provided
    return res.status(401).json({ message: 'Authentication required.' }); // Return unauthorized error
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) { // If token verification fails
      return res.status(403).json({ message: 'Token is invalid or expired.' });
    }

    req.user = user; // Attach user info to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

// Example protected route that requires authentication
app.get('/api/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route.', user: req.user });
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
