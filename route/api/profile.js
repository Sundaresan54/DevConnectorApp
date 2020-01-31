const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile')
const {
    check,
    validationResult
} = require('express-validator');
const User = require('../../models/User');
const config = require('config');
const request = require('request');



// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
    console.log(req.user.id, "000000000")
    try {
        console.log("-------->>>>>>>")
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            res.status(400).json({
                error: [{
                    msg: "Profile is not available"
                }]
            })
        }
        res.status(200).json(profile)
    } catch (err) {
        console.log("<<<<<<<<-----------")
        console.error(err.message);
        res.status(500).send("server error at me")
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
    }
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

    let profile = await Profile.findOne({
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

    await profile.save(profile);
    return res.json(profile);

})

// @route    GET api/profile
// @desc     Get all users profile
// @access   public

router.get('/', async (req, res) => {
    try {
        console.log("-------->>>>>>>")
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);

        if (!profiles) {
            res.status(400).json({
                error: [{
                    msg: "Profiles are not available"
                }]
            })
        }
        res.status(200).json(profiles)
    } catch (err) {
        console.log("<<<<<<<<-----------")
        console.error(err.message);
        res.status(500).send("server error at me")
    }
})

// @route    GET api/profile/user/:user_id
// @desc     Get all cureent profile with userId
// @access   public

router.get('/user/:user_id', async (req, res) => {
    try {
        console.log("-------->>>>>>>")
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({
                error: [{
                    msg: "Profile is not available fot this user"
                }]
            })
        }
        res.status(200).json(profile)

    } catch (err) {
        console.log("<<<<<<<<-----------")
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                error: [{
                    msg: "Profile is not found fot this user"
                }]
            })
        }
        res.status(500).send("server error at me")
    }
})

// @route    DELET api/profile/
// @desc     delete profile, user and post
// @access   private


router.delete('/', auth, async (req, res) => {
    try {
        console.log("-------->>>>>>>")
        await Profile.findOneAndRemove({
            user: req.user.id
        })

        await User.findOneAndRemove({
            _id: req.user.id
        })
        res.json({
            msg: "profile removed"
        })

    } catch (err) {
        console.log("<<<<<<<<-----------")
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                error: [{
                    msg: "Profile is not found fot this user"
                }]
            })
        }
        res.status(500).send("server error at me")
    }
})



// @route    PUT api/profile/experience
// @desc     update profile with exp
// @access   private

router.put('/experience', [auth,
    [
        check('title', "title required")
            .not()
            .isEmpty(),
        check('company', "company required")
            .not()
            .isEmpty(),
        check('from', "from date required")
            .not()
            .isEmpty(),

    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: error.array()
        })
    }

    const {
        title,
        location,
        company,
        from,
        to,
        current,
        description
    } = req.body;
    console.log(req.body, "expppppppp")
    const newExp = {
        title,
        location,
        company,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });
        console.log(profile, "proooooo")
        profile.experience.unshift(newExp);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.log("<<<<<<<<-----------")
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                error: [{
                    msg: "experience is not able to add to user"
                }]
            })
        }
        res.status(500).send("server error at me")

    }
})


// @route    DELETE api/profile/experience
// @desc     delete  exp from profile
// @access   private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        console.log("------>>>kg")
        const profile = await Profile.findOne({
            user: req.user.id
        });

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile)
    } catch (err) {
        console.log("<<<<<<<<-----------")
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                error: [{
                    msg: "experience is not deleted for the user"
                }]
            })
        }
        res.status(500).send("server error at me")
    }
})


// @route    PUT api/profile/education
// @desc     update profile with education
// @access   private

router.put('/education', [auth,
    [
        check('school', "school required")
            .not()
            .isEmpty(),
        check('degree', "degree required")
            .not()
            .isEmpty(),
        check('fieldOfStudy', "fieldOfStudy required")
            .not()
            .isEmpty(),

    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: error.array()
        })
    }

    const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    } = req.body;
    console.log(req.body, "eduuuu")
    const newEdu = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });
        console.log(profile, "proooooo")
        profile.education.unshift(newEdu);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.log("<<<<<<<<-----------")
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                error: [{
                    msg: "experience is not able to add to user"
                }]
            })
        }
        res.status(500).send("server error at me")

    }
})


// @route    DELETE api/profile/education
// @desc     delete  education from profile
// @access   private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        console.log("------>>>kg")
        const profile = await Profile.findOne({
            user: req.user.id
        });

        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile)
    } catch (err) {
        console.log("<<<<<<<<-----------")
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                error: [{
                    msg: "experience is not deleted for the user"
                }]
            })
        }
        res.status(500).send("server error at me")
    }
})

// @route    GET api/profile/github/:user
// @desc     get the github repo of the user
// @access   public

router.get('/github/:username', (req, res) => {
    try {
        const option = {
            url: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {
                'user-agent': 'nodejs'
            }
        }

        request(option, (error, response, body) => {
            if (error) {
                console.error(error);
            }
            if (response.statusCode !== 200) {
                res.status(400).json({
                    msg: "github profile not found"
                });
            }

            res.json(JSON.parse(body));
        })
    } catch (err) {
        console.log("<<<<<<<<-----------")
        console.error(err.message);
        res.status(500).send("server error at me")
    }
})
module.exports = router;