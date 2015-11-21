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


function generateUser(req, res) {
	var email = req.query.id;
	var password = req.query.password;
	var username = req.query.username;
	var avatar = req.query.avatar;
	var query = "SELECT * FROM user WHERE id = '" + email + "';";
	console.log(query);
	connection.query(query, function(err, result) {
		if(err) {
			console.log(err.msg);
		}
		else if (result.length == 0) {
			var query_insert = "INSERT INTO user (id, username, password) VALUE ('" +
			email + "','" + username + "','" + password + "');";
			connection.query(query_insert, function(err, result) {
				if (err) {
					console.error();
				} else {
					console.log('registering');
					res.render('homepage.ejs', {user: });
				}
			});
		}
	});
}

exports.displayResponse = function(req, res) {
	generateUser(req, res);
}
