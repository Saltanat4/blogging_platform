const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { 
        type: String, 
        required: true },
    body: { 
        type: String, 
        required: true },
    author: {  
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true  },
    likes: { 
        type: Number,
        default: 0 },
    comments: [{
        user: String,
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    tags: [String]
}, { timestamps: true });

postSchema.index({ title: 'text', tags: 1 });
const Post = mongoose.model("Posts", postSchema);
module.exports = Post; 