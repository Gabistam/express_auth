///////////app.js
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const { initDatabase } = require('./config/database');
const path = require('path');
const twig = require('twig');
require('dotenv').config();

// Sécurité supplémentaire
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Initialisation de la base de données
initDatabase();

const app = express();

// Sécurité supplémentaire
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'JWT_SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.use((req, res, next) => {
    res.locals.flashMessages = req.session.flashMessages;
    delete req.session.flashMessages;
    next();
});

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'twig');
app.set('views', __dirname + '/views');
twig.extendFunction('asset', function(path) {
    return '/public' + path;
});

// Middleware pour s'assurer de l'authentification
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// Utilisation du middleware pour des routes spécifiques (si nécessaire)
// app.use('/protected-route', ensureAuthenticated, ...);

app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('pages/home');
});

// Middleware pour la gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use((req, res, next) => {
    res.status(404).render('pages/404');
});

module.exports = app;
