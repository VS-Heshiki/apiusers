const NanoidAsync = require('nanoid/async');
const knex = require('../database/connection');

class PasswordToken {
    async create(user) {
        if (user == undefined) {
            return { status: false, message: 'Email not registered :(' };
        } else {
            const nanoId = await NanoidAsync.nanoid();
            try {
                await knex
                    .insert({
                        user_id: user.id,
                        used: 0,
                        token: nanoId
                    })
                    .table('passwordtoken');
                return { status: true, token: nanoId };
            } catch (err) {
                return { status: false, message: err };
            }
        }
    }

    async validate(token) {
        try {
            var result = await knex.select().where({ token: token }).table('passwordtoken');

            if (result.length > 0) {
                var tkn = result[0];

                if (tkn.used) {
                    return { status: false, message: 'Invalid or incorrect Token' };
                } else {
                    return { status: true, token: tkn };
                }
            } else {
                return { status: false, message: 'Invalid Token' };
            }
        } catch (err) {
            return { status: false, message: err };
        }
    }

    async usedToken(token) {
        await knex.update({ used: 1 }).where({ token: token }).table('passwordtoken');
    }
}

module.exports = new PasswordToken();
