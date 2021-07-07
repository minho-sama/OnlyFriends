const express = require('express');
const router = express.Router();

const auth_controller = require('../controllers/auth-controllers')
const message_controller = require('../controllers/message-controllers')

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log('user :' + res.locals.user)
  res.render('index',{user: res.locals.currentUser});
});

router.get('/create-message', (req, res) => {
  res.render('create-message-form', {user: res.locals.currentUser})
})

router.get('/become-member', (req, res) => {
  res.render('member',{user: res.locals.currentUser})
})

router.get('/become-admin', (req, res) => {
  res.render('admin', {user: res.locals.currentUser})
})


//AUTH
// router.get('/log-in', auth_controller.log_in_get)

// router.post('/log-in', auth_controller.log_in_post)

// router.get('/log-out', auth_controller.log_out)

router.get('/sign-up', auth_controller.sign_up_get)

router.post('/sign-up', auth_controller.sign_up_post)

module.exports = router;
