const router = require('express').Router();
const ctrl = require('../controllers/post_controllers');

router.get("/search", ctrl.searchPosts);
router.get("/stats", ctrl.getTagStats); 
router.get("/", ctrl.getPosts);
router.get("/:id", ctrl.getPost);        
router.post("/", ctrl.createPost);
router.put("/:id", ctrl.updatePost);
router.delete("/:id", ctrl.deletePost);
router.patch("/:id/like", ctrl.likePost);
router.post("/:id/comment", ctrl.addComment);
router.get("/user/:userId", ctrl.getUserPosts);

module.exports = router;