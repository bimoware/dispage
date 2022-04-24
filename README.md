<div align="center"><h1>Dispage</h1></div>

> ## ⚠ Warning! ⚠ 
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

## Importing
### Javascript
```js
// Create a command to start the page system
const { PageSystem } = require('dispage')
const Discord = require('discord.js')
```
### Typescript
```ts
import PageSystem from 'dispage';
import Discord from 'discord.js';
```
### Sample example
```js
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

// Where the fun begins
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
## Properties
> Instead of (for example) setting `index` to 1 by hand. Use the build-in `setIndex` method. Same for `embeds`, `ended`, `id` etc.. `mainStyle` for example on the other hand can be overwritten ^^
| **Name** | **Type** | **Default** |
|:---:|:---:|:---:|
| `client` | `Client` |  |
| `index` | `number` | `0` |
| `id` | `string` |  |
| `embeds` | `MessageEmbed[]` | `[]` |
| `message` | `Message \| null` |  |
| `interaction` | `Interaction \| null` |  |
| `reply` | `Message` |  |
| `collector` | `InteractionCollector<ButtonInteraction>` |  |
| `ended` | `boolean` | `false` |
| `started` | `boolean` | `false` |
| `deleted` | `boolean` | `false` |
| `duration` | `number` | `60000` |
| `mainStyle` | `MessageButtonStyle` | `"PRIMARY"` |
| `buttons` | `MessageButtonOptions[]` | `MessageButtonOptions[]` |
| `footer` | `Function` | `(index,total) => "📜 Page "+index+"/"+total : ''` |
| `filter` | `Function` | `i => this.id === i.user.id` |

## Methods
> On the `Returns` column, `self` means that the methode returns the original instance of the class. Like MessageEmbed where we can call multiple times multiple methodes on the same variable.
| **Name** 	| **Arguments** 	| **Required** 	| **Returns** 	|
|:---:	|:---:	|:---:	|:---:	|
| `addButton` 	| `MessageButtonOptions` 	|  	| `self` 	|
| `removeButton` 	| `String` 	|  	| `self` 	|
| `editButton` 	| `String, MessageButtonOptions` 	|  	| `self` 	|
| `getRow` 	| `boolean` 	|  	| `MessageActionRow` 	|
| `setUserID` 	| `UserResolvable` 	|  	| `self` 	|
| `setFooter` 	| `Function` 	|  	| `self` 	|
| `setEmbeds` 	| `MessageEmbed[]` 	| ✅ 	| `self` 	|
| `addEmbed` 	| `MessageEmbed` 	|  	| `self` 	|
| `addEmbeds` 	| `MessageEmbed[]` 	|  	| `self` 	|
| `fixEmbeds` 	| `MessageEmbed[] \| MessageEmbed \| MessageEmbed[][]` 	|  	| `MessageEmbed[]` 	|
| `setDuration` 	| `Number` 	|  	| `self` 	|
| `addDuration` 	| `Number` 	|  	| `self` 	|
| `next` 	| ❌ 	|  	| `Promise` 	|
| `previous` 	| ❌ 	|  	| `Promise` 	|
| `setIndex` 	| `Number` 	|  	| `self` 	|
| `fixEmbedFooters` 	| ❌ 	|  	| `void` 	|
| `edit` 	| `MessageEditOptions` 	|  	| `Promise<Discord.Message>` 	|
| `disableButtons` 	| ❌ 	|  	| `void` 	|
| `end` 	| ❌ 	|  	| `void` 	|
| `delete` 	| ❌ 	|  	| `void` 	|
| `update` 	| ❌ 	|  	| `void` 	|
| `getOpts` 	| `Boolean` 	|  	| `MessageOptions` 	|
| `isMessage` 	| ❌ 	|  	| `boolean` 	|
| `isInteraction` 	| ❌ 	|  	| `boolean` 	|
| `canEdit` 	| ❌ 	|  	| `boolean` 	|
| `isValidCtx` 	| `Message \| Interaction` 	|  	| `boolean` 	|
| `checkForErrors` 	| `Message \| Interaction` 	|  	| `string[]` 	|
| `start` 	| `Message \| Interaction` 	| ✅ 	| `self` 	|

## Trouble
Having a problem using <a href="https://npmjs.com/package/dispage">**dispage**</a> ? Open an <a href="https://github.com/voxlinou1/dispage/issues">issue</a> on <a href="https://github.com/voxlinou1/dispage">Github<a> & Don't hesitate to send a message to *`Vox#6198`* !
## Credits
Made by voxlinou1 (*`Vox#6198`* on discord)