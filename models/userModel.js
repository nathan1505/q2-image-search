const users = [];

// Add a new user
const addUser = ({ email, password }) => {
  const user = { email, password };
  users.push(user);
  return user; // Return the new user
};

// Find a user by email
const findUserByEmail = ({ email }) => {
  return users.find((user) => user.email === email);
};

module.exports = { addUser, findUserByEmail };
