const users = [];

// Add a new user
const addUser = (email, password) => {
  users.push({ email, password });
};

// Find a user by email
const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

module.exports = { addUser, findUserByEmail };
