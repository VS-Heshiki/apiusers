class AuthController {
    async validate(req, res) {
        res.send('ok!');
    }
}

module.exports = new AuthController();