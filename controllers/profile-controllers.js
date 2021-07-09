const Message = require('../models/messageModel');
const User = require('../models/userModel');

const profile_page_get = async (req, res, next) => {
    try{
        const userMessages = await Message.find({user: req.user._id}).sort({'post_date': 'descending'})
        console.log(userMessages)
        res.render('profile_page', {user: res.locals.currentUser, user_messages: userMessages})
    } catch(err){
        return next(err)
    }
}

const profile_page_update = (req, res, next) => {
    if(req.body.avatar === undefined){
        req.body.avatar = req.user.avatar
    }
    User.findByIdAndUpdate(req.user._id,{$set:{"avatar": req.body.avatar}}, {}, function(err, result){
        if(err) return next(err)
        res.redirect(`/user/${req.user._id}`)
    }) 
}

const admin_board_get = async (req, res, next) => {
    Promise.all([
        await User.find(),
        await Message.find()
    ]).then((data) => {
        res.render('admin-board', {user: res.locals.currentUser, allUsers: data[0], allMessages: data[1]})
    })
}

module.exports = {
    profile_page_get,
    profile_page_update,
    admin_board_get
}