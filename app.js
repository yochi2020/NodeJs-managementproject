var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var session =require('express-session')
var mongo =require("mongodb")
var mongoose = require("mongoose")
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/user')



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: 'my_super_secret',
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));






//check user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/')
  }
}
app.get('*',function(req,res,next){
  res.locals.user = req.user || null;
  next();
});
app.use('/', indexRouter);
app.use('/admin',isLoggedIn, adminRouter);
app.use('/user',userRouter)



module.exports = app;
