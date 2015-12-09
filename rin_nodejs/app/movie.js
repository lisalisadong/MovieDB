var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var MongoClient = require('mongodb').MongoClient;
//var User = require('../app/models/user');
var ObjectId = require('mongoose').Types.ObjectId;
var url = 'mongodb://rinuser:rindatabase@ds061974.mongolab.com:61974/rin';

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
var getDay = function(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    return year + '-' + month + '-' + day;
}

var insertMark = function(req, res) {
	var user = req.user.id;
	var movie = req.params.id;
	console.log(req);
	switch(req.body.status) {
		case "status1":
			var mark = 0;
            break;
		case "status2":
			var mark = 1;
			break;
	}
	var query = "INSERT INTO marks (user_id, movie_id, status) VALUES ('"+user+"','"+movie+"','"+mark+"');";
	console.log(query);
	connection.query(query, function(err) {
		if (err) {
			console.log("err when insertMark");
		} else {
			res.redirect('/movie/'+movie);
		}
	});
}


var insertRating = function(req, res) {
	console.log(req.body == null);
	var user = req.user.id;
	var movie= req.params.id;
	console.log(movie);
	console.log(req);
	var rating = 0;
	switch(req.body.rating) {
		case "option1":
			rating = 2;
            break;
		case "option2":
			rating = 4;
            break;
		case "option3":
			rating = 6;
            break;
		case "option4":
			rating = 8;
            break;
		case "option5":
			rating = 10;
			break;
	}
	var comment = req.body.comment;
    console.log(comment);
	var query = "INSERT INTO review (user_id, movie_id, star, comment) VALUES ('"
		+user+"','"+movie+"','"+rating+"','"+comment+"');";
	console.log(query);
	//req.movie_id = movie;
	connection.query(query, function(err) {
		if (err) {
			console.log('err when insertRating');
		} else {
			res.redirect('/movie/'+movie);
		}
	});


}

var generateMovieReponse = function(req, res, movie) {
    console.log(movie.my_mark);
    res.render('movie.ejs', {user:req.user, movie:movie});
}

// var getCommentsAgreed = function(req, comments, callback) {
//     var id = req.params.id;
//     if (req.user == null) {
//         callback(comments);
//         return;
//     }
//     var user = req.user.id;
//     for (var i = 0; i < comments.length; i++) {
//         if (comments[i].agrees == null) {
//             comments[i].agrees = 0;
//             comments[i].agreed = false;
//         } else {
//             var query = "SELECT * FROM agrees WHERE user_id1 = '"+comments[i] +"' AND user_id2 = '"+
//             user+"' AND movie_id = '"+id+"';";
//             console.log(query);
//             var records = connection.query(query);
//             if (records.length == 0) {
//                 comments[i].agreed = false;
//             } else {
//                 comments[i].agreed = true;
//             }
//         }
        
//     }
//     callback(comments);
// }

var getComments = function(req, res, movie) {
    var id = req.params.id;
    var query = "SELECT * FROM review WHERE movie_id = '" + id + "';"
    //console.log(query);
    console.log(query);
    connection.query(query, function(err, comments) {
        if (err) {
            console.log("err when getComments");
        } else {
            console.log(comments);
            movie.comments = comments;
            generateMovieReponse(req, res, movie);
        }
    })
}

var getMyMark = function(req, res, movie) {
    var id = req.params.id;
    if (req.user == null) {
    	movie.my_mark = null;
    	getComments(req, res, movie);
    	return;
    }
    var user = req.user.id;
    var query = "SELECT status FROM marks WHERE user_id = '"+user+"' AND movie_id = '"+
    id+"';";
    //console.log(query);
    connection.query(query, function(err, myMark) {
        if (err) {
            console.log('err when getMyMark');
        } else {
            movie.my_mark = myMark;
            getComments(req, res, movie);
        }
    });
}

var getMyRating = function(req, res, movie) {
    var id = req.params.id;
    if (req.user == null) {
    	movie.my_rating = null;
    	getMyMark(req, res, movie);
    	return;
    }
    var user = req.user.id;
    var query = "SELECT star, comment FROM review WHERE movie_id = '" + id + "' AND user_id = '"
    + user + "';";
    //console.log(query);
    //console.log(raters);
    connection.query(query, function(err, myRating) {
        if (err) {
            console.log('err when getMyRating');
        } else {
            movie.my_rating = myRating;
            getMyMark(req, res, movie);
        }
    });
};

var getRatingAndRator = function(req, res, movie) {
    var id = req.params.id;
    var query = "SELECT AVG(star) AS rating, COUNT(star) AS raters FROM review GROUP BY movie_id HAVING "+
    "movie_id = '" + id + "';";
    console.log(query);
    connection.query(query, function(err, ratingAndRator) {
        if (err) {
            console.log('err when getRatingAndRator');
        } else if (ratingAndRator.length == 0){
            movie.rating = 0;
            movie.raters = 0;
            getMyRating(req, res, movie);
        } else {
            movie.rating = ratingAndRator[0].rating;
            movie.raters = ratingAndRator[0].raters;
            getMyRating(req, res, movie);
        }
    });
};


var getMovieDirectors = function(req, res, movie) {
    var id = req.params.id;
    var query = "SELECT director.id, director.name FROM director WHERE director.id IN (SELECT "+
        "director_id FROM directs WHERE movie_id = '"+ id + "') LIMIT 1;";
    //console.log(query);
    connection.query(query, function(err, directorsInfo) {
        if (err) {
            console.log('err when getMovieDirectors');
        } else {
            movie.director = directorsInfo[0];
            getRatingAndRator(req, res, movie);
        }
    });
}

var getMovieActors = function(req, res, movie) {
    var id = req.params.id;
    var query = "SELECT actor.id, actor.name FROM actor WHERE actor.id IN (SELECT "+
        "actor_id FROM plays WHERE movie_id = '"+ id + "') LIMIT 10;";
    //console.log(query);
    connection.query(query, function(err, actorsInfo) {
        if (err) {
            console.log('err when getMovieActors');
        } else {
            movie.actors = actorsInfo;
            getMovieDirectors(req, res, movie);
        }
    });
};

var getMovieInfo = function(req, res) {
    var id = req.params.id;
    console.log(id);
    var query = "SELECT * FROM movie WHERE id = '" + id + "';";
    //console.log(query);
    connection.query(query, function(err, movieInfo) {
        if(err) {
            console.log('err when getMovieInfo');
        } else {
            var movie = {
                id: movieInfo[0].id,
                name: movieInfo[0].name,
                duration: movieInfo[0].duration,
                releaseDate: getDay(movieInfo[0].releaseDate),
                poster: movieInfo[0].poster,
                overview: movieInfo[0].overview,
                genre: movieInfo[0].genre,
            }
            getMovieActors(req, res, movie);
        }
    });
};

exports.getMovieInfoResponse = function(req, res) {
	getMovieInfo(req, res);
}

exports.insertRatingResponse = function(req, res) {
	//console.log(req.body);
	insertRating(req, res);
}

exports.insertMarkResponse = function(req, res) {
    insertMark(req, res);
}