var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'rindatabase.c2kwkkeairnp.us-east-1.rds.amazonaws.com',
    user: 'hanabeast',
    password: 'fyl1990617',
    database: 'RinDataBase'
});


function getResults(callback) {
	connection.query('select * from movie where releaseDate >= "2015-01-01" and releaseDate < "2015-11-20"', function(err, rows) {
		connection.end();
		if (!err) {
		   	// console.log('The solution is: ', rows);
			var results = [];
			if (rows != null) {
				//console.log(doc);
				for (var i = 0; i < rows.length; i++) {
					results.push(rows[i]);
				}
				callback(results);
			}
		} else {
			console.log('Error while performing Query.');
		}
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
			getResults(function(results) {
				res.render("search", {results:results})
			})
		}
	});
}

exports.displayResponse = function(req, res){
	console.log("xxx");
	generateResponse(req, res);
};

