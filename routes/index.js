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

router.get('/become-member', isLoggedIn, message_controller.member_get)

router.post('/become-member', isLoggedIn, message_controller.member_post)

router.get('/become-admin', isLoggedIn, message_controller.admin_get)

router.post('/become-admin', message_controller.admin_post)

//profile-page routes
router.get('/user/:id', isLoggedIn, profile_controller.profile_page_get)

//AUTH ROUTES
router.get('/log-in', auth_controller.log_in_get)

router.post('/log-in', auth_controller.log_in_post)

router.get('/log-out', auth_controller.log_out)

router.get('/sign-up', auth_controller.sign_up_get)

router.post('/sign-up', auth_controller.sign_up_post)

module.exports = router;
