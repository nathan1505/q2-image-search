const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (context) => {
  const authHeader = context.req.headers.authorization; // Access the req object from context

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Access denied. No token provided.");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // Return user info for use in resolvers
  } catch (error) {
    throw new Error("Invalid or expired token.");
  }
};

module.exports = { authenticateToken };
