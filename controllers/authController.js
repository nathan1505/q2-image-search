const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { addUser, findUserByEmail } = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
const registerUser = async (email, password) => {
  if (findUserByEmail(email)) {
    throw new Error("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  addUser(email, hashedPassword);
  return { message: "User registered successfully." };
};

// Login a user
const loginUser = async (email, password) => {
  const user = findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
  return { token, message: "Login successful." };
};

module.exports = { registerUser, loginUser };
