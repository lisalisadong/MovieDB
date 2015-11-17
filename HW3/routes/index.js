var express = require('express');
var router = express.Router();

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
