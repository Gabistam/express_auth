/////////////// middlewares/auth.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login'); // Return early
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
    } catch (error) {
        console.error(error);
        res.clearCookie('token');
        return res.redirect('/login'); // Return early
    }

    if (!req.user) {
        return res.redirect('/'); // Return early
    }
    
    next();
};
