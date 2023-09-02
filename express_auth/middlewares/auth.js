const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            res.clearCookie('token');
            return res.redirect('/login');
        }
        req.user = decodedUser;
        next();
    });
}

function redirectIfLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) return next(); // Si l'utilisateur n'est pas connecté, continuez

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (!err && decodedUser) {
            return res.redirect('/profile'); // Si l'utilisateur est connecté, redirigez-le vers le profil
        }
        next();
    });
}

module.exports = {
    isLoggedIn,
    redirectIfLoggedIn
};
