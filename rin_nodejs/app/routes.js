var express = require('express');
var movie = require('./movie');
var router = express.Router();
var mysql = require('mysql');
var search = require('./search');
var person = require('./person');
var url = require('url');
var MongoClient = require('mongodb').MongoClient;
var homepage = require('./homepage');



//var moment = require('moment')

var connection = mysql.createConnection({
    host: 'rindatabase.c2kwkkeairnp.us-east-1.rds.amazonaws.com',
    user: 'hanabeast',
    password: 'fyl1990617',
    database: 'RinDataBase'
});


module.exports = function(app, passport) {

// normal routes ===============================================================

    // home page
    app.get('/', function(req, res) {
        homepage.getRecommendation(req, res);
        // if (!req.user) {
        //     homepage.getRecommendation(function(results) {
        //     res.render('homepage', {user:req.user, invalid:null, results:results});
        //     });
        // } else {
        //     homepage.getRecommendationForUser(req, res, function(results) {
        //     res.render('homepage', {user:req.user, invalid:null, results:results});
        //     });
        // }
        
    });

    // search page
    app.get('/search', function(req, res, next) {
        res.render('search', {user:req.user, results: null, option:1});
    });

    app.get('/search/getMovie', search.displayResponse);

    // show the login page (will also have our login links)
    app.get('/signin', function(req, res) {
        res.render('index.ejs');
    });

    // movie page
    app.get('/movie', function(req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        req.movie_id = query.id;
        //TODO: do something here with query.id to fetch movie detail
        // var movie = {   id:27205, 
        //                 name:'Inception', 
        //                 duration:148, 
        //                 releaseDate:'2010-07-16',
        //                 poster: 'http://image.tmdb.org/t/p/original/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
        //                 overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person\'s idea into a target\'s subconscious.',
        //                 genre: 'Action | Thriller | Science Fiction | Mystery | Adventure',
        //                 actors: [   {id:6193, name:'Leonardo DiCaprio'},
        //                             {id:24045, name:'Joseph Gordon-Levitt'},
        //                             {id:27578, name:'Ellen Page'},
        //                             {id:2524, name:'Tom Hardy'},
        //                             {id:3899, name:'Ken Watanabe'}],
        //                 director: {id:525, name:'Christopher Nolan'},
        //                 rating: 9.2,
        //                 rater: 10,
        //                 my_rating: {status: true, star: 3, comments: "I like it!"},
        //                 comments: [  {id:123, name: 'qingxiao', rating: 4, comments: "Awesome!", time: '2015-12-01 12:00:00', agrees: 10, agreed: false},
        //                             {id:234, name: 'yilun', rating: 5, comments: 'Amazing!', time: '2015-12-02 13:12:32', agrees: 14, agreed: true}]
        //             }
        //console.log(movie);
        //res.render('movie.ejs', {user:req.user, movie:movie});
        movie.getMovieInfoResponse(req, res);
    });
    
    // person page
    app.get('/person', function(req, res, next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        //TODO: do something here with query.id to fetch movie detail
        req.person_id = query.id;
        person.getPersonInfoResponse(req, res);
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        console.log(query);
        //TODO: do something with query.id to fetch profile owner data
        res.render('profile.ejs', {
            user : req.user, profile_owner : null
        });
    });

    app.get('/account', isLoggedIn, function(req, res) {
        res.render('account.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.local.username = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
