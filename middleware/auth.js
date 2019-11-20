const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token')

    if (!token) {
        return res.status(401).json({
            msg: "token is not there"
        })
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtToken'));
        req.user = decoded.user;
    } catch (err) {
        res.status(401).json({
            msg: "token is not valid"
        })

    }
    next();
}