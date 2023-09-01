const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { userResponseParser } = require('../utils/userResponseParser');

dotenv.config();

exports.getRegister = (req, res) => {
    res.render('pages/register');
};

exports.postRegister = async (req, res) => {
    try {
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);
        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.redirect('/register');
    }
};

exports.getLogin = (req, res) => {
    res.render('pages/login');
};

exports.postLogin = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        
        if (user && await bcryptjs.compare(req.body.password, user.password)) {
            const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.cookie('token', token, { 
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
                secure: true
            });
            res.redirect('/profile');
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};

// exports.getDashboard = async (req, res) => {
//     const user = await User.findByPk(req.user.userId);
//     if (user) {
//         res.render('pages/dashboard', { user: userResponseParser(user) });
//     } else {
//         // Handle the case where the user is not found
//         res.redirect('/login');
//     }
// };


// Ici, vous pourriez également ajouter des méthodes pour la réinitialisation du mot de passe, la vérification de l'e-mail, etc.
