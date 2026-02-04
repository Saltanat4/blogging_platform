const Post = require("../models/post_model");

exports.getPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("author", "username")
    .sort({ createdAt: -1 });
  res.json(posts);
};

exports.getPost = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "username");

  if (!post) return res.status(404).json({ error: "Not found" });
  res.json(post);
};

exports.createPost = async (req, res) => {
  if (!req.body.author)
    return res.status(401).json({ error: "Login required" });

  const post = await Post.create(req.body);
  res.status(201).json(post);
};

exports.updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });

  if (post.author.toString() !== req.body.userId)
    return res.status(403).json({ error: "Forbidden" });

  post.title = req.body.title;
  post.body = req.body.body;
  await post.save();

  res.json(post);
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });

  if (post.author.toString() !== req.body.userId)
    return res.status(403).json({ error: "Forbidden" });

  await post.deleteOne();
  res.json({ message: "Deleted" });
};

exports.likePost = async (req, res) => {
  const { userId } = req.body;

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });

  const index = post.likedBy.indexOf(userId);

  if (index === -1) {
    post.likedBy.push(userId);
    post.likes += 1;
  } else {
    post.likedBy.splice(index, 1);
    post.likes -= 1;
  }

  await post.save();
  res.json(post);
};

exports.addComment=async(req, res) => {
    const id = new URLSearchParams(window.location.search).get('id');
    const text = document.getElementById("commentText").value;
    const username = localStorage.getItem("username");

    if(!username) return alert("Login to comment");

    const response = await fetch(`/blogs/${id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, text })
    });
    if (response.ok) location.reload();
}

exports.getUserPosts = async (req, res) => {
  const posts = await Post.find({ author: req.params.userId })
    .populate("author", "username");
  res.json(posts);
};

exports.searchPosts = async (req, res) => {
  const q = req.query.q;
  const posts = await Post.find({
    title: { $regex: q, $options: "i" }
  }).populate("author", "username");

  res.json(posts);
};

exports.getTagStats = async (req, res) => {
  const stats = await Post.aggregate([
    { $unwind: "$tags" },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.json(stats);
};
