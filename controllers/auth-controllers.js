const User = require('../models/userModel');
const Message = require('../models/messageModel');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs')
const passport = require("passport");

// const log_in_get = (req, res) => {
//     res.render('logIn', {user: res.locals.currentUser})
// }

// const log_in_post = passport.authenticate("local", {
//     successRedirect:"/",
//     failureRedirect:"/log-in",
//     failureFlash: true
// })

// const log_out = (req,res) => {
//     req.logout();
//     res.redirect("/")
// }

const sign_up_get = (req, res) => {
    res.render('signUp', {user: res.locals.currentUser})
}

const sign_up_post = (req, res, next) => {

    //VALIDATION!!!

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if(err) return next(err)
        else{
          const user = new User({
              username: req.body.username,
              password: hashedPassword,
              avatar: req.body.avatar
          }).save(err => {
              if(err) return next(err)
              res.redirect("/")
          })
        }
    })
}

module.exports = {
    // log_in_get,
    // log_in_post,
    // log_out,
    sign_up_get,
    sign_up_post,
}