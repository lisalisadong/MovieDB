var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var search = require('./search');
var url = require('url');
//var MongoClient = require('mongodb').MongoClient;

//var moment = require('moment')

// var person = {  id:27578, 
//                         name:'Ellen Page', 
//                         dob:'1987-02-21', 
//                         picture: 'http://image.tmdb.org/t/p/original/vDunkYxyQPkzx9EwkfSZVCSzBlO.jpg',
//                         bio: 'Ellen Philpotts-Page (born February 21, 1987, height 5\'\' 1" (1,55 m)), known professionally as Ellen Page, is a Canadian actress. Page received both Golden Globe and Academy Award nominations for Best Actress for her role as the title character in the film Juno. In 2008, Page was nominated for Time\'\'s 100 Most Influential People list and placed #86 on FHM\'\'s Sexiest Women in the World list, and moved up to #70 for 2010. In June 2008, Page was named on Entertainment Weekly\'\'s future A-List stars list. Page resides in her hometown of Halifax, Nova Scotia and has two dogs named Julie and Sprout. She is prone to walk and talk in her sleep. In 2008, Page was one of 30 celebrities who participated in an online ad series for U.S. Campaign for Burma, calling for an end to the military dictatorship in Burma. She describes herself as a pro-choice feminist. In the fall of 2008 Page spent a month living in an eco-village, studying permaculture at the Lost Valley Educational Center outside Eugene, Oregon.',
//                         recent_movies: [   {id:87499, name:'The East', releaseDate:'2013-05-31', poster:'http://image.tmdb.org/t/p/original/n6n0rMFsQhdNoMygr2pyL26wUfM.jpg'},
//                                     {id:154282, name:'Touchy Feely', releaseDate:'2013-01-19', poster:'http://image.tmdb.org/t/p/original/krKqoeVUjFf6Y86zO4PSQ2toK5a.jpg'},
//                                     {id:81836, name:'To Rome with Love', releaseDate:'2012-07-04', poster:'http://image.tmdb.org/t/p/original/zGVAVQufbwE5BjU17OBkXM9PWRS.jpg'},
//                                     {id:45132, name:'Super', releaseDate:'2011-03-31', poster:'http://image.tmdb.org/t/p/original/wRYZdWGCcC7ttY7MFNbIKpR3pnn.jpg'},
//                                     {id:27205, name:'Inception', releaseDate:'2010-07-16', poster:'http://image.tmdb.org/t/p/original/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg'}],
//                         top_movies: [   {id:87499, name:'The East', releaseDate:'2013-05-31', poster:'http://image.tmdb.org/t/p/original/n6n0rMFsQhdNoMygr2pyL26wUfM.jpg'},
//                                     {id:154282, name:'Touchy Feely', releaseDate:'2013-01-19', poster:'http://image.tmdb.org/t/p/original/krKqoeVUjFf6Y86zO4PSQ2toK5a.jpg'},
//                                     {id:81836, name:'To Rome with Love', releaseDate:'2012-07-04', poster:'http://image.tmdb.org/t/p/original/zGVAVQufbwE5BjU17OBkXM9PWRS.jpg'},
//                                     {id:45132, name:'Super', releaseDate:'2011-03-31', poster:'http://image.tmdb.org/t/p/original/wRYZdWGCcC7ttY7MFNbIKpR3pnn.jpg'},
//                                     {id:27205, name:'Inception', releaseDate:'2010-07-16', poster:'http://image.tmdb.org/t/p/original/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg'}]
//                     }


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
};

var generateMovieResponse = function(req, res, personInfo, recentMovies, topMovies) {
	
	for (var i = 0; i < recentMovies.length; i++) {
		recentMovies[i].releaseDate = getDay(recentMovies[i].releaseDate);
	}
	for (var i = 0; i < topMovies.length; i++) {
		topMovies[i].releaseDate = getDay(topMovies[i].releaseDate);
	}

	var person = {
		id : personInfo[0].id,
		name : personInfo[0].name,
		dob : getDay(personInfo[0].dateOfBirth),
		picture : personInfo[0].picture,
		bio : personInfo[0].bio,
		recent_movies : recentMovies,
		top_movies : topMovies
	};
	res.render('person.ejs', {user:req.user, person:person});
}

