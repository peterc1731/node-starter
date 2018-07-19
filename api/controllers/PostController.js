const mongoose = require('mongoose');
const Post = require('../models/Post');

exports.get_all_posts = (req, res) => Post.find({})
  .then(posts => res.status(200).json(posts))
  .catch(error => res.status(500).json({ error }));

exports.create_a_post = (req, res) => {
  if (!Post.schema.requiredPaths(false).filter(path => req.body[path]).length) {
    return res.status(400).json({ success: false, message: 'Invalid Post Data' });
  }
  return new Post(req.body)
    .save()
    .then(post => res.status(200).json(post))
    .catch(error => res.status(500).json({ error }));
};


exports.get_a_post = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: `Invalid ObjectId: ${req.params.id}` });
  }
  return Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ success: false, message: `No post found with id: ${req.params.id}` });
      }
      return res.status(200).json(post);
    })
    .catch(error => res.status(500).json({ error }));
};

exports.update_a_post = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: `Invalid ObjectId: ${req.params.id}` });
  }
  return Post.findOneAndUpdate({
    _id: req.params.id,
  }, req.body, { new: true })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ success: false, message: `No post found with id: ${req.params.id}` });
      }
      return res.status(200).json(post);
    })
    .catch(error => res.status(500).json({ error }));
};

exports.delete_a_post = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: `Invalid ObjectId: ${req.params.id}` });
  }
  return Post.findByIdAndRemove(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ success: false, message: `No post found with id: ${req.params.id}` });
      }
      return res.status(200).json(post);
    })
    .catch(error => res.status(500).json({ error }));
};
