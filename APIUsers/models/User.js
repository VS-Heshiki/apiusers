const knex = require('../database/connection');
const bcrypt = require('bcrypt');
const PasswordToken = require('./PasswordToken');
class User {
    async findAll() {
        try {
            var result = await knex.select(['id', 'username', 'role', 'email']).table('users');
            return result;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async findById(id) {
        try {
            var result = await knex.select(['id', 'email', 'username', 'role']).where({ id: id }).table('users');

            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    async findByEmail(email) {
        try {
            var result = await knex.select(['id', 'username', 'email', 'role']).where({ email: email }).table('users');

            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    async findEmailAuth(email) {
        try {
            var result = await knex.select(['id', 'username', 'email', 'password', 'role']).where({ email: email }).table('users');

            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    async newUser(username, email, password) {
        try {
            var hash = await bcrypt.hash(password, 10);

            await knex.insert({ username, email, password: hash, role: 0 }).table('users');
        } catch (err) {
            console.log(err);
        }
    }

    async emailDuplicate(email) {
        try {
            var result = await knex.select('*').from('users').where({ email: email });

            if (result.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async usernameDuplicate(username) {
        try {
            var result = await knex.select('*').from('users').where({ username: username });

            if (result.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async update(id, email, username, role) {
        var user = await this.findById(id);

        if (user != undefined) {
            var editUser = {};

            if (email != undefined) {
                if (email != user.email) {
                    var result = await this.emailDuplicate(email);
                    if (result == false) {
                        editUser.email = email;
                    } else {
                        return { status: false, message: 'Email already registered' };
                    }
                }
            }

            if (username != undefined) {
                if (username != user.username) {
                    var result = await this.usernameDuplicate(username);
                    if (result == false) {
                        editUser.username = username;
                    } else {
                        return { status: false, message: 'Username already registered' };
                    }
                }
            }

            if (role != undefined) {
                editUser.role = role;
            }

            try {
                await knex.update(editUser).where({ id: id }).table('users');
                return { status: true };
            } catch (err) {
                return { status: false };
            }
        } else {
            return { status: false, message: 'User not found' };
        }
    }

    async delete(id) {
        var user = await this.findById(id);
        if (user != undefined) {
            try {
                await knex.delete().where({ id: id }).table('users');
                return { status: true, message: 'Deleted user' };
            } catch (err) {
                return { status: false, message: err };
            }
        } else {
            return { status: false, message: 'User not found' };
        }
    }

    async changePassword(newPassword, id, token) {
        var hash = await bcrypt.hash(newPassword, 10);

        await knex.update({ password: hash }).where({ id: id }).table('users');
        await PasswordToken.usedToken(token);
    }
}

module.exports = new User();
