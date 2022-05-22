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
const Dispage = require('dispage')
const { Client, Intents, MessageEmbed } = require('discord.js')
```
### Typescript
```ts
import PageSystem from 'dispage';
import Discord from 'discord.js';
```
### Sample example
```js
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
```
![Simple example](https://iili.io/Xf3MhP.png)

### If you want to push things further...
```js
        const embeds = [
            'embed 1',
            'embed 2 !!',
            'embed 3 !?!',
        ].map(desc => new MessageEmbed().setDescription(desc).setColor('#))
        
        new Dispage()
            .setEmbeds(embeds)
            .editButton('previous', { emoji : "824240081409540157", label: "Previous"})
            .editButton('stop', { emoji : "824240081409540157" })
            .editButton('next', { emoji : "824240024509874186", label: "Next"})
            .start(message)
            .catch(console.error);
```
## Properties
> Instead of (for example) setting `index` to 1 by hand. Use the build-in (`setIndex`) method. Same for `embeds` (.setEmbeds), `ended` (.end()), duration (.setDuration) etc..

| **Property** | **Type** | **Default Value** |
|---|---|---|
| `client` | `Client` | `null` |
| `index` | `number` | `0` |
| `embeds` | `Embed[]` | `[]` |
| `message` | `Message` | `null` |
| `interaction` | `Interaction` | `null` |
| `collector` | `InteractionCollector<ButtonInteraction>` | `null` |
| `reply` | `Message` | `null` |
| `ended` | `boolean` | `false` |
| `started` | `boolean` | `false` |
| `deleted` | `boolean` | `false` |
| `duration` | `number` | `60000` |
| `mainStyle` | `MessageButtonStyle` | `"PRIMARY"` |
| `buttons` | `MessageButtonOptions[]` | `MessageButtonOptions[]` |

## Methods
> On the `Return` column, `this` means that the methode returns the original instance of the class. Like discord.js's MessageEmbed where we can call multiple times multiple methods following themselves. Like this: `new Dispage().setMainStyle('SECONDARY').setIndex(2)` etc..

> [PS]: [⚠] MEANS **__[DEPRECATED]__** (Meaning you shouldn't use it anymore)

|        **Name**       |          **Arguments**         |         **Return**        |
|:---------------------:|:------------------------------:|:--------------------------:|
|     `setMainStyle`    |      `MessageButtonStyle`      |           `this`           |
| `showDisabledButtons` |            `boolean`           |           `this`           |
|      `removeUser`     |             `User`             |           `this`           |
|       `addUser`       |             `User`             |           `this`           |
|       `setUser`       |             `User`             |           `this`           |
|     `setUserID` ⚠     |            `string`            |           `this`           |
|      `addButton`      |     `MessageButtonOptions`     |           `this`           |
|     `removeButton`    |            `string`            |           `this`           |
|      `editButton`     | `string, MessageButtonOptions` |           `this`           |
|       `getRows`       |            `boolean`           |    `MessageActionRow[]`    |
|      `setEmbeds`      |            `Embed[]`           |           `this`           |
|       `addEmbed`      |             `Embed`            |           `this`           |
|      `addEmbeds`      |            `Embed[]`           |           `this`           |
|      `_fixEmbeds`     |  `Embed[] / Embed / Embed[][]` |          `Embed[]`         |
|     `setDuration`     |            `number`            |           `this`           |
|     `addDuration`     |            `number`            |           `this`           |
|         `next`        |                ❌               |       `Promise<this>`      |
|       `previous`      |                ❌               |       `Promise<this>`      |
|     `changeToPage`    |            `number`            |     `Promise<Message>`     |
|    `doesIndexExist`   |            `number`            |          `boolean`         |
|       `setIndex`      |            `Number`            |           `this`           |
|         `edit`        |      `MessageEditOptions`      | `Promise<Discord.Message>` |
|    `disableButtons`   |                ❌               |           `void`           |
|         `end`         |                ❌               |           `void`           |
|        `delete`       |                ❌               |           `void`           |
|        `update`       |                ❌               |           `void`           |
|       `getOpts`       |            `Boolean`           |      `MessageOptions`      |
|      `isMessage`      |                ❌               |          `boolean`         |
|    `isInteraction`    |                ❌               |          `boolean`         |
|       `canEdit`       |                ❌               |          `boolean`         |
|      `isValidCtx`     |            `Context`           |          `boolean`         |
|    `checkForErrors`   |            `Context`           |         `string[]`         |
|        `start`        |            `Context`           |       `Promise<this>`      |

## Trouble
Having a problem using <a href="https://npmjs.com/package/dispage">**dispage**</a> ? Open an <a href="https://github.com/voxlinou1/dispage/issues">issue</a> on <a href="https://github.com/voxlinou1/dispage">Github<a> & Don't hesitate to send a message to the discord tag below 👇 !

## Credits
Made by voxlinou1 (*`Vox#6198`* on discord)
