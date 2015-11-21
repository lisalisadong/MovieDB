var MongoClient = require('mongodb').MongoClient;

function getResults(db, callback, query) {
	var queryStr = {};
	queryStr["hours." + query[0] + ".open"] = {$lte: query[1]};
	queryStr["hours." + query[0] + ".close"] = {$gte: query[2]};
	// console.log(queryStr);

	var cursor = db.collection('business').find(queryStr);
	var results = [];
	cursor.each(function(err, doc) {
		if (doc != null) {
			//console.log(doc);
			results.push(doc.name);
		} else {
			callback(results);
		}
	});
};

function generateHourString(integer) {
	if (integer < 10) {
		return "0" + integer + ":00";
	} else {
		return integer + ":00";
	}
}

function generateResponse(req, res) {
	var day = req.query.selectpicker[0];
	var hour = parseInt(req.query.selectpicker[1]);
	var start = generateHourString(hour);
	var end = generateHourString(hour + 1);
	var query = [day, start, end];

	// The url to connect to the mongodb instance
	var url = 'mongodb://cis550student:cis550hw3@ds051933.mongolab.com:51933/cis550hw3';
	MongoClient.connect(url, function(err, db) {
		// If there is an error, log the error and render the error page 
		if(err != null) {
			console.log("Connection to server failed.");
			db.close();
			res.render('error', {
				message: "Connection to server failed.",
				error: err
			});
		}
		// If there is no error while connecting, proceed further
		else {
			console.log("Connected correctly to server.");
			getResults(db, function(results) {
				db.close();
				res.render('work.ejs', {results: results});
			}, query);
		}
	});
}

exports.displayResponse = function(req, res){
	generateResponse(req, res);
};