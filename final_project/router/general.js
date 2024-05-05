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
  const getBooks = new Promise((resolve, reject) => {
    if (books) resolve(books);
    else reject(new Error('Failed to get books'));
  });

  getBooks.then(
    (result) => {
      return res.json(result);
    },
    (err) => {
      console.log(err);
      return res.status(500).send('Failed to get books');
    }
  );
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const { isbn } = req.params;

  const getBookByIsbn = new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject(new Error('Failed to get the book'));
  });

  getBookByIsbn.then(
    (result) => {
      return res.json(result);
    },
    (err) => {
      console.log(err);
      return res.status(500).send('Failed to get books');
    }
  );
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const { author } = req.params;

  const getBooksByAuthor = new Promise((resolve, reject) => {
    const booksByAuthor = [];
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author === author) booksByAuthor.push(books[isbn]);
    });

    if (booksByAuthor.length > 0) resolve(booksByAuthor);
    else reject(new Error('No book found by the author'));
  });

  getBooksByAuthor.then(
    (result) => {
      return res.json(result);
    },
    (err) => {
      console.log(err);
      return res.status(500).send('Failed to get books');
    }
  );
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  //Write your code here
  const { title } = req.params;

  const getBooksByTitle = new Promise((resolve, reject) => {
    const booksByTitle = [];
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].title === title) booksByAuthor.push(books[isbn]);
    });

    if (booksByTitle.length > 0) resolve(booksByTitle);
    else reject(new Error('No book found by the title'));
  });

  getBooksByTitle.then(
    (result) => {
      return res.json(result);
    },
    (err) => {
      console.log(err);
      return res.status(500).send('Failed to get books');
    }
  );
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  return res.json(books[isbn].reviews);
});

module.exports.general = public_users;
