const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { addUser, findUserByEmail } = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (findUserByEmail(email)) {
    return res.status(400).json({ error: "User already exists." });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  addUser(email, hashedPassword);

  res.status(201).json({ message: "User registered successfully." });
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid email or password." });
  }

  // Create a JWT token
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Login successful.", token });
};

// Logout (optional, since JWT is stateless)
const logoutUser = (req, res) => {
  res.json({ message: "Logout successful. Invalidate the token on the client side." });
};

module.exports = { registerUser, loginUser, logoutUser };
