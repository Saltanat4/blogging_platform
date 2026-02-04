const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const postRoutes = require('./routes/post_route');
const authRoutes = require('./routes/user_route'); 

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public")); // Для CSS и script.js
// --- API Маршруты ---
app.use("/auth", authRoutes); 
app.use("/blogs", postRoutes);

// --- Маршруты для отображения страниц (UI) ---

// Главная страница
app.get('/', (req, res) => res.render('index'));

// Авторизация
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));

// Работа с постами
app.get('/create', (req, res) => res.render('create')); // Страница создания
app.get('/my-posts', (req, res) => res.render('my-posts')); // Список моих постов
app.get('/details', (req, res) => res.render('details')); // Просмотр одного поста
app.get('/edit', (req, res) => res.render('create')); // Используем ту же форму для редактирования

// Аналитика и статистика
app.get('/analytics', (req, res) => res.render('analytics'));
app.get('/stats', (req, res) => res.render('analytics'));

// --- База данных и запуск сервера ---
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000');
            console.log('Connected to MongoDB');
        });
    })
    .catch(err => console.error('MongoDB Connection Error:', err));