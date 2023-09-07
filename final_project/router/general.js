const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();
const axios = require('axios');
const fs = require('fs').promises;

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: 'User successfully registred. Now you can login' });
    } else {
      return res.status(404).json({ message: 'User already exists!' });
    }
  }
  return res.status(404).json({ message: 'Unable to register user.' });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  /*
  try {
    // Read the file asynchronously
    const data = await fs.readFile('./router/booksdb.js', 'utf8');

    // Parse the JSON data (assuming the file contains JSON)
    const response = JSON.parse(data);

    // Return the response from the other API as the result
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});*/

  const getBooks = () => {
    return new Promise((resolve, reject) => {
      // Simulate some async operation, e.g., fetching data from a database
      setTimeout(() => {
        const data = books;
        resolve(data);
      }, 500); // Simulate a 1-second delay
    });
  };
  // Call the asynchronous operation
  await getBooks()
    .then((data) => {
      return res.send(data).status(200); // Send the object as a JSON response
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});

/*
  let myPromise = new Promise((resolve, reject) => {
    return res.send(JSON.stringify(books, null, 4));
    resolve(books);
  });
  myPromise.then((successMessage) => {
    console.log('From Callback ' + successMessage);
  });
});*/

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const getBooksIsbn = () => {
    return new Promise((resolve, reject) => {
      // Simulate some async operation, e.g., fetching data from a database
      setTimeout(() => {
        const data = books[req.params.isbn];
        resolve(data);
      }, 500); // Simulate a 1-second delay
    });
  };
  // Call the asynchronous operation
  await getBooksIsbn()
    .then((data) => {
      return res.send(data).status(200); // Send the object as a JSON response
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const key = 'author';
  const valueToMatch = author;

  const getBooksAuthor = () => {
    return new Promise((resolve, reject) => {
      // Simulate some async operation, e.g., fetching data from a database
      setTimeout(() => {
        const matchingAuthors = {};

        // Loop through the dictionary and add matching objects to the result
        for (const personKey in books) {
          if (books[personKey][key] === valueToMatch) {
            matchingAuthors[personKey] = books[personKey];
          }
        }
        resolve(matchingAuthors);
      }, 500); // Simulate a 1-second delay
    });
  };
  // Call the asynchronous operation using await
  await getBooksAuthor()
    .then((matchingAuthors) => {
      return res.send(matchingAuthors).status(200); // Send the object as a JSON response
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });

  /*
  // Initialize an empty object to store matching objects
  const matchingAuthors = {};

  // Loop through the dictionary and add matching objects to the result
  for (const personKey in books) {
    if (books[personKey][key] === valueToMatch) {
      matchingAuthors[personKey] = books[personKey];
    }
  }
  return res.send(matchingAuthors).status(200);  */
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const key = 'title';
  const valueToMatch = title;

  const getBooksTitle = () => {
    return new Promise((resolve, reject) => {
      // Simulate some async operation, e.g., fetching data from a database
      setTimeout(() => {
        const matchingTitles = {};

        // Loop through the dictionary and add matching objects to the result
        for (const personKey in books) {
          if (books[personKey][key] === valueToMatch) {
            matchingTitles[personKey] = books[personKey];
          }
        }
        resolve(matchingTitles);
      }, 500); // Simulate a 1-second delay
    });
  };
  // Call the asynchronous operation
  await getBooksTitle()
    .then((matchingTitles) => {
      return res.send(matchingTitles).status(200); // Send the object as a JSON response
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });

  /*
  // Initialize an empty object to store matching objects
  const matchingTitles = {};

  // Loop through the dictionary and add matching objects to the result
  for (const personKey in books) {
    if (books[personKey][key] === valueToMatch) {
      matchingTitles[personKey] = books[personKey];
    }
  }
  return res.send(matchingTitles).status(200);*/
});

//  Get book reviews
public_users.get('/review/:isbn', async function (req, res) {
  const getReviewsIsbn = () => {
    return new Promise((resolve, reject) => {
      // Simulate some async operation, e.g., fetching data from a database
      setTimeout(() => {
        const data = books[req.params.isbn]['reviews'];
        resolve(data);
      }, 500); // Simulate a 1-second delay
    });
  };
  // Call the asynchronous operation
  await getReviewsIsbn()
    .then((data) => {
      return res.send(data).status(200); // Send the object as a JSON response
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});
// return res.send(books[isbn]['reviews']).status(200);

module.exports.general = public_users;
