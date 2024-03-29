require('dotenv').config();
const FS = require('fs');
const say = require('say');
var txtomp3 = require('text-to-mp3');

class Bot{
	
	constructor()
	{
		const Discord = require('discord.js');
		const cmdPrefix = '!';
		const botMsg = null;
		const usersList = require('./nicknames.json');

		this.users = usersList.users;
		this.token = process.env.TOKEN;
		this.bot = new Discord.Client();
		this.discordUsers = [];
		
		const that = this;		
		const WebSocket = require('ws');
		const wss = new WebSocket.Server({ port: 6969 });		 
		
		//Website connection stuff, used for AmongUs
		wss.on('connection', ws => {		
			//If the channel was joined/left, update user list for AmongUs		
			that.bot.on("voiceStateUpdate", (oldMember, newMember) => {
				if(process.env.AMONGUSCHANNEL === oldMember.channelID || process.env.AMONGUSCHANNEL === newMember.channelID){
					if(!(oldMember.member.user.username === "CasterlyBot" || newMember.member.user.username === "CasterlyBot")){						
						if (newMember.channelID === process.env.AMONGUSCHANNEL && newMember.channelID !== oldMember.channelID) {
							ws.send('member_activity');		
						}else if(oldMember.channelID != null && newMember.channelID != null && newMember.channelID != oldMember.channelID){
							ws.send('member_activity');		
						}
						if(oldMember.channelID === null || newMember.channelID === null) {
							ws.send('member_activity');		
						}
					}					
				}			
			});
		})		

		//Bot is ready, lets do our stuff
		this.bot.on('ready', ()=>{
			console.log('Bot is online',Date.now());
				
			this.bot.on("voiceStateUpdate", (oldMember, newMember) => {
				// const channelsWeCareAbout = [process.env.AMONGUSCHANNEL,process.env.MAINCHANNEL,process.env.CODINGCHANNEL];
				const channelsWeCareAbout = [process.env.MAINCHANNEL];
				if(channelsWeCareAbout.includes(oldMember.channelID) || channelsWeCareAbout.includes(newMember.channelID)){
					if(!(oldMember.member.user.username === "CasterlyBot" || newMember.member.user.username === "CasterlyBot")){		
										
						if (newMember.channelID === process.env.MAINCHANNEL && newMember.channelID !== oldMember.channelID) {
							that.sayMsg(newMember.member.user.username, "joined");
						}else if(oldMember.channelID != null && newMember.channelID != null && newMember.channelID != oldMember.channelID){
							//user switched channels
							that.sayMsg(newMember.member.user.username, "left");
						}
						if(oldMember.channelID === null || newMember.channelID === null) {
							//user joined
							that.sayMsg(newMember.member.user.username, "left");
						}
					}		
				}
			});
		
			this.bot.on('message', msg => {			
				that.basicTextCommands(msg,cmdPrefix);
			});
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
		}else if(command === 'vcmsg'){
			const txtString = msg.content.slice(7).toLowerCase();

			this.sayMsg(txtString, "vcmsg");
		}

	}
	
	joinChannel()
	{
		
		const channel = this.bot.channels.cache.get(process.env.MAINCHANNEL);
		
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
		const channel = this.bot.channels.cache.get(process.env.MAINCHANNEL);
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
	
	sayMsg(text,type)
	{
		const channel = this.bot.channels.cache.get(process.env.MAINCHANNEL);

		if (!FS.existsSync('./temp')){
			FS.mkdirSync('./temp');
		}
		const timestamp = new Date().getTime();
		const soundPath = `./temp/${timestamp}.mp3`;

		let textString = ''
		if(type === "joined" || type === "left"){
			let nickname = text;

			const foundUser = this.users.find((user)=>{
				return user.username === nickname
			});
			if(foundUser){
				nickname = foundUser.nickname;
			}

			textString = nickname + " has " + type + " the channel.";
		}else if(type === "vcmsg"){
			textString = text;
		}

		const langOpt = 'en-AU';
		
		if(process.platform == "win32"){
			say.export(textString, null, 1, soundPath, (err) => {
				if (err) {
					console.error(err);
					return;
				}else{
					channel.join().then((connection) => {
						const dispatcher = connection.play(soundPath);
						dispatcher.on('finish', ()=>{
							FS.unlinkSync(soundPath);
						})
					}).catch((err) => {
						console.error(err);
					});
				}
			});	
		}
		if(process.platform == "linux"){
			txtomp3.getMp3(textString,langOpt).then(function(binaryStream){
				var file = FS.createWriteStream(soundPath); // write it down the file
				file.write(binaryStream);
				file.end();
				
				channel.join().then((connection) => {
					const dispatcher = connection.play(soundPath);
					dispatcher.on('finish', ()=>{
						FS.unlinkSync(soundPath);
					})
				}).catch((err) => {
					console.error(err);
				});
			})
			.catch(function(err){
				console.log("Error", err);
			});
		}

	}
	
}

module.exports = Bot;