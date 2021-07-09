const User = require('../models/userModel');
const Message = require('../models/messageModel');
const {body, validationResult} = require('express-validator');

const create_message_get = (req, res) => {
    res.render('create-message-form', {user:res.locals.currentUser, errors: []})
}  

const create_message_post = [
    body('title').trim().isLength({min:1}).withMessage('message must have a title'),
    body('message').trim().isLength({min:1}).withMessage('message must have at least 1 character'),

    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.render('create-message-form', {errors: errors.array(), user:res.locals.currentUser})
        }
        const message = new Message({
            user: req.user._id,
            title:req.body.title,
            message:req.body.message
        }).save(function(err){
            if(err) return next(err)
            res.redirect('/')
        })
    }
] 
  
const delete_message_get_admin = (req, res) => {
    Message.findById(req.params.id)
           .populate('user')
           .then(result=> {
               console.log(result)
               res.render('delete-msg-admin', {user: res.locals.currentUser, message:result, errMsg: []})
           })
}

const delete_message_get = (req, res) => {
    Message.findById(req.params.id)
           .populate('user')
           .then(result=> {
               console.log(result)
               res.render('delete-msg', {user: res.locals.currentUser, message:result, errMsg: []})
           })
}

const delete_message_post = (req, res) => {
    if(req.body.password !== process.env.DELETE_PSW){
        Message.findById(req.params.id)
        .populate('user')
        .then(result=> {
            console.log(result)
            res.render('delete-msg-admin', {user: res.locals.currentUser, message:result, errMsg: [{msg:'Incorrect password'}]})
        })
    } else{
        Message.findByIdAndDelete(req.params.id)
            .then(() =>res.redirect('/'))
    }
}

const member_get = (req, res) => {
    res.render('member',{user: res.locals.currentUser, errMessages: []})
}

const member_post = (req, res, next) => {

    if(req.body.password !== process.env.MEMBER_PSW){
        res.render('member', {errMessages: ['wrong password'], user: res.locals.currentUser})
    } else{
        User.findByIdAndUpdate(req.user._id,{$set:{"member": true}}, {}, function(err, result){
            if(err) return next(err)
            res.redirect('/')
        }) 
    }
}

const admin_get = (req, res) => {
    res.render('admin', {user: res.locals.currentUser, errMessages: []})
}

const admin_post = (req, res, next) => {
    if(req.body.password !== process.env.ADMIN_PSW){
        res.render('admin', {errMessages: ['wrong password'], user: res.locals.currentUser})
    } else{
        User.findByIdAndUpdate(req.user._id,{$set:{"admin": true}}, {}, function(err, result){
            if(err) return next(err)
            res.redirect('/admin-board')
        }) 
    }
}

module.exports = {
    create_message_get,
    create_message_post,
    delete_message_get_admin,
    delete_message_get,
    delete_message_post,
    member_get,
    member_post,
    admin_get,
    admin_post
}