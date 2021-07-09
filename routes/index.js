const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');

const auth_controller = require('../controllers/auth-controllers')
const message_controller = require('../controllers/message-controllers')
const profile_controller = require('../controllers/profile-controllers')

//middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.user) {
      next();
  } else {
      res.redirect('/log-in');
  }
}

//middleware for message-delete authentication
function isAuthorizedToDeleteMsg(req, res, next) {
  Message.findOne({_id: req.params.id})
    .populate('user')
    .then((messageOwner) => {
      const isOwnerOfMessage = JSON.stringify(messageOwner.user._id) === JSON.stringify(req.user._id)
      if(req.user.admin || isOwnerOfMessage){
        next()
      } else{
        console.log('not authorized')
        res.redirect('/')
      }
    })
    .catch(err => next(err))
}

//check if user is admin
function isAdmin(req, res, next){
  if(req.user.admin){
    next()
  } else{
    res.redirect('/')
  }
}

/* GET home page. */
router.get('/', async (req, res) => {
  try{
   const allMessages = await Message
      .find()
      .sort([['post_date', 'descending']])
      .populate('user')
   console.log('user :' + res.locals.currentUser)
   
   res.render('index',{user: res.locals.currentUser, messages: allMessages});
  } catch(err){
    return next (err) 
  }
});
 

//navbar routes
router.get('/create-message', isLoggedIn, message_controller.create_message_get)

router.post('/create-message', message_controller.create_message_post)

router.get('/delete-message/admin/:id', isLoggedIn, isAuthorizedToDeleteMsg, message_controller.delete_message_get_admin)

router.get('/delete-message/:id', isLoggedIn, isAuthorizedToDeleteMsg, message_controller.delete_message_get)

router.post('/delete-message/:id',isLoggedIn, isAuthorizedToDeleteMsg,  message_controller.delete_message_post)

router.get('/become-member', isLoggedIn, message_controller.member_get)

router.post('/become-member', isLoggedIn, message_controller.member_post)

router.get('/become-admin', isLoggedIn, message_controller.admin_get)

router.post('/become-admin', message_controller.admin_post)

//profile-page routes
router.get('/user/:id', isLoggedIn, profile_controller.profile_page_get)

router.post('/update-user/:id', isLoggedIn, profile_controller.profile_page_update)

//ADMIN board (no need to make other routes for delete)
router.get('/admin-board', isLoggedIn, isAdmin, profile_controller.admin_board_get)

//AUTH ROUTES
router.get('/log-in', auth_controller.log_in_get)

router.post('/log-in', auth_controller.log_in_post)

router.get('/log-out', auth_controller.log_out)

router.get('/sign-up', auth_controller.sign_up_get)

router.post('/sign-up', auth_controller.sign_up_post)

module.exports = router;
