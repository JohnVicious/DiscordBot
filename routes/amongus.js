var express = require('express');
var router = express.Router();
require('dotenv').config();

router.get('/', function(req, res, next) {

	const bot = req.app.get('bot');
	var users = bot.listUsers();
		
	var username = false;
	
	if(req.session.username){
		username = req.session.username;
	}	
		
	var prod = process.env.PRODUCTION == 'true' ? true : false;
	var assetLoc = '.';
	if(prod){
		assetLoc = '/DiscordBot';
	}	
		
	res.render('amongUs', {
		discordUsers : users,
		name: username,
		production: assetLoc
	});	
	
});

router.post('/joinChannel', function(req, res, next) {
	
	const bot = req.app.get('bot');
	bot.joinChannel();
	
});

router.post('/leaveChannel', function(req, res, next) {
	
	const bot = req.app.get('bot');
	bot.leaveChannel();
	
});

router.post('/muteAll', function(req, res, next) {
	
	const bot = req.app.get('bot');
	bot.muteAllUsers();
	
});

router.post('/unmuteAll', function(req, res, next) {
	
	const bot = req.app.get('bot');
	bot.unmuteAllUsers();
	
});

router.post('/muteUser', function(req, res, next) {
	
	const userID = req.body.id;
	const bot = req.app.get('bot');
	bot.muteUser(userID);
	
});

router.post('/unmuteUser', function(req, res, next) {
	
	const userID = req.body.id;
	const bot = req.app.get('bot');
	bot.unmuteUser(userID);
	
});

router.get('/listUsers', function(req, res, next) {
	
	const bot = req.app.get('bot');
	var users = bot.listUsers();
		
	res.send(JSON.stringify(users));
	
});

module.exports = router;
