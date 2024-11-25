require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const schema = require("../schema/index");

const app = express();

// Apollo Server setup
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    // Pass the req object to the context
    return { req };
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000/graphql");
  });
}

startServer();
