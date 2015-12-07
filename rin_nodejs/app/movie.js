var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'rindatabase.c2kwkkeairnp.us-east-1.rds.amazonaws.com',
    user: 'hanabeast',
    password: 'fyl1990617',
    database: 'RinDataBase'
});

// app.get('/movie', function(req, res, next) {
//         var url_parts = url.parse(req.url, true);
//         var query = url_parts.query;
//         //TODO: do something here with query.id to fetch movie detail
//         var movie = {   id:27205, 
//                         name:'Inception', 
//                         duration:148, 
//                         releaseDate:'2010-07-16',
//                         poster: 'http://image.tmdb.org/t/p/original/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
//                         overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person\'s idea into a target\'s subconscious.',
//                         genre: 'Action | Thriller | Science Fiction | Mystery | Adventure',
//                         actors: [   {id:6193, name:'Leonardo DiCaprio'},
//                                     {id:24045, name:'Joseph Gordon-Levitt'},
//                                     {id:27578, name:'Ellen Page'},
//                                     {id:2524, name:'Tom Hardy'},
//                                     {id:3899, name:'Ken Watanabe'}],
//                         director: {id:525, name:'Christopher Nolan'},
//                         rating: 9.2,
//                         rater: 10,
//                         my_rating: {status: true, star: 3, comments: "I like it!"},
//                         comments: [  {id:123, name: 'qingxiao', rating: 4, comments: "Awesome!", time: '2015-12-01 12:00:00', agrees: 10, agreed: false},
//                                     {id:234, name: 'yilun', rating: 5, comments: 'Amazing!', time: '2015-12-02 13:12:32', agrees: 14, agreed: true}]
//                     }
//         console.log(movie);
//         res.render('movie.ejs', {user:req.user, movie:movie});
//     });

var generateMovieReponse = function(req, query, res, movieInfo, actorsInfo, ratingAndRator, myRating, myMark, comments) {
	var movie = {
		id: movieInfo.id,
		name: movieInfo.name,
		duration: movieInfo.duration,
		releaseDate: movieInfo.releaseDate,
		poster: movieInfo.poster,
		overview: movieInfo.overview,
		genre: movieInfo.genre,
		actors: actorsInfo,
		director: directorsInfo,
		rating: ratingAndRator.rating,
		raters: ratingAndRator.raters,
		my_rating:null,
		comments:null

	};
	res.render('movie.ejs', {user:req.user, movie:movie});
}
var getComments = function(req, query, res, movieInfo, actorsInfo, ratingAndRator, myRating, myMark) {
	var id = query.id;
}

var getMyMark = function(req, query, res, movieInfo, actorsInfo, ratingAndRator) {
	var id = query.id;
	var user = req.user.id;
	var query = "SELECT status FROM marks WHERE user_id = '"+user+"' AND movie_id = '"+
	id+"';";
	connection.query(query, function(err, myMark) {
		if (err) {
			console.log('err when getMyMark');
		} else {
			getComments(req, query, res, movieInfo, actorsInfo, ratingAndRator, myRating, myMark);
		}
	});
}

var getMyRating = function(req, query, res, movieInfo, actorsInfo, ratingAndRator) {
	var id = query.id;
	var user = req.user.id;
	var query = "SELECT star, comment FROM review WHERE movie_id = '" + id + "' AND user_id = '"
	+ user + "';";
	connection.query(query, function(err, myRating) {
		if (err) {
			console.log('err when getMyRating');
		} else {
			getMyMark(req, query, res, movieInfo, actorsInfo, ratingAndRator, myRating);
		}
	});
};

var getRatingAndRator = function(req, query, res, movieInfo, actorsInfo) {
	var id = query.id;
	var query = "SELECT AVG(star) AS rating, COUNT(star) AS raters FROM review WHERE "+
	"movie_id = '" + id + "';";
	connection.query(query, function(err, ratingAndRator) {
		if (err) {
			console.log('err when getRatingAndRator');
		} else {
			getMyRating(req, query, res, movieInfo, actorsInfo, ratingAndRator);
		}
	});
};


var getMovieDirectors = function(req, query, res, movieInfo, actorsInfo) {
	var id = query.id;
	var query = "SELECT director.id, director.name FROM director WHERE director.id IN (SELECT "+
		"director_id FROM directs WHERE movie_id = '"+ id + "');";
	connection.query(query, function(err, directorsInfo) {
		if (err) {
			console.log('err when getMovieDirectors');
		} else {
			getRatingAndRator(req, query, res, movieInfo, actorsInfo, directorsInfo);
		}
	});
}

var getMovieActors = function(req, query, res, movieInfo) {
	var id = query.id;
	var query = "SELECT actor.id, actor.name FROM actor WHERE actor.id IN (SELECT "+
		"actor_id FROM plays WHERE movie_id = '"+ id + "');";
	console.log(getMovieActors);
	connection.query(query, function(err, actorsInfo) {
		if (err) {
			console.log('err when getMovieActors');
		} else {
			getMovieDirectors(req, query, res, movieInfo, actorsInfo);
		}
	});
};

var getMovieInfo = function(req, query, res) {
	var id = query.id;
	var query = "SELECT * FROM movie WHERE id = '" + id + "';";
	connection.query(query, function(err, movieInfo) {
		if(err) {
			console.log('err when getMovieInfo');
		} else {
			getMovieActors(req, query, res, movieInfo);
		}
	});
};


