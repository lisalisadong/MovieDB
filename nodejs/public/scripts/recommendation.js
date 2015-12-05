// var express = require('express');
// var router = express.Router();
var mysql = require('mysql');
//var moment = require('moment')

var connection = mysql.createConnection({
    host: 'rindatabase.c2kwkkeairnp.us-east-1.rds.amazonaws.com',
    user: 'hanabeast',
    password: 'fyl1990617',
    database: 'RinDataBase'
});



window.onload = function() {
	addPageContents();
}

var addPageContents = function() {
	var today = new Date();
	var past = new Date();
	past.setMonth(past.getMonth() - 3);
	var recentMovie = "SELECT * FROM movie WHERE releaseDate > past AND releaseDate <= today;";
	connection.query(recentMovie, function(err, rows) {
		if (!err) {
		   	// console.log('The solution is: ', rows);
			var recent = [];
			if (rows != null) {
				//console.log(doc);
				for (var i = 0; i < rows.length; i++) {
					results.push(rows[i]);
					console.log(rows[i]);
				}
				// res.render("homepage", {recent:recent});
			}
		} else {
			console.log('Error while performing Query.');
		}
	});
}