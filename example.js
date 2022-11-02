const Dispage = require('dispage')
const Discord = require('discord.js')
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => console.log('I am ready!'))

client.on('messageCreate', message => {
    if (message.content === "!test") {

        const embeds = [
            'embed 1',
            'embed 2 !!',
            'embed 3 !?!',
            'embed 4 !!!!!!!!?'
        ].map((desc, i) => new Discord.EmbedBuilder()
            .setTitle(`📃 Page #${i + 1}`)
            .setColor('BLURPLE')
            .setDescription(desc))

        new Dispage()
            .setEmbeds(embeds)
            // This style will be given to every button that doesn't have a specific style
            .setMainStyle('Secondary')
            .editButton('previous', { emoji: "824240081409540157", label: "Previous" })
            // Setting a property (here, style) to null will remove it. 👇
            .editButton('stop', { emoji: "961338862259544114", label: null })
            .editButton('next', { emoji: "824240024509874186", label: "Next" })
            // We can edit as many buttons as we want and as many times as we wish
            .editButton('stop', { style : "Success" })
            // You can create your own custom button
            .addButton({
                label: "Go to Message",
                style: "Link",
                url: "https://discord.com/channels/937626764916719626/937633296878293002/978956060972974101"
            })
            // Finally after having setup everything. We can start
            .start(message)
    }
});

client.login('YOUR TOKEN HERE')