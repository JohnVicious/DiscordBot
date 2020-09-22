var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');
var prod = process.env.PRODUCTION === 'true' ? true : false;
var assetLoc = '.';
var postLoc = '/';
var redirectLoc = '/';
if(prod){
	assetLoc = '/DiscordBot';
    postLoc = '';
    redirectLoc = '/DiscordBot';
}


/* GET home page. */
router.get('/', function(req, res, next) {	
	
	var username = false;
	
	if(req.session.username){
		username = req.session.username;
	}
	
	res.render('index', { title: 'Discord Bot', name: username, production: assetLoc });
});

router.get('/login', function(req, res, next) {
	
	res.render('login', { title: 'Login', production: postLoc });
});

router.get('/register', function(req, res, next) {
	
	res.render('register', { title: 'Register', production: postLoc });
});

router.post('/login', function(req,res,next) {
	var dboptions = {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE
	};
	var connection = mysql.createConnection(dboptions);
	
	var email = req.body.email;
	var password = req.body.password;
	if (email && password) {
		connection.query('SELECT email, username FROM users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.email = email;
				req.session.username = results[0].username;
				return res.redirect(redirectLoc);
			} else {
				res.send('Incorrect Email and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Email and Password!');
		res.end();
	}
	
});


router.get('/logout', function(req,res,next) {
	req.session.destroy(err => {
		if(err){
			return res.redirect(redirectLoc);
		}
		
		res.clearCookie('discordBot_sessionid');
		res.redirect(redirectLoc);
	});
});

module.exports = router;
