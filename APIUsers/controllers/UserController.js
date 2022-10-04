const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = require('../secret/secret');
var validator = require('email-validator');

class UserController {
    async index(req, res) {
        var user = await User.findAll();
        return res.json(user);
    }

    async findUserById(req, res) {
        var user = await User.findById(req.params.id);
        if (user == undefined) {
            return res.status(404);
        } else {
            return res.json(user);
        }
    }

    async create(req, res) {
        var { username, email, password } = req.body;

        if (validator.validate(email) == false) {
            res.status(400).send('Invalid email! :(');
            return;
        } else if (username == undefined || username.length <= 2) {
            res.status(400).send('Username must be at least 3 characters! :(');
            return;
        } else if (password == undefined || password.length <= 5) {
            res.status(400).send('Password must be at least 6 characters! :(');
            return;
        }

        var usernameExists = await User.usernameDuplicate(username);

        if (usernameExists) {
            res.status(400).send('username already exists :(');
            return;
        }

        var emailExists = await User.emailDuplicate(email);

        if (emailExists) {
            res.status(400).send('Email already exists :(');
            return;
        }
        await User.newUser(username, email, password);
        res.status(200).send('User created successfully! :)');
    }

    async edit(req, res) {
        var { id, email, username, role } = req.body;
        if (validator.validate(email) == false) {
            res.status(400).send('Email invalid :(')
        } else {
            var result = await User.update(id, email, username, role);
            
            if (result != undefined) {
                if (result.status) {
                    res.status(200).send('Updated successfully! :)');
                } else {
                    res.status(400).send(result.err);
                    return;
                }
            } else {
                res.status(400).send('Something unexpected happened :(');
                return;
            }
        }
    }

    async delete(req, res) {
        var result = await User.delete(req.params.id);

        if (result.status) {
            res.status(200).send('User deleted successfully! :)');
        } else {
            res.status(400).send('User not found! :(');
            return;
        }
    }

    async token(req, res) {
        var user = await User.findByEmail(req.body.email);
        var result = await PasswordToken.create(user);
        if (result.status) {
            res.status(200).send('Token has been sended :) - ' + result.token);
        } else {
            res.status(400).send('Email not registered :(');
            return;
        }
    }

    async passwordRecovery(req, res) {
        var { token, password } = req.body;
        var tokenIsValid = await PasswordToken.validate(token);

        if (!tokenIsValid.status) {
            res.status(400).send('Invalid or Incorrect token! :(');
        } else if (password.length >= 6) {
            await User.changePassword(password, tokenIsValid.token.user_id, tokenIsValid.token.token);
            res.status(200).send('Password Updated!');
        } else {
            res.status(400).send({ error: 'Password must be at least 6 characters! :(' });
            return;
        }
    }

    async login(req, res) {
        var { email, password } = req.body;
        var user = await User.findEmailAuth(email);

        if (validator.validate(email) == false) {
            res.status(400).send('Email Invalid :(');
            return;
        } else if (user != undefined){
            var compare = await bcrypt.compare(password, user.password);

            if (compare) {
                var token = jwt.sign({ email: user.email, role: user.role }, secret);
                res.send({ token: token, message: 'Logged with successfully :)' });
            } else {
                res.status(400).send('Email or password Incorrect :(');
            }
        } else {
            res.status(404).send('Email not registered :(');
        }
    }
}

module.exports = new UserController();
