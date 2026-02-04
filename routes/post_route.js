const router = require("express").Router();
const ctrl = require("../controllers/post_controllers");

router.get("/search", ctrl.searchPosts);
router.get("/stats", ctrl.getTagStats);
router.get("/user/:userId", ctrl.getUserPosts);
router.get("/", ctrl.getPosts);
router.get("/:id", ctrl.getPost);

router.post("/", ctrl.createPost);

if (ctrl.updatePost) router.put("/:id", ctrl.updatePost);
if (ctrl.deletePost) router.delete("/:id", ctrl.deletePost);

router.patch("/:id/like", ctrl.likePost);
router.post("/:id/comment", ctrl.addComment);

module.exports = router;
