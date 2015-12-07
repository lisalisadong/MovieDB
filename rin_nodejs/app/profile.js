var express = require('express');
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

var addFriend = function(req, res) {
	var user = req.user.id;

}

var generateProfileResponse = function(req, res, friendsID, friendsInfo, actorInfo, directorInfo, watchedMoviesInfo, wantedMoviesInfo) {
	var friendsName = friendsInfo.local.name;
	if (friendsName == undefined) {
		friendsName = friendsInfo.facebook.name;
	}
	res.render('profile.ejs', {
		user : req.user,
		profile_owner : ,
		friendsInfo : {
			name: friendsName,
			avatar: friendsInfo.local.avatar
		},
		actorInfo : {
			name: actorInfo.name,
			picture: actorInfo.picture
		},
		directorInfo : {
			name: directorInfo.name,
			picture: directorInfo.picture
		},
		watchedMoviesInfo: {
			name: watchedMoviesInfo.name,
			poster: watchedMoviesInfo.poster
		},
		wantedMoviesInfo: {
			name:wantedMoviesInfo.name,
			poster: wantedMoviesInfo.poster
		}
	});
}

var getWantedMovies = function(req, res, friendsID, friendsInfo, actorInfo, directorInfo, watchedMoviesInfo) {
	var user = req.user.id;
	var query = "SELECT * FROM  WHERE movie WHERE id IN (SELECT movie_id FROM marks WHERE "+
	"status = 2 AND user_id = '" + user + "');"
	connection.query(query, function(err, wantedMoviesInfo) {
		if (err) {
			console.log("err when getWatchedMovies");
		} else {
			generateProfileResponse(req, res, friendsID, friendsInfo, actorInfo, directorInfo, watchedMoviesInfo, wantedMoviesInfo);
		}
	});
}


var getWatchedMovies = function(req, res, friendsID, friendsInfo, actorInfo, directorInfo) {
	var user = req.user.id;
	var query = "SELECT * FROM  WHERE movie WHERE id IN (SELECT movie_id FROM marks WHERE "+
	"status = 1 AND user_id = '" + user + "');"
	connection.query(query, function(err, watchedMoviesInfo) {
		if (err) {
			console.log("err when getWatchedMovies");
		} else {
			getWantedMovies(req, res, friendsID, friendsInfo, actorInfo, directorInfo, watchedMoviesInfo);
		}
	});
}

var getLikedDirectors = function(req, res, friendsID, friendsInfo, actorInfo) {
	var user = req.user.id;
	var query = "SELECT * FROM director WHERE id IN (SELECT director_id FROM likes_director WHERE "
		+ "user_id = '" + user + "');";
	connection.query(query, function(err, directorInfo) {
		if (err) {
			console.log("err when getLikedDirectors");
		} else {
			getWatchedMovies(req, res, friendsID, friendsInfo, actorInfo, directorInfo);
		}
	});
};

var getLikedActors = function(req, res, friendsID, friendsInfo); {
	var user = req.user.id;
	var query = "SELECT * FROM actor WHERE id IN (SELECT actor_id FROM likes_actor WHERE "
		+ "user_id = '" + user + "');";
	connection.query(query, function(err, actorInfo) {
		if (err) {
			console.log("err when getLikedActors");
		} else {
			getLikedDirectors(req, res, friendsID, friendsInfo, actorInfo);
		}
	});
};


var getFriendInfo = function(req, res, db, friendsID, callback) {
	var users = 'users';
	var cursor = db.connection(users).find({_id.old:friendsID});
	console.log(cursor);
	var friendsInfo = [];
	cursor.each(function(err, doc) {
		if (doc != null) {
			friendsInfo.push(doc);
		} else {
			callback(friendsInfo);
		}
	});
};

var getFriendInfoResponse = function(req, res, friendsID) {
	MongoClient.connect(url, function(err, db){
		if (err) {
			console.log("connect to mongodb fail");
			db.close();
		} else {
			console.log("connect to mongodb success");
			getFriendInfo(req, res, db, friendsID, function(friendsInfo) {
				db.close();
				getLikedActors(req, res, friendsID, friendsInfo);
			});
		}
	});
};

var getFriend = function(req, res) {
	var user = req.user.id;
	var query = "(SELECT user_id2 FROM friendWith WHERE user_id1 = '"
	+ user + "') UNION (SELECT user_id1 FROM friendWith WHERE user_id2 = '" + user + "') LIMIT 10; ";
	console.log(query);
	connection.query(query, function(err, friendsID) {
		if (err) {
			console.log('err when getFirend');
		} else {
			getFriendInfoResponse(req, res, db, friendsID);
		}
	});
};





