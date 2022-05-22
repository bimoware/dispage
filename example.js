const { Client, Intents, MessageEmbed } = require('discord.js')
const Dispage = require('dispage')
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.on('messageCreate', message => {
    if (message.content === "!test") {

        const embeds = [
            'embed 1',
            'embed 2 !!',
            'embed 3 !?!',
        ].map(desc => new MessageEmbed().setDescription(desc))
        
        new Dispage()
            .setEmbeds(embeds)
            .start(message)
            .catch(console.error);
    }
});

client.login('TOKEN_HERE')