const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile')
const {
    check,
    validationResult
} = require('express-validator');



// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);
        console.log(user, "/me")
        if (!profile) {
            res.status(400).json({
                error: [{
                    msg: "Profile is not available"
                }]
            })
        }
        res.status(200).json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error")
    }
})


// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private

router.post('/', [
    auth,
    [
        check('status', 'Status is required')
        .not()
        .isEmpty(),
        check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });

        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (status) profileFields.status = status;
        if (bio) profileFields.bio = bio;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) profileFields.skills = skills.split(',').map(skills => skills.trim());

        //set social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        let profile = await profile.findOne({
            user: req.user.id
        });
        if (profile) {
            profile = await Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            });
        }

        profile = new Profile(profileFields);

        await Profile.save(profile);
        return res.json(profile);
    }
})
module.exports = router;