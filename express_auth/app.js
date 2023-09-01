const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const { initDatabase } = require('./config/database');
const path = require('path');
const twig = require('twig');
require('dotenv').config();


// Initialisation de la base de données
initDatabase();

//Models
const User = require('./models/User');

const app = express();

// Middleware pour parser les requêtes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware pour la gestion des cookies
app.use(cookieParser());

// Middleware pour la gestion des sessions
app.use(session({
    secret: 'JWT_SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Mettez 'secure: true' en production si vous utilisez HTTPS
}));

// Middleware pour la gestion des messages flash
app.use((req, res, next) => {
    res.locals.flashMessages = req.session.flashMessages;
    delete req.session.flashMessages;
    next();
});

// Middleware pour la gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Middleware pour la gestion des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')))


// Configuration du moteur de vue
app.set('view engine', 'twig');
app.set('views', __dirname + '/views');
twig.extendFunction('asset', function(path) {
    return '/public' + path; // ou toute autre logique que vous souhaitez implémenter
});

// Routes
app.use('/', userRoutes);

//page d'accueil
app.get('/', (req, res) => {
    res.render('pages/home');
});


module.exports = app; // Pour d'éventuels tests ou importations dans d'autres fichiers
