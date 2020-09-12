require('dotenv').config();

class Bot{
	
	constructor()
	{
		const Discord = require('discord.js');
		this.token = process.env.TOKEN;
		const cmdPrefix = '!';
		const botMsg = null;
		this.bot = new Discord.Client();

		this.bot.on('ready', ()=>{
			console.log('Bot is online');
		});		
		
		this.bot.on('message', msg => {			
			this.basicTextCommands(msg,cmdPrefix);
		});

	}
	
	login()
	{		
		if(!this.token){
			console.log("No bot token provided");
			return;
		}
		this.bot.login(this.token);
	}
	
	basicTextCommands(msg,cmdPrefix)
	{
		if(!msg.content.startsWith(cmdPrefix) || msg.author.bot) return;
		const args = msg.content.slice(cmdPrefix.length).split(/ +/);
		const command = args.shift().toLowerCase();

		if(command === 'hello'){
			msg.channel.send('Hello World!');
		}else if(command === 'website'){
			msg.channel.send('https://www.johnklein.dev');
		}else if(command === 'amongus' || command === 'au'){
			msg.channel.send('https://www.johnklein.dev/DiscordBot/AmongUs');
		}

	}
	
	muteAllUsers()
	{
		this.bot.channels.cache.get(process.env.BOTTEXTCHANNEL).send('Mute All Users');
	}	
}

module.exports = Bot;