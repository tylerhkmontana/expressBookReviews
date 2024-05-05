const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid

  const user = users.find((user) => user.username === username);

  return !user;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  return !!user;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) return res.status(404).send('Body empty');
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username }, 'access', {
      expiresIn: 60 * 60,
    });
    req.session.authorization = {
      accessToken,
    };

    return res.status(200).send('user successfully logged in!');
  } else {
    return res.status(403).json({ message: 'Unauthorized User' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const { review } = req.query;
  const { username } = req.user;
  const { isbn } = req.params;

  if (Object.keys(books).includes(isbn)) {
    books[isbn].reviews[username] = review;
    return res.json({
      message: 'The review was successfully added',
      book: books[isbn],
    });
  } else return res.status(400).send('Wrong isbn');
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const { username } = req.user;
  const { isbn } = req.params;

  if (Object.keys(books).includes(isbn)) {
    delete books[isbn].reviews[username];
    return res.json({
      message: 'The review was successfully deleted',
      book: books[isbn],
    });
  } else return res.status(400).send('Wrong isbn');
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
