const Message = require('../models/messageModel');

const profile_page_get = async (req, res, next) => {
    try{
        const userMessages = await Message.find({user: req.user._id})
        console.log(userMessages)
        res.render('profile_page', {user: res.locals.currentUser, user_messages: userMessages})
    } catch(err){
        return next(err)
    }
}

module.exports = {
    profile_page_get
}