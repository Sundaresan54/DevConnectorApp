const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const bcrypt = require('bcryptjs');
const {
    check,
    validationResult
} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

router.get('/', auth, async (req, res) => {
    // res.send("dummy router");
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
        console.log(user, "password")
    } catch (err) {
        console.error(res.status(500).send('server error'))
    }
})
router.post('/', [
    check('email', 'Please include valid email')
        .isEmail(),
    check('password', 'please enter valid password')
        .exists()
],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                json: error.array()
            });
        }
        const {
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (!user) {
                res.status(400).json({
                    error: [{
                        msg: "invalid credentials"
                    }]
                })

            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                res.status(400).json({
                    error: [{
                        msg: "invalid credentials"
                    }]
                })
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtToken'), {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token: token
                    });
                }

            )
        } catch (err) {
            console.error(err.message)
            res.status(500).send("server error")
        }


    })
module.exports = router;