const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/post_controllers');

router.get('/', ctrl.getPosts);
router.get('/search', ctrl.searchPosts); // Поиск должен быть ВЫШЕ, чем /:id
router.get('/stats', ctrl.getTagStats);  // Статистика тоже выше
router.get('/:id', ctrl.getPost);
router.post('/', ctrl.createPost);
router.patch('/:id/like', ctrl.likePost);
router.post('/:id/comment', ctrl.addComment);
router.get('/user/:userId', ctrl.getUserPosts);
router.delete('/:id', ctrl.deletePost);

module.exports = router;