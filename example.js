const Discord = require('discord.js')
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});
const Dispage = require('dispage')

client.on('messageCreate', message => {
    if (message.content === "!test") {

        const embeds = [
            'embed 1',
            'embed 2 !!',
            'embed 3 !?!',
            'embed 4 !!!!!!!!?'
        ].map(desc => new Discord.MessageEmbed().setDescription(desc))
        
        new Dispage()
            .setEmbeds(embeds)
            .start(message)
            .catch(console.error);
    }
});

client.login('TOKEN_HERE')