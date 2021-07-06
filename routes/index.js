var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/create-message', (req, res) => {
  res.render('create-message-form')
})

router.get('/become-member', (req, res) => {
  res.render('member')
})

router.get('/become-admin', (req, res) => {
  res.render('admin')
})

module.exports = router;
