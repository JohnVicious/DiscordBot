require('dotenv').config();

class Bot{
	
	constructor()
	{
		const Discord = require('discord.js');
		const cmdPrefix = '!';
		const botMsg = null;
		
		this.token = process.env.TOKEN;
		this.bot = new Discord.Client();
		
		const that = this;		
		const WebSocket = require('ws') 
		const wss = new WebSocket.Server({ port: 6969 })
		 
		wss.on('connection', ws => {		
		
			//If the channel was joined/left, update user list for AmongUs		
			that.bot.on("voiceStateUpdate", function(oldMember, newMember){
			
				if(oldMember.channelID == process.env.AMONGUSCHANNEL || newMember.channelID == process.env.AMONGUSCHANNEL){
					ws.send('member_activity');		
				}
			
			});
		})		

		this.bot.on('ready', ()=>{
			console.log('Bot is online');
		});		
		
		this.bot.on('message', msg => {			
			that.basicTextCommands(msg,cmdPrefix);
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
	
	joinChannel()
	{
		// this.bot.channels.cache.get(process.env.BOTTEXTCHANNEL).send('Join Channel');
		
		const channel = this.bot.channels.cache.get(process.env.AMONGUSCHANNEL);
		
		if (!channel) return console.error("The channel does not exist!");
		channel.join().then(connection => {
			// Yay, it worked!
			console.log("Successfully joined channel.");
		}).catch(e => {
			// Oh no, it errored! Let's log it to console :)
			console.error(e);
		});
		
	}
	
	leaveChannel()
	{		
		// this.bot.channels.cache.get(process.env.BOTTEXTCHANNEL).send('Leave Channel');
		
		const channel = this.bot.channels.cache.get(process.env.AMONGUSCHANNEL);
		channel.leave();
	}
	
	muteAllUsers()
	{
		// this.bot.channels.cache.get(process.env.BOTTEXTCHANNEL).send('Mute All Users');
		
		const channel = this.bot.channels.cache.get(process.env.AMONGUSCHANNEL);
        for (let member of channel.members) {			
			if(!member[1].user.bot){
				member[1].voice.setMute(true);
			}
        }
	}	
	
	unmuteAllUsers()
	{
		// this.bot.channels.cache.get(process.env.BOTTEXTCHANNEL).send('Unmute All Users');
		
		const channel = this.bot.channels.cache.get(process.env.AMONGUSCHANNEL);
        for (let member of channel.members) {		
			if(!member[1].user.bot){
				member[1].voice.setMute(false);
			}
        }
	}
	
	muteUser(userID)
	{
		// this.bot.channels.cache.get(process.env.BOTTEXTCHANNEL).send('Mute All Users');
		
		const channel = this.bot.channels.cache.get(process.env.AMONGUSCHANNEL);
        for (let member of channel.members) {
			if(member[1].user.id == userID){
				member[1].voice.setMute(true);
			}
        }
	}	
	
	unmuteUser(userID)
	{
		// this.bot.channels.cache.get(process.env.BOTTEXTCHANNEL).send('Unmute All Users');
		
		const channel = this.bot.channels.cache.get(process.env.AMONGUSCHANNEL);
        for (let member of channel.members) {
			if(member[1].user.id == userID){
				member[1].voice.setMute(false);
			}
        }
	}
	
	listUsers()
	{
		const channel = this.bot.channels.cache.get(process.env.AMONGUSCHANNEL);
		const users = [];
        for (let member of channel.members) {
			if(!member[1].user.bot){
				users.push({
					"username":member[1].user.username,
					"id":member[1].user.id,
					"muted": member[1].voice.serverMute
				});
			}
        }
		
		return users;
	}	
	
}

module.exports = Bot;