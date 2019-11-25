const express = require('express');
const router = express.Router();
const User = require('../../models/User')
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const {
    check,
    validationResult
} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', [
    check('userName', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include valid email')
        .isEmail(),
    check('password', 'Please enter the password min 6 or more')
        .isLength({
            min: 6
        })

],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                json: error.array()
            });
        }
        const {
            userName,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                res.status(400).json({
                    error: [{
                        msg: "user already exits"
                    }]
                })
            }
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                userName,
                email,
                password,
                avatar
            })
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save()
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