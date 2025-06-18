const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully!" });
});


public_users.get('/', (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});


public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found for provided ISBN." });
  }
});


public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const matchingBooks = [];

  for (const isbn in books) {
    if (books[isbn].author === author) {
      matchingBooks.push({ isbn, ...books[isbn] });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found by that author." });
  }
});


public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const matchingBooks = [];

  for (const isbn in books) {
    if (books[isbn].title === title) {
      matchingBooks.push({ isbn, ...books[isbn] });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found with that title." });
  }
});


public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews || {});
  } else {
    return res.status(404).json({ message: "Book not found for provided ISBN." });
  }
});

module.exports.general = public_users;
