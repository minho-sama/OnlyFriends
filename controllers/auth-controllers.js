const User = require('../models/userModel');
const Message = require('../models/messageModel');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs')
const passport = require("passport"); 

const log_in_get = (req, res) => {
    res.render('logIn', {user: res.locals.currentUser})
}

const log_in_post = passport.authenticate("local", {
    successRedirect:"/",
    failureRedirect:"/log-in",
    failureFlash: true
})

const log_out = (req,res) => {
    req.logout();
    res.redirect("/")
}

const sign_up_get = (req, res) => {
    res.render('signUp', {user: res.locals.currentUser, errors:[], success:[]})
}

const sign_up_post = [
    body('username').trim().isLength({min:1}).escape().withMessage('username must be at least 1 character'),
    body('password').trim().isLength({min:1}).escape().withMessage('password must be at least 1 character'),

    async (req,res,next) => {
        const takenUsername = await User.find({username: req.body.username})
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.render('signUp', {errors: errors.array(), success:[], user:res.locals.currentUser})
        } 
        else if(takenUsername.length > 0){
            res.render('signUp', {errors:[{msg: 'username already taken'}], success: [], user:res.locals.currentUser})
        } else{
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if(err) return next(err)
                else{
                  const user = new User({
                      username: req.body.username,
                      password: hashedPassword,
                      avatar: req.body.avatar
                  }).save(err => {
                      if(err) return next(err)
                      res.render('signUp', {errors: [], success:[{msg: "You signed up successfully, please log in"}], user: res.locals.currentUser})
                  })
                }
            })
        }
    }
]

module.exports = {
    log_in_get,
    log_in_post,
    log_out,
    sign_up_get,
    sign_up_post,
}