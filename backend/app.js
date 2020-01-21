const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const Post = require('./models/post');

// The default DB name is 'test', can be overriden.
mongoose.connect("mongodb+srv://sherry:%5FXb5%5FAs%2Dr4higW@cluster0-fcivp.mongodb.net/node-angular?retryWrites=true&w=majority", { useNewUrlParser: true })
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

// To make express aware of postRoutes
// All API posts that starts with '/api/posts' will be forwarded into the postRoutes routing setup
//app.use('/api/posts', postRoutes);

app.post("/api/posts", (req, res, next) => {
  const post = new Post ({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({//201: a new resource was created
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted' });
  });
});

module.exports = app;
