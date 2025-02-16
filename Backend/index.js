import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

// Allow frontend requests (even when hosted on Vercel later)
app.use(cors({
  origin: ["http://127.0.0.1:8080", "http://localhost:8080"], 
  credentials: true
}));

// Sample database simulation (you can replace this with real database logic later)
let users = [];

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Signup route (handle POST request from frontend)
app.post("/api/signup", (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body); // Log the request data

  // Simple validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }

  // Check if the user already exists (based on email)
  const userExists = users.some(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: "User with this email already exists." });
  }

  // Save the user (for now, just add to an array)
  users.push({ username, email, password }); // You should hash the password in a real app

  // Send success response
  res.status(201).json({ success: true, message: "Signup successful!" });
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
