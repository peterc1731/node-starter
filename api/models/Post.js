const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'The title must not be empty',
  },
  author: {
    type: String,
    required: 'The author must not be empty',
  },
  body: {
    type: String,
    required: 'The body must not be empty',
  },
});

mongoose.model('Post', PostSchema);

module.exports = mongoose.model('Post');
