require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//authentication
const session = require("express-session");
const flash = require('express-flash')
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const indexRouter = require('./routes/index');
const app = express();

//Set up mongoose connection
const mongoose = require('mongoose');
const DBkey = process.env.DB_URI
const mongoDB = process.env.MONGODB_URI || DBkey;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const User = require('./models/userModel');
const bcrypt = require('bcryptjs')
//passportjs functions
passport.use(
  //same usernames collide
  new LocalStrategy((username, password, done) => {
      User.findOne({username: username}, (err, user) => { //2nd argument mongoose findone is a callback function
          if(err) return done(err)

          if(!user){
              return done(null, false, {message: "Incorrect username"})
          }
          bcrypt.compare(password, user.password, (err, res) => {
              if(res){
                  //passwords match
                  return done(null, user)
              } else{
                  //passwords do not match
                  return done(null, false, {message: "Incorrect password"})
              }
          })
      })
  })
)

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//more passport middlewares
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(flash())
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

//ez van az index routerben visszadobni őket!
//hogyan tudom blokkolni az utat a menüpontokba nem loginoltaknka? redirect? (ha valaki raw-ban beírná url-be)
app.get('/log-in', (req, res) => {
  res.render('logIn', {user: res.locals.currentUser})
})

app.post('/log-in', passport.authenticate("local", {
    successRedirect:"/",
    failureRedirect:"/log-in",
    failureFlash: true
  })
)

app.get('/log-out',(req,res) => {
  req.logout();
  res.redirect("/")
})
//ez van az index routerben

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
 });

module.exports = app;
