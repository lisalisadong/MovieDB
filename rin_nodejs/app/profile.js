var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var search = require('./search');
var url = 'mongodb://rinuser:rindatabase@ds061974.mongolab.com:61974/rin';
var MongoClient = require('mongodb').MongoClient;
//var User = require('../app/models/user');
var ObjectId = require('mongoose').Types.ObjectId;

//var moment = require('moment')

var connection = mysql.createConnection({
    host: 'rindatabase.c2kwkkeairnp.us-east-1.rds.amazonaws.com',
    user: 'hanabeast',
    password: 'fyl1990617',
    database: 'RinDataBase'
});

// profile_owner = {
        //     id:'123',
        //     name: 'name',
        //     avatar: 'http:..',
        //     is_me: 'true/false',
        //     is_friend: 'true/false',
        //     actors: [{id:123, name:'aaa', poster:'http://'}, {...}],
        //     directors: [{id:123, name:'aaa', poster:'http://'}, {...}],
        //     wanted_movies: [{id:123, name:'aaa', poster:'http://'}, {...}],
        //     watched_movies: [{id:123, name:'aaa', poster:'http://'}, {...}]
        // }

var followFriend = function(req, res) {
	var user = req.user.id;
	var owner = req.params.id;
	var query = "INSERT INTO friendWith (user_id1, user_id2) VALUES ('"+user+"','"+owner+"');";
	connection.query(query, function(err) {
		if (err) {
			console.local('err when followFriend');
		} else {
			res.redirect('/profile/'+owner);
		}
	});

}

var unfollowFriend = function(req, res) {
	var user = req.user.id;
	var owner = req.params.id;
	var query = "DELETE FROM friendWith WHERE user_id1 = '"+user+"' AND user_id2 = '"+ owner +"';";
	console.log(query);
	connection.query(query, function(err) {
		if (err) {
			console.log('err when unfollowFriend');
		} else {
			res.redirect('/profile/'+owner);
		}
	});
}

var generateProfile = function(req, res, profile_owner) {
	//console.log(profile_owner);
	res.render('profile.ejs', {user:req.user, profile_owner:profile_owner});
	
}



var getFriendInfo = function(req, res, db, friends, callback) {
	var users = 'users';
	//console.log(db);
	var friendsList = [];
	var cursor = db.collection(users).find({"_id":{$in:friends}});
	//console.log(cursor);
	var friendsInfo = [];
	cursor.each(function(err, result) {
		if (result!= null) {
			console.log('get Here');
			if (result.local.username) {
				var name = result.local.username;
			} else {
				var name = result.facebook.name;
			}
			var friend = {
				id: result._id,
				name: name,
				avatar: result.local.avatar
			}
			friendsInfo.push(friend);
		} else {
			callback(friendsInfo);
		}
	});
};

var getFriendInfoResponse = function(req, res, profile_owner, friends) {
	MongoClient.connect(url, function(err, db){
		if (err) {
			console.log("connect to mongodb fail");
			db.close();
		} else {
			console.log("connect to mongodb success");
			//console.log(db);
			getFriendInfo(req, res, db, friends, function(friendsInfo) {
				db.close();
				//console.log(friendsInfo);
				profile_owner.friends = friendsInfo;
				generateProfile(req, res, profile_owner);
			});
		}
	});
};


var getFriendID = function(req, res, profile_owner) {
	var user = req.params.id;
	var query = "SELECT user_id2 FROM friendWith WHERE user_id1 = '"
	+ user + "'LIMIT 10; ";
	//console.log(query);
	connection.query(query, function(err, friendsID) {
		if (err) {
			console.log('err when getFriendID');
		} else {
			var friends = [];
			for (var i = 0; i < friendsID.length; i++) {
				friends.push(new ObjectId(friendsID[i].user_id2));
			}
			console.log(friends);
			getFriendInfoResponse(req, res, profile_owner, friends);
		}
	});
};

var getOwnerInfoResults = function(req, db, callback) {
	var id = req.params.id;
	var users = 'users';
	var cursor = db.collection(users).find({"_id": new ObjectId(id)});
	var results = [];
	cursor.each(function(err, owner) {
		if (owner != null) {
			if (!owner.local.username) {
				var name = owner.facebook.name;
			} else {
				var name = owner.local.username;
			}
			var ownerInfo = {
				id: owner._id,
				name: name,
				avatar: owner.local.avatar
			};
			results.push(ownerInfo);
		} else {
			console.log(results);
			callback(results[0]);
		}
	});
	
}

