var express = require('express');
var homepage = require('./homepage');
var router = express.Router();
var mysql = require('mysql');
var search = require('./search');
var url = require('url');
var MongoClient = require('mongodb').MongoClient;
//var User = require('../app/models/user');
var ObjectId = require('mongoose').Types.ObjectId;

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
    p.setMonth(p.getMonth() - 12);
    var past = getDay(p);
    var user = req.user.id;
    var results = [];
    // var recentMovie = "SELECT * FROM movie INNER JOIN review ON review.movie_id = movie.id WHERE releaseDate > '"
    //  + past + "' AND releaseDate <= '" + today + "' AND movie.genre IN (SELECT genre FROM movie WHERE id IN (SELECT movie_id FROM marks WHERE user_id = '"
    //   + user + "')) ORDER BY releaseDate DESC LIMIT 10;" 
    // var comingMovie = "SELECT * FROM movie INNER JOIN review ON review.movie_id = movie.id WHERE releaseDate > '"
    //  + today + "' AND movie.genre IN (SELECT genre FROM movie WHERE id IN (SELECT movie_id FROM marks WHERE user_id = '"
    //   + user + "')) ORDER BY releaseDate DESC LIMIT 10;"
    // var ratedMovie = "SELECT * FROM movie INNER JOIN review ON review.movie_id = movie.id " +
    //             "WHERE review.star = 10 AND movie.genre IN (SELECT genre FROM movie WHERE id IN "+
    //             "(SELECT movie_id FROM marks WHERE user_id = '" + user + "')) " + "ORDER BY releaseDate DESC LIMIT 10;";
    var recentMovie = "SELECT * FROM movie WHERE releaseDate > '" + past + "' AND releaseDate <= '" + today +"' ORDER BY releaseDate DESC LIMIT 10;";
    var comingMovie = "SELECT * FROM movie WHERE releaseDate > '" + today +"' LIMIT 10;";

    var ratedMovie = "SELECT * FROM movie INNER JOIN (SELECT AVG(star) AS rating, movie_id FROM review GROUP BY movie_id) AS review On "
    + "review.movie_id = movie.id WHERE review.rating > 8 ORDER BY releaseDate DESC LIMIT 10;";
    var recommendedMovie = "SELECT * FROM movie INNER JOIN (SELECT AVG(star) AS rating, movie_id FROM review GROUP BY movie_id) AS review ON "
    +"review.movie_id = movie.id WHERE movie.genre IN (SELECT genre FROM movie WHERE id " +  
    "IN (SELECT movie_id FROM marks WHERE user_id = '" + user + "')) ORDER BY review.rating DESC, releaseDate DESC LIMIT 10;" ;

    var ratedMovie = "SELECT * FROM movie INNER JOIN review ON review.movie_id = movie.id WHERE review.star = 10 ORDER BY releaseDate DESC LIMIT 10;";
    var recommendedMovie = "SELECT * FROM movie WHERE movie.genre IN (SELECT genre FROM movie WHERE id " +  
        "IN (SELECT movie_id FROM marks WHERE user_id = '" + user + "')) ORDER BY releaseDate DESC LIMIT 10;" ;

    var queries = [];
    //console.log(recommendedMovie);
    queries.push(recentMovie);
    queries.push(comingMovie);
    queries.push(ratedMovie);
    queries.push(recommendedMovie);
    console.log(ratedMovie);

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
    p.setMonth(p.getMonth() - 12);
    var past = getDay(p);
    var recentMovie = "SELECT * FROM movie WHERE releaseDate > '" + past + "' AND releaseDate <= '" + today +"' ORDER BY releaseDate DESC LIMIT 10;";
    var comingMovie = "SELECT * FROM movie WHERE releaseDate > '" + today +"' LIMIT 10;";
    var ratedMovie = "SELECT * FROM movie INNER JOIN (SELECT AVG(star) AS rating, movie_id FROM review GROUP BY movie_id) AS review On "
    + "review.movie_id = movie.id WHERE review.rating > 8 ORDER BY releaseDate DESC LIMIT 10;";
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

exports.getRecommendation = function(req, res, callback) {
    if (!req.user) {
            getRecommendation(function(results) {
            res.render('homepage', {user:req.user, invalid:null, results:results});
            });
        } else {
            getRecommendationForUser(req, res, function(results) {
            res.render('homepage', {user:req.user, invalid:null, results:results});
            });
        }
}