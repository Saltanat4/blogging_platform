const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // username
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    tags: [String],
    likes: { type: Number, default: 0 },

    likedBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],

    comments: [commentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
