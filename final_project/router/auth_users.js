const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      'access',
      { expiresIn: 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send('User successfully logged in');
  } else {
    return res
      .status(208)
      .json({ message: 'Invalid Login. Check username and password' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.query.review;
  const review2 = 'review';

  if (
    typeof books[isbn]['reviews'] === 'object' &&
    !Array.isArray(books[isbn]['reviews'])
  ) {
    books[isbn]['reviews'] = Object.values(books[isbn]['reviews']);
  }

  let bookreviews = books[isbn]['reviews'];

  if (!bookreviews.length) {
    bookreviews.push({ user: username, review: review });
    return res.send('Review Added: ' + review);
  }

  // Define the key and value to check for
  const key = 'user';
  const valueToMatch = username;

  // Use the some() method to check if any object matches the criteria
  const isMatchFound = bookreviews.some((item) => item[key] === valueToMatch);

  // Check if no match is found and perform an action
  if (!isMatchFound) {
    bookreviews.push({ user: username, review: review });
    res.send('Review Added: ' + review);
  } else {
    const matchingObject = bookreviews.find(
      (item) => item[key] === valueToMatch
    );
    const indexOfMatchingObject = bookreviews.indexOf(matchingObject);
    bookreviews[indexOfMatchingObject].review = review;
    res.send('Review Updated: ' + review);
  }
  /*
    let i = 0
    for (i; i < bookreviews.length; i++) {
      if (bookreviews[i].user == username) {
        bookreviews[i].review = review2;
      }
    bookreviews.push({ user: username, review: review });
    res.send(req.query.review);
  }
  */
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  let bookreviews = books[isbn]['reviews'];
  const key = 'user';
  const valueToMatch = username;

  // Use the some() method to check if any object matches the criteria
  const isMatchFound = bookreviews.some((item) => item[key] === valueToMatch);

  // Check if no match is found and perform an action
  if (!isMatchFound) {
    return 'You username has no current reviews to delete';
  } else {
    const matchingObject = bookreviews.find(
      (item) => item[key] === valueToMatch
    );
    const indexOfMatchingObject = bookreviews.indexOf(matchingObject);
    delete bookreviews[indexOfMatchingObject];

    // Use splice to remove the element by index
    if (indexOfMatchingObject !== -1) {
      bookreviews.splice(indexOfMatchingObject, indexOfMatchingObject + 1);
    }

    console.log(bookreviews);
    return res.status(200).send('Review Deleted');
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
