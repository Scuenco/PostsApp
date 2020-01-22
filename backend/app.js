const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');

// The default DB name is 'test', can be overriden.
mongoose.connect("ConnectionString", { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to Database!');
  })
  .catch((e) => {
    console.log('Connection failed! '+ e);
  });

// To return a valid json data.
app.use(bodyParser.json());

// To parse url encoded data.
// Extended : false, to only support default features in the url encoding.
app.use(bodyParser.urlencoded({extended: false}));

// Setup CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

// To make express app aware of postRoutes
// All API posts that starts with '/api/posts' will be forwarded into the postRoutes routing setup
app.use('/api/posts', postRoutes);

module.exports = app;
