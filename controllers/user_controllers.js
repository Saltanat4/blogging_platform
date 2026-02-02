const User = require('../models/user_model');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        const user = await User.create({
            username: req.body.username,
            password: hashedPassword
        });
        res.status(201).json({ message: "User created", user });
    } catch (err) {
        res.status(400).json({ error: "Username already exists" });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.json({ 
            message: "Logged in", 
            userId: user._id, 
            username: user.username 
        });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};