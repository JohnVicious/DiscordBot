var express = require('express');
var router = express.Router();
const commands = require('../commands/botCommands.js');
const botCommands = new commands();

router.get('/', function(req, res, next) {
  
  res.render('commands', { title: 'Need a command' });
});

router.get('/muteAll', function(req, res, next) {
  botCommands.muteUsers();
  
  res.render('commands', { title: 'Mute All Users' });
});

module.exports = router;
