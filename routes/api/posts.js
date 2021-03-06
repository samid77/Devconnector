const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

/** Post model */
const Post = require('../../models/Posts');
/** Profile model */
const Profile = require('../../models/Profile');

/** Validation */
const validatiePostInput = require('../../validation/post');

/**
 * @route GET api/posts/test
 * @desc Testing posts routes
 * @access Public
 */
router.get('/test', (req, res) => {
    res.json({msg: 'Posts route success'})
})

/**
 * @route GET api/get
 * @desc Get post
 * @access Public
 */

 router.get('/', (req, res) => {
     Post
        .find()
        .sort({date: -1})
        .then((posts) => {
            res.json(posts);
        })
        .catch(err => res.status(404).json({error: 'No post found'}))
 })

 /**
 * @route GET api/get/:id
 * @desc Get post by id
 * @access Public
 */

router.get('/:id', (req, res) => {
    Post
       .findById(req.params.id)
       .then((post) => {
           res.json(post);
       })
       .catch(err => res.status(404).json({error: 'No post found with that id'}))
})

/**
 * @route POST api/posts
 * @desc Create post
 * @access Private
 */

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validatiePostInput(req.body);

    if(!isValid){
        return res.status(400).json(errors)
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then((post) => {res.json(post)})
});

/**
 * @route Delete api/post/:id
 * @desc Delete the post
 * @access Private
 */

 router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
     Profile
        .findOne({user: req.user.id})
        .then((profile) => {
            Post.findById(req.params.id).then((post) => {
                /** Check for post owner */
                if(post.user.toString() !== req.user.id){
                    return res.status(401).json({notAuthorized: 'User not authorized'})
                } else {
                    post
                        .remove()
                        .then(() => {
                            res.json({success: true})
                        })
                        .catch((err) => res.status(404).json({Error: 'Post not found'}))
                }
            })
        })
 })




module.exports = router;