var getTopMoviesForActor = function(req, res, personInfo, recentMovies) {
	var id = req.person_id;
	var query = "SELECT DISTINCT id, name, releaseDate, poster FROM movie INNER JOIN "
	+ "(SELECT AVG(star) AS rating, movie_id FROM review GROUP BY movie_id) AS helper "
	+ "WHERE id IN (SELECT movie_id FROM plays " + "WHERE actor_id = '"+ id 
	+"') ORDER BY helper.rating DESC LIMIT 5;";
	console.log(query);
	connection.query(query, function(err, topMovies) {
		if (err) {
			console.log('err when getTopMovies');
		} else {
			generateMovieResponse(req, res, personInfo, recentMovies, topMovies);
		}
	});
};


var getRecentMovieForActor = function(req, res, personInfo) {
	var today = getDay(new Date());
    var p = new Date();
    p.setMonth(p.getMonth() - 3);
    var past = getDay(p);
	var id = req.person_id;
	var query = "SELECT DISTINCT id, name, releaseDate, poster FROM movie WHERE id IN (SELECT movie_id FROM plays "+
	"WHERE actor_id = '"+ id + "') ORDER BY releaseDate DESC LIMIT 5;";
	console.log(query);
	connection.query(query, function(err, recentMovies) {
		if (err) {
			console.log('err when getRecentMovie');
		} else {
			getTopMoviesForActor(req, res, personInfo, recentMovies);
		}
	});
};

var getTopMoviesForDirector = function(req, res, personInfo, recentMovies) {
	var id = req.person_id;
	var query = "SELECT DISTINCT id, name, releaseDate, poster FROM movie INNER JOIN "
	+ "(SELECT AVG(star) AS rating, movie_id FROM review GROUP BY movie_id) AS helper "
	+ "WHERE id IN (SELECT movie_id FROM directs " + "WHERE director_id = '"+ id 
	+"') ORDER BY helper.rating DESC LIMIT 5;";
	console.log(query);
	connection.query(query, function(err, topMovies) {
		if (err) {
			console.log('err when getTopMovies');
		} else {
			generateMovieResponse(req, res, personInfo, recentMovies, topMovies);
		}
	});
};


var getRecentMovieForDirector = function(req, res, personInfo) {
	var today = getDay(new Date());
    var p = new Date();
    p.setMonth(p.getMonth() - 3);
    var past = getDay(p);
	var id = req.person_id;
	var query = "SELECT DISTINCT id, name, releaseDate, poster FROM movie WHERE id IN (SELECT movie_id FROM directs "+
	"WHERE director_id = '"+ id + "') ORDER BY releaseDate DESC LIMIT 5;";
	console.log(query);
	connection.query(query, function(err, recentMovies) {
		if (err) {
			console.log('err when getRecentMovie');
		} else {
			getTopMoviesForDirector(req, res, personInfo, recentMovies);
		}
	});
};




var getPersonInfo = function(req, res) {
	var id = req.person_id;
	var queryActor = "SELECT * FROM actor WHERE id = '"+ id +"';";
	var queryDirector = "SELECT * FROM director WHERE id = '"+ id +"';";
	console.log(queryActor);
	connection.query(queryActor, function(err, personInfo) {
		if (err) {
			console.log('err when getPersonInfo');
		} else if (personInfo.length != 0) {
			console.log(personInfo);
			getRecentMovieForActor(req, res, personInfo);
		} else {
			connection.query(queryDirector, function(err, personInfo) {
				console.log(queryDirector);
				if (err) {
					console.log('err when getPersonInfo');
				} else {
					getRecentMovieForDirector(req, res, personInfo);
				}
			})
		}
	});
}

exports.getPersonInfoResponse = function(req, res){
	getPersonInfo(req, res);
}