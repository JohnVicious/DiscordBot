class Commands{

    constructor(discordBot)
    {        
		this.bot = discordBot;
    }
	
	joinChannel(){
		this.bot.joinChannel();
	}
	
	leaveChannel(){
		this.bot.leaveChannel();
	}

    muteAllUsers(){
		this.bot.muteAllUsers();        
    }
	
    unmuteAllUsers(){
		this.bot.unmuteAllUsers();        
    }
	
    listUsers(){
		return this.bot.listUsers();        
    }
        
}

module.exports = Commands;