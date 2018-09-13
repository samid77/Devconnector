const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');

/** Load input validation */
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

/**
 * @route POST api/users/register
 * @desc Register user data
 * @access Public
 */
const User = require('../../models/User');
 router.post('/register', (req, res) => {

    /** First thing first, validation check */
    const { errors, isValid} = validateRegisterInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    User
        .findOne({email: req.body.email})
        .then((user) => {
            if(user){
                errors.email = 'Email already exists';
                res.status(400).json(errors);
                // res.status(400).json({email: 'Email already exists'});
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s:'200', 
                    r: 'pg', 
                    d: 'mm'
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err){
                            throw err
                        } else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then((user) => {
                                    res.json({user});
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                        }
                    })
                })
            }
        })
 })

 /**
 * @route POST api/users/login
 * @desc Login User / Returning JWT Token
 * @access Public
 */

 router.post('/login', (req, res) => {

    /** First thing first, validation check */
    const { errors, isValid} = validateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password =  req.body.password;

    /** Find user by email */
    User
        .findOne({email: email})
        .then((user) => {
            if(!user){
                errors.email = 'User not found'
                return res.status(404).json(errors)
                // return res.status(404).json({email: 'User not found'})
            } else {
                /** Check the password */
                bcrypt
                    .compare(password, user.password)
                    .then((isMatch) => {
                        if(isMatch){

                            const keys = require('../../config/keys');

                            /** Payload for JWT */
                            const payload = {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                avatar: user.avatar
                            }

                            /** Sign the token! */
                            jwt.sign(
                                payload, 
                                keys.secretOrKey, 
                                {expiresIn: 3600}, 
                                (err, token) => {
                                    res.json({success: true, token: 'Bearer ' + token})
                                }
                            )

                        } else {
                            errors.password = 'Password incorrect';
                            return res.status(400).json(errors);
                            // return res.status(400).json({password: 'Password incorrect'});
                        }
                    })
            }
        })
 })

 /**
 * @route GET api/users/current
 * @desc  Return current user
 * @access Private
 */

 router.get('/current', passport.authenticate('jwt', {session:false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
    });
 })


module.exports = router;