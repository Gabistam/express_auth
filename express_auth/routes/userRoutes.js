const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');
const { isLoggedIn, redirectIfLoggedIn, authMiddleware } = require('../middlewares/auth.js');

// Routes liées à l'authentification
router.get('/register', redirectIfLoggedIn, authController.getRegister);
router.post('/register', redirectIfLoggedIn, authController.postRegister);
router.get('/login', redirectIfLoggedIn, authController.getLogin);
router.post('/login', redirectIfLoggedIn, authController.postLogin);
router.get('/logout', authController.logout);

// Routes liées aux opérations de l'utilisateur (ces routes nécessitent une authentification)
router.get('/profile', isLoggedIn, userController.getProfile);
router.post('/profile/update', isLoggedIn, userController.updateProfile);
router.post('/profile/delete', isLoggedIn, userController.deleteAccount);

module.exports = router;
