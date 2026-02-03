
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    // Поле author должно быть ссылкой на коллекцию Users
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    tags: [String],
    likes: { type: Number, default: 0 },
    comments: [{ user: String, text: String }]
});

module.exports = mongoose.model('Post', postSchema);