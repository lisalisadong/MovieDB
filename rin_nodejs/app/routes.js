var express = require('express');
var movie = require('./movie');
var router = express.Router();
var mysql = require('mysql');
var search = require('./search');
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
        var person = {  id:27578, 
                        name:'Ellen Page', 
                        dob:'1987-02-21', 
                        picture: 'http://image.tmdb.org/t/p/original/vDunkYxyQPkzx9EwkfSZVCSzBlO.jpg',
                        bio: 'Ellen Philpotts-Page (born February 21, 1987, height 5\'\' 1" (1,55 m)), known professionally as Ellen Page, is a Canadian actress. Page received both Golden Globe and Academy Award nominations for Best Actress for her role as the title character in the film Juno. In 2008, Page was nominated for Time\'\'s 100 Most Influential People list and placed #86 on FHM\'\'s Sexiest Women in the World list, and moved up to #70 for 2010. In June 2008, Page was named on Entertainment Weekly\'\'s future A-List stars list. Page resides in her hometown of Halifax, Nova Scotia and has two dogs named Julie and Sprout. She is prone to walk and talk in her sleep. In 2008, Page was one of 30 celebrities who participated in an online ad series for U.S. Campaign for Burma, calling for an end to the military dictatorship in Burma. She describes herself as a pro-choice feminist. In the fall of 2008 Page spent a month living in an eco-village, studying permaculture at the Lost Valley Educational Center outside Eugene, Oregon.',
                        recent_movies: [   {id:87499, name:'The East', releaseDate:'2013-05-31', poster:'http://image.tmdb.org/t/p/original/n6n0rMFsQhdNoMygr2pyL26wUfM.jpg'},
                                    {id:154282, name:'Touchy Feely', releaseDate:'2013-01-19', poster:'http://image.tmdb.org/t/p/original/krKqoeVUjFf6Y86zO4PSQ2toK5a.jpg'},
                                    {id:81836, name:'To Rome with Love', releaseDate:'2012-07-04', poster:'http://image.tmdb.org/t/p/original/zGVAVQufbwE5BjU17OBkXM9PWRS.jpg'},
                                    {id:45132, name:'Super', releaseDate:'2011-03-31', poster:'http://image.tmdb.org/t/p/original/wRYZdWGCcC7ttY7MFNbIKpR3pnn.jpg'},
                                    {id:27205, name:'Inception', releaseDate:'2010-07-16', poster:'http://image.tmdb.org/t/p/original/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg'}],
                        top_movies: [   {id:87499, name:'The East', releaseDate:'2013-05-31', poster:'http://image.tmdb.org/t/p/original/n6n0rMFsQhdNoMygr2pyL26wUfM.jpg'},
                                    {id:154282, name:'Touchy Feely', releaseDate:'2013-01-19', poster:'http://image.tmdb.org/t/p/original/krKqoeVUjFf6Y86zO4PSQ2toK5a.jpg'},
                                    {id:81836, name:'To Rome with Love', releaseDate:'2012-07-04', poster:'http://image.tmdb.org/t/p/original/zGVAVQufbwE5BjU17OBkXM9PWRS.jpg'},
                                    {id:45132, name:'Super', releaseDate:'2011-03-31', poster:'http://image.tmdb.org/t/p/original/wRYZdWGCcC7ttY7MFNbIKpR3pnn.jpg'},
                                    {id:27205, name:'Inception', releaseDate:'2010-07-16', poster:'http://image.tmdb.org/t/p/original/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg'}]
                    }
        console.log(person);
        res.render('person.ejs', {user:req.user, person:person});
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
