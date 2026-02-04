const User = require('../models/user_model');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      username: req.body.username,
      password: hashed
    });

    res.status(201).json({
      message: "User created",
      userId: user._id,
      username: user.username
    });
  } catch {
    res.status(400).json({ error: "Username already exists" });
  }
};

exports.login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  res.json({
    message: "Logged in",
    userId: user._id,
    username: user.username
  });
};
