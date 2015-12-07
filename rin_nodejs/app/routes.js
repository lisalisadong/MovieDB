var express = require('express');
//var movie = require('./movie');
var router = express.Router();
var mysql = require('mysql');
var search = require('./search');
var url = require('url');
var MongoClient = require('mongodb').MongoClient;


//var moment = require('moment')

var connection = mysql.createConnection({
    host: 'rindatabase.c2kwkkeairnp.us-east-1.rds.amazonaws.com',
    user: 'hanabeast',
    password: 'fyl1990617',
    database: 'RinDataBase'
});

var getDay = function(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    return year + '-' + month + '-' + day;
}



function getRecommendationForUser(req, res, callback) {
    var today = getDay(new Date());
    var p = new Date();
    p.setMonth(p.getMonth() - 3);
    var past = getDay(p);
    var user = req.user.id;
    var results = [];
    var recentMovie = "SELECT * FROM movie INNER JOIN review ON review.movie_id = movie.id WHERE releaseDate > '"
     + past + "' AND releaseDate <= '" + today + "' AND movie.genre IN (SELECT genre FROM movie WHERE id IN (SELECT movie_id FROM marks WHERE user_id = '"
      + user + "')) ORDER BY releaseDate DESC;" 
    var comingMovie = "SELECT * FROM movie INNER JOIN review ON review.movie_id = movie.id WHERE releaseDate > '"
     + today + "' AND movie.genre IN (SELECT genre FROM movie WHERE id IN (SELECT movie_id FROM marks WHERE user_id = '"
      + user + "')) ORDER BY releaseDate DESC;"
    var ratedMovie = "SELECT * FROM movie INNER JOIN review ON review.movie_id = movie.id " +
                "WHERE review.star = 10 AND movie.genre IN (SELECT genre FROM movie WHERE id IN "+
                "(SELECT movie_id FROM marks WHERE user_id = '" + user + "')) " + "ORDER BY releaseDate DESC;";
    var queries = [];
    queries.push(recentMovie);
    queries.push(comingMovie);
    queries.push(ratedMovie);

    var results = [];
    for (var i = 0; i < queries.length; i++) {
        console.log(queries[i]);
        connection.query(queries[i], function(err, rows) {
            if (!err) {
                var result = [];
                if (rows != null) {
                    for (var i = 0; i < rows.length; i++) {
                        result.push(rows[i]);
                    }
                    results.push(result);
                    if (results.length == queries.length) {
                        callback(results);
                    }
                }
            } else {
                console.log('Error while performing Query.');
            }
        });
    }
    
};

var query_count = 0;

var getRecommendation = function(callback){
    var today = getDay(new Date());
    var p = new Date();
    p.setMonth(p.getMonth() - 3);
    var past = getDay(p);
    var recentMovie = "SELECT * FROM movie WHERE releaseDate > '" + past + "' AND releaseDate <= '" + today +"' ORDER BY releaseDate DESC;";
    var comingMovie = "SELECT * FROM movie WHERE releaseDate > '" + today +"';";
    var ratedMovie = "SELECT * FROM movie INNER JOIN review ON review.movie_id = movie.id WHERE review.star = 10 ORDER BY releaseDate DESC;";
    var queries = [];
    queries.push(recentMovie);
    queries.push(comingMovie);
    queries.push(ratedMovie);

    var results = [];
    for (var i = 0; i < queries.length; i++) {
        // console.log(queries[i]);
        connection.query(queries[i], function(err, rows) {
            if (!err) {
                var result = [];
                if (rows != null) {
                    for (var i = 0; i < rows.length; i++) {
                        result.push(rows[i]);
                    }
                    results.push(result);
                    if (results.length == queries.length) {
                        callback(results);
                    }
                }
            } else {
                console.log('Error while performing Query.');
            }
        });
    }
}

