var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var today = new Date();
	var date = today.getFullYear();
	
	res.render('index', { title: 'Express', currentDate: date });
});

module.exports = router;