var getOwnerInfo = function(req, res, profile_owner) {
	//console.log(url);
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log("connect to mongodb fail");
			db.close();
		} else {
			console.log("connect to mongodb success");
			getOwnerInfoResults(req, db, function(ownerInfo) {
				//console.log(db);
				db.close();
				profile_owner.id = ownerInfo.id;
				profile_owner.name = ownerInfo.name;
				profile_owner.avatar = ownerInfo.avatar;
				getFriendID(req, res, profile_owner);
			})
		}
	})
}


var getWantedMovies = function(req, res, profile_owner) {
	var user = req.params.id;
	var query = "SELECT DISTINCT id, name, poster FROM movie WHERE id IN (SELECT movie_id FROM marks WHERE "+
	"status = 1 AND user_id = '" + user + "') LIMIT 5;"
	connection.query(query, function(err, wantedMoviesInfo) {
		if (err) {
			console.log("err when getWantedMovies");
		} else {
			profile_owner.wanted_movies = wantedMoviesInfo;
			getOwnerInfo(req, res, profile_owner);
		}
	});
}


var getWatchedMovies = function(req, res, profile_owner) {
	var user = req.params.id;
	var query = "SELECT DISTINCT id, name, poster FROM movie WHERE id IN (SELECT movie_id FROM marks WHERE "+
	"status = 0 AND user_id = '" + user + "') LIMIT 5;"
	//console.log(query);
	//console.log(profile_owner);
	connection.query(query, function(err, watchedMoviesInfo) {
		if (err) {
			console.log("err when getWatchedMovies");
		} else {
			//console.log(watchedMoviesInfo);
			profile_owner.watched_movies = watchedMoviesInfo;
			getWantedMovies(req, res, profile_owner);
		}
	});
}

var getLikedDirectors = function(req, res, profile_owner) {
	var user = req.params.id;
	var query = "SELECT DISTINCT id, name, picture AS poster FROM director WHERE id IN (SELECT director_id FROM likes_director WHERE "
		+ "user_id = '" + user + "');";
	connection.query(query, function(err, directorInfo) {
		if (err) {
			console.log("err when getLikedDirectors");
		} else {
			profile_owner.directors = directorInfo;
			getWatchedMovies(req, res, profile_owner);
		}
	});
};

var getLikedActors = function(req, res, profile_owner) {
	var user = req.params.id;
	var query = "SELECT DISTINCT id, name, picture AS poster FROM actor WHERE id IN (SELECT actor_id FROM likes_actor WHERE "
		+ "user_id = '" + user + "') LIMIT 5;";
	connection.query(query, function(err, actorInfo) {
		if (err) {
			console.log("err when getLikedActors");
		} else {
			profile_owner.actors = actorInfo;
			getLikedDirectors(req, res, profile_owner);
		}
	});
};

var getIsFriend = function(req, res, profile_owner) {
	var user = req.user.id;
	var owner = req.params.id;
	if (profile_owner.is_me) {
		profile_owner.is_friend = false;
		getLikedActors(req, res, profile_owner);
		return;
	}
	var query = "SELECT user_id1 FROM friendWith WHERE user_id1 = '"+user+"' AND user_id2 = '"+owner+"';";
	console.log(query);
	connection.query(query, function(err, isFriend) {
		if (err) {
			console.log('err when isFriend');
		} else if (isFriend.length == 0) {
			profile_owner.is_friend = false;
			getLikedActors(req, res, profile_owner);
		} else {
			profile_owner.is_friend = true;
			getLikedActors(req, res, profile_owner);
		}
	})
};

var getIsMe = function(req, res) {
	if (!req.user) {
		var profile_owner = {
			is_me:false,
			is_friend:false
		}
		getLikedActors(req, res, profile_owner);
		return;
	}
	var user = req.user.id;
	var owner = req.params.id;
	if (user == owner) {
		var isMe = true;
	} else {
		var isMe = false;
	}
	var profile_owner = {
		is_me: isMe
	}
	getIsFriend(req, res, profile_owner);
}

exports.getProfileResponse = function(req, res) {
	getIsMe(req, res);
}

exports.followFriendResponse = function(req, res) {
	followFriend(req, res);
}

exports.unfollowFriendResponse = function(req, res) {
	unfollowFriend(req, res);
}





