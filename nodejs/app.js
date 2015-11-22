/**
 * Author: Yilun Fu
 */

var express = require('express');
var path = require('path');
var logger = require('morgan');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var LocalStrategy   = require('passport-local').Strategy;
var facebookStrategy = require('passport-local').Strategy;
var Bing = require('node-bing-api')({accKey:"qEJU0DWZxBhbw40arbtAyoSh1prT+/A0vEa8jTs4TJU"});
//var benchMark = require('benchmark');

var routes = require('./routes/index');
var sample = require('./routes/sampleRoute');
var work = require('./routes/workRoute');
var search = require('./routes/search');
var register = require('./routes/register');
var homepage = require('./routes/homepage');

var app = express();

console.log('Rindabase');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//set up passport 

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// Get response from pages and call functions
app.get('/sampleResponse', sample.displayResponse);
app.get('/getMovie', search.displayResponse);
app.get('/registerResponse', register.displayResponse);
app.get('/loginResponse', homepage.displayResponse);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
