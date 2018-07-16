const Post = require('../models/Post');

exports.get_all_posts = (req, res) => Post.find({})
  .then(posts => res.status(200).json(posts))
  .catch(error => res.status(500).json({ error }));

exports.create_a_post = (req, res) => new Post(req.body)
  .save()
  .then(post => res.status(200).json(post))
  .catch(error => res.status(500).json({ error }));


exports.get_a_post = (req, res) => Post.findById(req.params.id)
  .then(post => res.status(200).json(post))
  .catch(error => res.status(500).json({ error }));

exports.update_a_post = (req, res) => Post.findOneAndUpdate({
  _id: req.params.id,
}, req.body, { new: true })
  .then(post => res.status(200).json(post))
  .catch(error => res.status(500).json({ error }));

exports.delete_a_post = (req, res) => Post.findByIdAndRemove({ _id: req.params.id })
  .then(post => res.status(200).json(post))
  .catch(error => res.status(500).json({ error }));
