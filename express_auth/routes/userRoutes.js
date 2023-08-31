const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/auth');

// Routes liées à l'authentification
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

// Routes liées aux opérations de l'utilisateur (ces routes nécessitent une authentification)
router.get('/profile', authMiddleware, userController.getProfile);
router.post('/profile/update', authMiddleware, userController.updateProfile);
router.post('/profile/delete', authMiddleware, userController.deleteAccount);

module.exports = router;
