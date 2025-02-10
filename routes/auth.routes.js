const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/google', authController.authWithGoogle);

router.post('/facebook', authController.authWithFacebook);

module.exports = router;
