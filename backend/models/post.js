const mongoose = require('mongoose');

// blueprint for data
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
});
// Compile our schema into a model and export it.
module.exports = mongoose.model('Post', postSchema);
