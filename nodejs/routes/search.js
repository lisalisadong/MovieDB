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
	var query = "SELECT * FROM movie WHERE LCASE(name) LIKE LCASE('%" + input + "%');";
	connection.query(query, function(err, rows) {
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

	console.log("Connected correctly to server.");
	getResults(req, function(results) {
		res.render("search", {results:results})
	});
	
}

exports.displayResponse = function(req, res){
	generateResponse(req, res);
	// connection.end();
};

