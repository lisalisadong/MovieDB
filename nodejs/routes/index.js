var express = require('express');
var router = express.Router();
var mysql = require('mysql');
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

/* GET home page. */
router.get('/', function(req, res, next) {
	getRecommendation(function(results) {
		res.render('homepage', {user:null, invalid:null, results:results});
	});
});

router.get('/register', function(req, res, next) {
	res.render('register', {flag:false});
});

router.get('/search', function(req, res, next) {
	res.render('search', {results: null, option:1});
});

router.get('/profile', function(req, res, next) {
	res.render('profile', {results: null});
});

module.exports = router;


