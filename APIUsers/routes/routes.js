const express = require('express');
var router = express.Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController')
const Auth0 = require('../middleware/Auth0');

router.post('/user', UserController.create);

router.get('/users', Auth0, UserController.index);

router.get('/user/:id', Auth0, UserController.findUserById);

router.put('/user', Auth0, UserController.edit);

router.delete('/user/:id', Auth0, UserController.delete);

router.post('/recovery', UserController.token);

router.post('/newPassword', UserController.passwordRecovery);

router.post('/login', UserController.login);

router.post('/auth', Auth0, AuthController.validate)

module.exports = router;
