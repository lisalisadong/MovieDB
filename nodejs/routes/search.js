var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'rindatabase.c2kwkkeairnp.us-east-1.rds.amazonaws.com',
    user: 'hanabeast',
    password: 'fyl1990617',
    database: 'RinDataBase'
});


function getResults() {
	connection.query('SELECT * from movie', function(err, rows, fields) {
		connection.end();
		if (!err)
		   	console.log('The solution is: ', rows);
		else
			console.log('Error while performing Query.');
	});
}

function generateResponse(req, res) {
	
	// connect to mysql
	connection.connect(function(err) {
		if(err != null) {
			console.log("Connection to server failed.");
			res.render('error', {
				message: "Connection to server failed.",
				error: err
			});
		} else {
			console.log("Connected correctly to server.");
			getResults();
		}
	});
}

exports.displayResponse = function(req, res){
	console.log("xxx");
	generateResponse(req, res);
};

