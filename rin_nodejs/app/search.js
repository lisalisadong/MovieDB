var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://rinuser:rindatabase@ds061974.mongolab.com:61974/rin';
var ObjectId = require('mongoose').Types.ObjectId;

var connection = mysql.createConnection({
    host: 'rindatabase.c2kwkkeairnp.us-east-1.rds.amazonaws.com',
    user: 'hanabeast',
    password: 'fyl1990617',
    database: 'RinDataBase'
});

var getSearchUserResults = function(input, option, db, callback) {
	var users = 'users';
	var cursor = db.collection(users).find({$or:[{"facebook.name":input},{"local.username":input}]});
	var results = [];
	cursor.each(function(err, doc) {
		if (doc != null) {
			if (doc.local.username) {
				var name = doc.local.username;
			} else {
				var name = doc.facebook.name;
			}
			var user = {
				id: doc._id,
				name: name,
				avatar: doc.local.avatar
			}
			results.push(user);
		} else {
			callback(results);
		}
	})
}

var searchUser = function(input, option, callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log("connect to mongodb fail");
			db.close();
		} else {
			console.log("connect to mongodb success");
			getSearchUserResults(input, option, db, function(results) {
				//console.log(db);
				console.log(results);
				db.close();
				callback(results, option);
			})
		}
	})
}

function getResults(req, callback) {
	var input = req.query.input;
	fuzzy = input.replace(" ","%");
	var option = 1;
	switch (req.query.searchOptions) {
		case "option1":
			option = 1;
			var query = "SELECT * FROM movie WHERE LCASE(name) LIKE LCASE('%" + fuzzy + "%');";
			break;
		case "option2":
			option = 2;
			var query = "SELECT * FROM actor WHERE LCASE(name) LIKE LCASE('%" + fuzzy + "%');"
			break;
		case "option3":
			option = 3;
			var query = "SELECT * FROM director WHERE LCASE(name) LIKE LCASE('%" + fuzzy + "%');"
			break;
		case "option4":
			option = 4;
			searchUser(input, option, callback);
			return;
			break;
	}
	connection.query(query, function(err, rows) {
		if (!err) {
		   	// console.log('The solution is: ', rows);
			var results = [];
			if (rows != null) {
				//console.log(doc);
				for (var i = 0; i < rows.length; i++) {
					results.push(rows[i]);
				}
				callback(results, option);
			}
		} else {
			console.log('Error while performing Query.');
		}
	});
}

function generateResponse(req, res) {

	console.log("Connected correctly to server.");
	getResults(req, function(results, option) {
		res.render("search", {user:req.user, results:results, option:option});
	});
	
}

exports.displayResponse = function(req, res){
	generateResponse(req, res);
	// connection.end();
};

