class Commands{

    constructor()
    {
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
                this.sendToChannel(msg.channel,'Hello World');
            }else if(command === 'website'){
                this.sendToChannel(msg.channel,'https://www.johnklein.dev');
            }
            
        });
        
        if(token)
        {
            bot.login(token);
        }

    }

    sendToChannel(channel,message)
    {
        try{
            msg.channel.send(message);
        }
        catch(e)
        {
            console.error(e);
        }
    }

    muteUsers(){
        
      
        
            // msg.channel.send('Look for users and mute them');

            console.log('mut ethe users');

        
    }
        
    runCommmand(commandName){
            console.log('bot run: ' + commandName);
    }
}

module.exports = Commands;