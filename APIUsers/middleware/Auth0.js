var jwt = require('jsonwebtoken');
const secret = require('../secret/secret');

module.exports = function (req, res, next) {
    const authToken = req.headers['authorization'];

    if (authToken != undefined) {
        const bearer = authToken.split(' ');
        var token = bearer[1];

        try {
            var decoded = jwt.verify(token, secret);
            
            if (decoded.role == 1) {
                next();
            } else {
                console.log(decoded.role)
                res.status(401).send('You do not have permission to access this page! :(');
            }
        } catch (err) {
            res.status(401).send('You are not authorized! :(');
            return;
        }
    } else {
        res.status(401).send('You are not authorized! :(');
        return;
    }
};
