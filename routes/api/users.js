const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @route POST api/users/register
 * @desc Register user data
 * @access Public
 */
const User = require('../../models/User');
 router.post('/register', (req, res) => {
    User
        .findOne({email: req.body.email})
        .then((user) => {
            if(user){
                res.status(400).json({email: 'Email already exists'});
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
    const email = req.body.email;
    const password =  req.body.password;

    /** Find user by email */
    User
        .findOne({email: email})
        .then((user) => {
            if(!user){
                return res.status(404).json({email: 'User not found'})
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
                            return res.status(400).json({password: 'Password incorrect'});
                        }
                    })
            }
        })
 })


module.exports = router;