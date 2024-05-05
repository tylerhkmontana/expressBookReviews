const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ message: 'Not enough creds provided' });
  } else if (isValid(username)) {
    users.push({ username, password });
    res.send('User has been registered');
    console.log(users);
  } else {
    return res.status(400).json({ message: 'User already exists' });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  return res.status(300).json(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const { author } = req.params;

  const booksByAuthor = [];
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author === author) booksByAuthor.push(books[isbn]);
  });
  return res.status(300).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  //Write your code here
  const { title } = req.params;

  const booksByAuthor = [];
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) booksByAuthor.push(books[isbn]);
  });
  return res.status(300).json(booksByAuthor);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  return res.json(books[isbn].reviews);
});

module.exports.general = public_users;
