var express = require('express');
var router = express.Router();
require('dotenv').config();

router.get('/', function(req, res, next) {

	const bot = req.app.get('bot');
	var users = bot.listUsers();
		
	res.render('amongUs', {
		discordUsers : users
	});	
});

router.post('/joinChannel', function(req, res, next) {
	
	const bot = req.app.get('bot');
	bot.joinChannel();

	res.render('commands', { title: 'Join Channel' });
});

router.post('/leaveChannel', function(req, res, next) {
	
	const bot = req.app.get('bot');
	bot.leaveChannel();

	res.render('commands', { title: 'Leave Channel' });
});

router.post('/muteAll', function(req, res, next) {
	
	const bot = req.app.get('bot');
	bot.muteAllUsers();

	res.render('commands', { title: 'Mute All Users' });
});

router.post('/unmuteAll', function(req, res, next) {
	
	const bot = req.app.get('bot');
	bot.unmuteAllUsers();

	res.render('commands', { title: 'Unmute All Users' });
});

router.post('/muteUser', function(req, res, next) {
	const userID = req.body.id;
	const bot = req.app.get('bot');
	bot.muteUser(userID);

	res.render('commands', { title: 'Mute User' });
});

router.post('/unmuteUser', function(req, res, next) {
	const userID = req.body.id;
	const bot = req.app.get('bot');
	bot.unmuteUser(userID);

	res.render('commands', { title: 'Unmute User' });
});

router.get('/listUsers', function(req, res, next) {
	
	const bot = req.app.get('bot');
	var users = bot.listUsers();
		
	res.send(JSON.stringify(users));
});

module.exports = router;
