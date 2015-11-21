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

function getResult(req, db, callback) {
	var email = req.query.id;
	var password = req.query.password;
	var username = req.query.username;
	var avatar = req.query.avatar;
	var query = "SELECT * FROM USER WHERE ID = " + email;
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function validateUser(user) {
	return user.length >= 5;
}

function validatePassword(pasword) {
	return password.length >= 8;
}

function generateUser(req, res) {
	var email = req.query.id;
	var password = req.query.password;
	var username = req.query.username;
	var avatar = req.query.avatar;
	var query = "SELECT * FROM USER WHERE ID = " + email;
	console.log(query);
	connection.query(query, function(err, result) {
		if(err) {
			res.render('')
		}
		else if (result.length == 0) {
			var query_insert = "INSERT INTO USER (ID, USERNAME, PASSWORD) (VALUE " +
			email + "," + username + "," + password + ");";
			connection.query(query_insert, function(err, result) {
				if (err)
					res.render('')
			});
		}
	});
	res.render('register', {});
}

function displayResponse(req, res) {
	generateUser(req, res);
}
