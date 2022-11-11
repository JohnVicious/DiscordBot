require('dotenv').config();
const FS = require('fs');
const say = require('say');

class Bot{
	
	constructor()
	{
		const Discord = require('discord.js');
		const cmdPrefix = '!';
		const botMsg = null;
		
		this.token = process.env.TOKEN;
		this.bot = new Discord.Client();
		this.discordUsers = [];
		
		const that = this;		
		const WebSocket = require('ws');
		const wss = new WebSocket.Server({ port: 6969 });		 
				 
		wss.on('connection', ws => {		
		
			//If the channel was joined/left, update user list for AmongUs		
			that.bot.on("voiceStateUpdate", function(oldMember, newMember){
			
				if(oldMember.channelID == process.env.AMONGUSCHANNEL || newMember.channelID == process.env.AMONGUSCHANNEL){
					
					//Member has joined the channel
					if(newMember.channelID == process.env.AMONGUSCHANNEL){
						// console.log(newMember.member.user.username);
						if(newMember.member.user.username !== "CasterlyBot"){
							that.sayUserJoined(newMember.member.user.username, "joined");
						}
					}else{						
						// console.log(newMember.member.user.username);
						if(newMember.member.user.username !== "CasterlyBot"){
							that.sayUserJoined(newMember.member.user.username, "left");
						}
					}			
					
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

		if(command === 'website'){
			msg.channel.send('https://www.johnklein.dev');
		}else if(command === 'amongus' || command === 'au'){
			msg.channel.send('https://www.johnklein.dev/DiscordBot/AmongUs');
		}

	}
	
	joinChannel()
	{
		
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
		const channel = this.bot.channels.cache.get(process.env.AMONGUSCHANNEL);
		channel.leave();
	}
	
	muteAllUsers()
	{
		
		const channel = this.bot.channels.cache.get(process.env.AMONGUSCHANNEL);
        for (let member of channel.members) {			
			if(!member[1].user.bot){
				
				for(let user of this.discordUsers){
					if(user.uid == member[1].user.id && user.alive){						
						member[1].voice.setMute(true);
					}
				}
				
			}
        }
	}	
	
	unmuteAllUsers()
	{
		
		const channel = this.bot.channels.cache.get(process.env.AMONGUSCHANNEL);
        for (let member of channel.members) {		
			if(!member[1].user.bot){
				
				for(let user of this.discordUsers){
					if(user.uid == member[1].user.id && user.alive){						
						member[1].voice.setMute(false);
					}
				}
				
			}
        }
	}
	
	muteUser(userID)
	{
		
		const channel = this.bot.channels.cache.get(process.env.AMONGUSCHANNEL);
        for (let member of channel.members) {
			if(member[1].user.id == userID){
				member[1].voice.setMute(true);
			}
        }
	}	
	
	unmuteUser(userID)
	{
		const channel = this.bot.channels.cache.get(process.env.AMONGUSCHANNEL);
        for (let member of channel.members) {
			if(member[1].user.id == userID){
				member[1].voice.setMute(false);
			}
        }
	}
	
	markAliveUser(userID)
	{
		for(let user of this.discordUsers){
			if(user.uid == userID){
				user.alive = true;
				this.unmuteUser(userID);
			}
		}
	}	
	
	markDeadUser(userID)
	{
		for(let user of this.discordUsers){
			if(user.uid == userID){
				user.alive = false;
				this.muteUser(userID);
			}
		}
	}
	
	allAlive()
	{
		for(let user of this.discordUsers){
			user.alive = true;		
			this.unmuteUser(user.uid);
		}
	}
	
	listUsers()
	{
		const channel = this.bot.channels.cache.get(process.env.AMONGUSCHANNEL);
		const users = [];
        for (let member of channel.members) {
			if(!member[1].user.bot){
				
				var discordUser = null;
				for(let user of this.discordUsers){
					if(user.uid == member[1].user.id){
						discordUser = user;
					}
				}
				if(!discordUser){
					var discordUser = {
						'uid': member[1].user.id,
						'alive': true
					};
					this.discordUsers.push(discordUser);
				}
				users.push({
					"username":member[1].user.username,
					"id":member[1].user.id,
					"muted": member[1].voice.serverMute,
					"alive": discordUser.alive,
					"avatarURL": "https://cdn.discordapp.com/avatars/" + member[1].user.id + "/" + member[1].user.avatar + ".png"
				});
			}
        }
		return users;
	}
	
	sayUserJoined(username,type)
	{
		const channel = this.bot.channels.cache.get(process.env.AMONGUSCHANNEL);
		
		if (!FS.existsSync('./temp')){
			FS.mkdirSync('./temp');
		}
		const timestamp = new Date().getTime();
		const soundPath = `./temp/${timestamp}.wav`;
		say.export(username + " has " + type + " the channel.", null, 1, soundPath, (err) => {
			if (err) {
				console.error(err);
				return;
			}else{
				channel.join().then((connection) => {
					const dispatcher = connection.play(soundPath);
					dispatcher.on('finish', ()=>{
						connection.disconnect();
						FS.unlinkSync(soundPath);
					})
				}).catch((err) => {
					console.error(err);
				});
			}
		});

	}
	
}

module.exports = Bot;