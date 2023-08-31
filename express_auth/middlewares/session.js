const session = require('express-session');

module.exports = session({
    secret: 'JWT_SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Mettez 'secure: true' en production si vous utilisez HTTPS
});
