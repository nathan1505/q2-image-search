require("dotenv").config();
const express = require("express");
const authRoutes = require("../routes/authRoutes");
const imageRoutes = require("../routes/imageRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/images", imageRoutes); // Image API routes

// Error handling for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