var generateMovieReponse = function(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters, myRating, myMark, comments) {
    var movie = {
        id: movieInfo[0].id,
        name: movieInfo[0].name,
        duration: movieInfo[0].duration,
        releaseDate: movieInfo[0].releaseDate,
        poster: movieInfo[0].poster,
        overview: movieInfo[0].overview,
        genre: movieInfo[0].genre,
        actors: actorsInfo,
        director: directorsInfo[0],
        rating: rating,
        raters: raters,
        my_rating:myRating,
        comments:{}

    };
    console.log(movie);
    res.render('movie.ejs', {user:req.user, movie:movie});
}
var getComments = function(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters, myRating, myMark) {
    var id = req.movie_id;
    
    generateMovieReponse(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters, myRating, myMark, comments)
}

var getMyMark = function(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters, myRating) {
    var id = req.movie_id;
    var user = req.user.id;
    var query = "SELECT status FROM marks WHERE user_id = '"+user+"' AND movie_id = '"+
    id+"';";
    console.log(query);
    connection.query(query, function(err, myMark) {
        if (err) {
            console.log('err when getMyMark');
        } else {
            getComments(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters, myRating, myMark);
        }
    });
}

var getMyRating = function(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters) {
    var id = req.movie_id;
    var user = req.user.id;
    var query = "SELECT star, comment FROM review WHERE movie_id = '" + id + "' AND user_id = '"
    + user + "';";
    console.log(query);
    console.log(raters);
    connection.query(query, function(err, myRating) {
        if (err) {
            console.log('err when getMyRating');
        } else {
            getMyMark(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters, myRating);
        }
    });
};

var getRatingAndRator = function(req, res, movieInfo, actorsInfo, directorsInfo) {
    var id = req.movie_id;
    var query = "SELECT AVG(star) AS rating, COUNT(star) AS raters FROM review GROUP BY movie_id HAVING "+
    "movie_id = '" + id + "';";
    console.log(query);
    connection.query(query, function(err, ratingAndRator) {
        if (err) {
            console.log('err when getRatingAndRator');
        } else {
            rating = ratingAndRator[0].rating;
            raters = ratingAndRator[0].raters;
            console.log(rating);
            console.log(raters);
            getMyRating(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters);
        }
    });
};


var getMovieDirectors = function(req, res, movieInfo, actorsInfo) {
    var id = req.movie_id;
    var query = "SELECT director.id, director.name FROM director WHERE director.id IN (SELECT "+
        "director_id FROM directs WHERE movie_id = '"+ id + "');";
    console.log(query);
    connection.query(query, function(err, directorsInfo) {
        if (err) {
            console.log('err when getMovieDirectors');
        } else {
            getRatingAndRator(req, res, movieInfo, actorsInfo, directorsInfo);
        }
    });
}

var getMovieActors = function(req, res, movieInfo) {
    var id = req.movie_id;
    var query = "SELECT actor.id, actor.name FROM actor WHERE actor.id IN (SELECT "+
        "actor_id FROM plays WHERE movie_id = '"+ id + "');";
    console.log(query);
    connection.query(query, function(err, actorsInfo) {
        if (err) {
            console.log('err when getMovieActors');
        } else {
            getMovieDirectors(req, res, movieInfo, actorsInfo);
        }
    });
};

var getMovieInfo = function(req, res) {
    var id = req.movie_id;
    console.log(id);
    var query = "SELECT * FROM movie WHERE id = '" + id + "';";
    console.log(query);
    connection.query(query, function(err, movieInfo) {
        if(err) {
            console.log('err when getMovieInfo');
        } else {
            getMovieActors(req, res, movieInfo);
        }
    });
};



module.exports = function(app, passport) {

// normal routes ===============================================================

    // home page
    app.get('/', function(req, res) {
        if (!req.user) {
            getRecommendation(function(results) {
            res.render('homepage', {user:req.user, invalid:null, results:results});
            });
        } else {
            getRecommendationForUser(req, res, function(results) {
            res.render('homepage', {user:req.user, invalid:null, results:results});
            });
        }
        
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
        getMovieInfo(req, res);
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
