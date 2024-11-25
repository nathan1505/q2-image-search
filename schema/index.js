const { gql } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { getImages } = require("../controllers/imageController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { addUser, findUserByEmail } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Type Definitions
const typeDefs = gql`
  type User {
    email: String!
  }

  type AuthResponse {
    token: String
    message: String
  }

  type Image {
    image_ID: String
    thumbnails: String
    preview: String
    title: String
    source: String
    tags: [String]
  }

  type Query {
    searchImages(query: String!): [Image]
  }

  type Mutation {
    register(email: String!, password: String!): String
    login(email: String!, password: String!): AuthResponse
  }
`;

// Resolvers
const resolvers = {
  Query: {
    // Search Images Resolver
    searchImages: async (_, { query }, context) => {
      try {
        // Authenticate user
        const user = authenticateToken(context);

        // Fetch images using the controller function
        const images = await getImages(query);

        // Return the image results
        return images;
      } catch (error) {
        console.error("Error in searchImages:", error.message);
        throw new Error(error.message); // Throw error to the client
      }
    },
  },

  Mutation: {
    // Register Resolver
    register: async (_, { email, password }) => {
      try {
        // Check if the user already exists
        const existingUser = await findUserByEmail({ email });
        if (existingUser) {
          throw new Error("User already exists.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to the database
        addUser({ email, password: hashedPassword });

        return "User registered successfully.";
      } catch (error) {
        console.error("Error during registration:", error.message);
        throw new Error("Failed to register user.");
      }
    },

    // Login Resolver
    login: async (_, { email, password }) => {
      try {
        // Find the user in the database
        const user = await findUserByEmail({ email });
        if (!user) {
          throw new Error("Invalid credentials."); // User doesn't exist
        }

        // Compare the provided password with the hashed password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid credentials."); // Password doesn't match
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
          expiresIn: "1h", // Token expires in 1 hour
        });

        return {
          token,
          message: "Login successful.",
        };
      } catch (error) {
        console.error("Error during login:", error.message);
        throw new Error("Login failed.");
      }
    },
  },
};

// Create the schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema ;
