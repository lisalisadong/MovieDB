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


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('homepage');
});

router.get('/register', function(req, res, next) {
	res.render('register');
});

router.get('/search', function(req, res, next) {
	res.render('search', {results: null});
});

router.get('/work', function(req, res, next) {
	res.render('work', {results: null});
});




module.exports = router;
