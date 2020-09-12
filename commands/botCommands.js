class Commands{

    constructor(discordBot)
    {        
		this.bot = discordBot;
    }

    muteAllUsers(){
		this.bot.muteAllUsers();        
    }
        
}

module.exports = Commands;