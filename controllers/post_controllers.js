const Post = require("../models/post_model.js");

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.json(post);
    } catch (err) { res.status(404).json({ error: "Post not found" }); }
};

exports.createPost = async (req, res) => {
    try {
        const newPost = await Post.create(req.body);
        res.status(201).json(newPost);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.updatePost = async (req, res) => {
    try {
        const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getTagStats = async (req, res) => {
    try {
        const stats = await Post.aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json(stats);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
        res.json(post);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addComment = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: { user: req.body.user, text: req.body.text } } },
            { new: true }
        );
        res.json(post);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.searchPosts = async (req, res) => {
    try {
        const query = req.query.q;
        const posts = await Post.find({ 
            title: { $regex: query, $options: "i" } 
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};