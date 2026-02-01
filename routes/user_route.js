const router = require('express').Router();
const userCtrl = require('../controllers/user_controllers');

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);

module.exports = router;