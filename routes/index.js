const express = require('express');
const router = express.Router();

const auth_controller = require('../controllers/auth-controllers')
const message_controller = require('../controllers/message-controllers')

//middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.user) {
      next();
  } else {
      res.redirect('/log-in');
  }
}

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log('user :' + res.locals.currentUser)
  res.render('index',{user: res.locals.currentUser});
});

router.get('/create-message', isLoggedIn, (req, res) => {
  res.render('create-message-form', {user: res.locals.currentUser})
})

router.get('/become-member', isLoggedIn, (req, res) => {
  res.render('member',{user: res.locals.currentUser})
})

router.get('/become-admin', isLoggedIn, (req, res) => {
  res.render('admin', {user: res.locals.currentUser})
})


//AUTH
router.get('/log-in', auth_controller.log_in_get)

router.post('/log-in', auth_controller.log_in_post)

router.get('/log-out', auth_controller.log_out)

router.get('/sign-up', auth_controller.sign_up_get)

router.post('/sign-up', auth_controller.sign_up_post)

module.exports = router;
