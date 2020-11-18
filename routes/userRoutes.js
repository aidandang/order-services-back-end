const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/auth', authController.authorizedUser);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

router.patch('/updatepassword', authController.updatePassword);

router.patch('/updateme', userController.updateMe);
router.delete('/deleteme', userController.deleteMe);

module.exports = router;