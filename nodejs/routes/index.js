var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('homepage', {user:null, invalid:null});
});

router.get('/register', function(req, res, next) {
	res.render('register', {flag:false});
});

router.get('/search', function(req, res, next) {
	res.render('search', {results: null});
});

router.get('/profile', function(req, res, next) {
	res.render('profile', {results: null});
});

module.exports = router;


