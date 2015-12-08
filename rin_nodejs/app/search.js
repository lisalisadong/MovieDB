var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'rindatabase.c2kwkkeairnp.us-east-1.rds.amazonaws.com',
    user: 'hanabeast',
    password: 'fyl1990617',
    database: 'RinDataBase'
});


function getResults(req, callback) {
	var input = req.query.input;
	input = input.replace(" ","%");
	var option = 1;
	switch (req.query.searchOptions) {
		case "option1":
			option = 1;
			var query = "SELECT * FROM movie WHERE LCASE(name) LIKE LCASE('%" + input + "%');";
			break;
		case "option2":
			option = 2;
			var query = "SELECT * FROM actor WHERE LCASE(name) LIKE LCASE('%" + input + "%');"
			break;
		case "option3":
			option = 3;
			var query = "SELECT * FROM director WHERE LCASE(name) LIKE LCASE('%" + input + "%');"
			break;
		case "option4":
			option = 4;
			var query = "SELECT * FROM user WHERE LCASE(username) LIKE LCASE('%" + input + "%');"
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

