const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/post_controllers");

router.get("/", ctrl.getPosts);
router.get("/stats", ctrl.getTagStats);
router.get("/search", ctrl.searchPosts);
router.post("/", ctrl.createPost);
router.get("/:id", ctrl.getPost);
router.put("/:id", ctrl.updatePost);      
router.delete("/:id", ctrl.deletePost);   
router.patch("/:id/like", ctrl.likePost);
router.post("/:id/comment", ctrl.addComment);

module.exports = router;