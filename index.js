const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postRoutes = require('./routes/post_route');
const userRoutes = require('./routes/user_route');


dotenv.config();
const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/blogs', postRoutes);
app.use('/auth', userRoutes);

app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/create', (req, res) => res.render('create'));
app.get('/analytics', (req, res) => res.render('analytics'));
app.get('/post', (req, res) => res.render('details'));
app.get('/my-posts', (req, res) => res.render('my-posts'));

mongoose.connect(process.env.MONGO_URL)
    .then(() => app.listen(3000, () => console.log('Server running on http://localhost:3000')))
    .catch(err => console.log(err));