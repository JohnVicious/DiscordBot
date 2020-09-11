require('dotenv').config();

const Discord = require('discord.js');
const bot = new Discord.Client();
const token = process.env.TOKEN;
const cmdPrefix = '!';

bot.on('ready', ()=>{
	console.log('Bot is online');
});

bot.on('message', msg=>{

	if(!msg.content.startsWith(cmdPrefix) || msg.author.bot) return;

	const args = msg.content.slice(cmdPrefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if(command === 'hello'){
		msg.channel.send('Hello World!');
	}else if(command === 'website'){
		msg.channel.send('https://www.johnklein.dev');
	}

});

bot.login(token);