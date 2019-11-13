const express = require('express');
const router = express.Router();
const User = require('../../models/User')
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const {
    check,
    validationResult
} = require('express-validator');

router.post('/', [
        check('name', 'Name is required')
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
            name,
            email,
            password
        } = req.body;
        try {
            let user = User.findOne({
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
                name,
                email,
                password,
                avatar
            })
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save()
            res.send("duser registered");

        } catch (err) {
            console.error(err.message)
            res.status(500).send("server error")
        }


    })

module.exports = router;