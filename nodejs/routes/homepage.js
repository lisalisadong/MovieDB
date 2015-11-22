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

function getLoginResult(req, res) {
	var email = req.query.email;
	var password = req.query.password;
	var query = "SELECT * FROM user WHERE " +
	"id = '" + email + "' and password = '" + password + "';";
	console.log(query);
	connection.query(query, function(err, result) {
		if (err) {
			console.log("Selection Failure.");
		}
		else if (result.length == 0) {
			res.render("homepage", {user:null, invalid:true});
		} else {
			res.render("homepage", {user:result[0].username, invalid:true});
		}
	});
}

function generateLoginResponse(req, res) {
	
}



exports.displayResponse = function(req, res) {
	getLoginResult(req, res);
}
