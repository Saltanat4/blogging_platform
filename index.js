const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postRoutes = require('./routes/post_route');

dotenv.config();
const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/blogs', postRoutes);

app.get('/', (req, res) => res.render('index'));
app.get('/create', (req, res) => res.render('create'));
app.get('/analytics', (req, res) => res.render('analytics'));
app.get('/post', (req, res) => res.render('details'));

mongoose.connect(process.env.MONGO_URL)
    .then(() => app.listen(3000, () => console.log('Server running on http://localhost:3000')))
    .catch(err => console.log(err));