const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth')
const {
    check,
    validationResult
} = require('express-validator');


// @route    POST api/posts
// @desc     Create post
// @access   Private

router.post('/', [auth, [
    check('text', "text is required")
    .not()
    .isEmpty()
]], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }


        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.log("<<<<<<<<-----------")
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                error: [{
                    msg: "object is not getting for the user"
                }]
            })
        }
        res.status(500).send("server error at me")
    }
})

// @route    GET api/posts
// @desc     get all posts 
// @access   Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({
            date: -1
        })
        res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error at me")
    }
})

// @route    GET api/post
// @desc     get post of id
// @access   Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.json(post)
    } catch (err) {
        console.log("<<<<<<<<-----------")
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                error: [{
                    msg: "post is not available"
                }]
            })
        }
        res.status(500).send("server error at me")
    }

})

// @route    DELETE api/post
// @desc     delete post with id
// @access   Private

router.delete('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)
        console.log(post, "posssss")
        if (!post) {
            return res.status(401).json({
                error: [{
                    msg: "post not found"
                }]
            })
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
                error: [{
                    msg: "user not athorized"
                }]
            })
        }
        await post.remove();
        res.json({
            msg: 'post removed',
        })
    } catch (err) {
        console.log("<<<<<<<<-----------")
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                error: [{
                    msg: "post not found"
                }]
            })
        }
        res.status(500).send("server error at me")
    }

})


// @route    GET api/posts/like/:id
// @desc     get post of id
// @access   Private

router.put('/like/:like_id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.like_id)
        if (post.likes.filter(like => {
                console.log(((like.user.toString() === req.user.id)), "ihuefb------")
                like.user.toString() === req.user.id
            })) {
            console.log("guyefcyueygjc")
            return res.status(400).send("user already liked")
        }
        post.likes.unshift({
            user: req.user.id
        });
        await post.save();

        res.json(post.likes)

    } catch (err) {
        console.log("<<<<<<<<-----------")
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                error: [{
                    msg: "post is not available"
                }]
            })
        }
        res.status(500).send("server error at me")
    }

})


module.exports = router;