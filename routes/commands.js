var express = require('express');
var router = express.Router();
const commands = require('../commands/botCommands.js');

router.get('/', function(req, res, next) {

	res.render('amongUs');
});

router.post('/joinChannel', function(req, res, next) {
	
	const bot = req.app.get('bot');
	const botCommands = new commands(bot);
	botCommands.joinChannel();

	res.render('commands', { title: 'Join Channel' });
});

router.post('/leaveChannel', function(req, res, next) {
	
	const bot = req.app.get('bot');
	const botCommands = new commands(bot);
	botCommands.leaveChannel();

	res.render('commands', { title: 'Leave Channel' });
});

router.post('/muteAll', function(req, res, next) {
	
	const bot = req.app.get('bot');
	const botCommands = new commands(bot);
	botCommands.muteAllUsers();

	res.render('commands', { title: 'Mute All Users' });
});

router.post('/unmuteAll', function(req, res, next) {
	
	const bot = req.app.get('bot');
	const botCommands = new commands(bot);
	botCommands.unmuteAllUsers();

	res.render('commands', { title: 'Unmute All Users' });
});

router.get('/listUsers', function(req, res, next) {
	
	const bot = req.app.get('bot');
	const botCommands = new commands(bot);
	var users = botCommands.listUsers();
		
	res.send(JSON.stringify(users));
});

module.exports = router;
