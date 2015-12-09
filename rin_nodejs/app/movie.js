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
	var movie = req.movie_id;
	console.log(req);
	switch(req.query.status) {
		case "status1":
			var mark = 0;
		case "status2":
			var mark = 1;
			break;
	}
	var query = "INSERT INTO marks (user_id, movie_id, status) VALUES ('"+user+"','"+movie+"','"+mark+"');";
	req.movie_id = movie;
	connection.query(query, function(err,req,res) {
		if (err) {
			console.log("err when insertMark");
		} else {
			getMovieInfo(req, res);
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
	switch(req.query.rating) {
		case "option1":
			rating = 2;
		case "option2":
			rating = 4;
		case "option3":
			rating = 6;
		case "option4":
			rating = 8;
		case "option5":
			rating = 10;
			break;
	}
	var comment = req.query.comment;
	var query = "INSERT INTO review (user_id, movie_id, star, comment) VALUES ('"
		+user+"','"+movie+"','"+rating+"','"+comment+"');";
	console.log(query);
	req.movie_id = movie;
	connection.query(query, function(err, req, res) {
		if (err) {
			console.log(err);
		} else {
			getMovieInfo(req, res);
		}
	});


}

var generateMovieReponse = function(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters, myRating, myMark, comments) {
	var date = getDay(movieInfo[0].releaseDate);
    var movie = {
        id: movieInfo[0].id,
        name: movieInfo[0].name,
        duration: movieInfo[0].duration,
        releaseDate: date,
        poster: movieInfo[0].poster,
        overview: movieInfo[0].overview,
        genre: movieInfo[0].genre,
        actors: actorsInfo,
        director: directorsInfo[0],
        rating: rating,
        raters: raters,
        my_rating:myRating,
        my_mark:myMark,
        comments:{}

    };
    res.render('movie.ejs', {user:req.user, movie:movie});
}

var getComments = function(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters, myRating, myMark) {
    var id = req.params.id;
    comments = null;
    generateMovieReponse(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters, myRating, myMark, comments)
}

var getMyMark = function(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters, myRating) {
    var id = req.params.id;
    if (req.user == null) {
    	var myMark = null;
    	getComments(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters, myRating, myMark);
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
            getComments(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters, myRating, myMark);
        }
    });
}

var getMyRating = function(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters) {
    var id = req.params.id;
    if (req.user == null) {
    	var myRating = null;
    	getMyMark(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters, myRating);
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
            getMyMark(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters, myRating);
        }
    });
};

var getRatingAndRator = function(req, res, movieInfo, actorsInfo, directorsInfo) {
    var id = req.params.id;
    var query = "SELECT AVG(star) AS rating, COUNT(star) AS raters FROM review GROUP BY movie_id HAVING "+
    "movie_id = '" + id + "';";
    console.log(query);
    connection.query(query, function(err, ratingAndRator) {
        if (err) {
            console.log('err when getRatingAndRator');
        } else {
        	if (ratingAndRator == null) {
        		getMyRating(req, res, movieInfo, actorsInfo, directorsInfo, 8, 2);
        		return;
        	}
            var rating = ratingAndRator[0].rating;
            var raters = ratingAndRator[0].raters;
            console.log(rating);
            console.log(raters);
            getMyRating(req, res, movieInfo, actorsInfo, directorsInfo, rating, raters);
        }
    });
};


var getMovieDirectors = function(req, res, movieInfo, actorsInfo) {
    var id = req.params.id;
    var query = "SELECT director.id, director.name FROM director WHERE director.id IN (SELECT "+
        "director_id FROM directs WHERE movie_id = '"+ id + "') LIMIT 1;";
    //console.log(query);
    connection.query(query, function(err, directorsInfo) {
        if (err) {
            console.log('err when getMovieDirectors');
        } else {
            getRatingAndRator(req, res, movieInfo, actorsInfo, directorsInfo);
        }
    });
}

var getMovieActors = function(req, res, movieInfo) {
    var id = req.params.id;
    var query = "SELECT actor.id, actor.name FROM actor WHERE actor.id IN (SELECT "+
        "actor_id FROM plays WHERE movie_id = '"+ id + "') LIMIT 10;";
    //console.log(query);
    connection.query(query, function(err, actorsInfo) {
        if (err) {
            console.log('err when getMovieActors');
        } else {
            getMovieDirectors(req, res, movieInfo, actorsInfo);
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
            getMovieActors(req, res, movieInfo);
        }
    });
};

exports.getMovieInfoResponse = function(req, res) {
	getMovieInfo(req, res);
}

exports.insertRatingResponse = function(req, res) {
	console.log(req.body);
	insertRating(req, res);
}