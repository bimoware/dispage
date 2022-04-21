<div align="center"><h1>Dispage</h1></div>

> ## ⚠ Warning ⚠
> This is a really new package so even if it's been tested a lot and the sample code provided here works perfecty, there could still be some bugs or issues you can report <a href="https://github.com/voxlinou1/dispage/issues">here</a> !

## About

dispage is a powerful [Node.js](https://nodejs.org) module that allows you to easily create button to switch over embed pages on a discord message.
- [discord.js](https://npmjs.com/package/discord.js)
- [Discord API](https://discord.com/developers/docs/intro).

## Dependencies

**Needs discord.js v13 or higher.**
If discord.js isn't installed yet :
```sh-session
npm install discord.js
```

## Installation
```sh-session
npm i dispage
```

## Example usage

### Main
```js
// Create a command to start the page system
const { PageSystem } = require('dispage')
const Discord = require('discord.js')
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});
// Make sure our bot is ready
client.on('ready', () => console.log('I am ready!'))
// Of course, log it in with our token
client.login('TOKEN')
```
### Command
```js
// Create a command to start the page system
client.on('messageCreate', message =>{
    if(message.content === "!test"){
        // Create the embeds that will be used.
        const embeds = [
            new Discord.MessageEmbed().setDescription('embed 1'),
            new Discord.MessageEmbed().setDescription('embed 2'),
            new Discord.MessageEmbed().setDescription('embed 3')
        ];
        // Create the page system
        new PageSystem()
          // Add the embeds previously created
          .setEmbeds(embeds)
          // In the end, start the page system on the message
          .start(message)
            // In case there is an error
            .catch(console.error);
    }
  });
```
## Trouble
Having a problem using <a href="https://npmjs.com/package/dispage">**dispage**</a> ? Don't hesitate to send a message to *Vox#6198* !