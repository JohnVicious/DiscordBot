var express = require('express');
var router = express.Router();
const commands = require('../commands/botCommands.js');

router.get('/', function(req, res, next) {

	res.render('commands', { title: 'Need a command' });
});

router.get('/muteAll', function(req, res, next) {
	
	const bot = req.app.get('bot');
	const botCommands = new commands(bot);
	botCommands.muteAllUsers();

	res.render('commands', { title: 'Mute All Users' });
});

module.exports = router;
