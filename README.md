<div align="center"><h1>Dispage</h1></div>

## About

dispage is a powerful [Node.js](https://nodejs.org) module that allows you to easily create button to switch over embed pages on a discord message.
- [discord.js](https://npmjs.com/package/discord.js)
- [Discord API](https://discord.com/developers/docs/intro).

## Dependencies

**Needs discord.js v14.6.0 or higher.**
If discord.js isn't installed yet :
```sh-session
npm install discord.js@latest
```

## Installation
```sh-session
npm i dispage
```

## Importing
### Javascript
```js
const Dispage = require('dispage')
```
### Typescript
```ts
import Dispage from 'dispage';
```
### Simple example
```js
const embeds = [
    new MessageEmbed().setDescription('Embed #1'),
    new MessageEmbed().setDescription('Embed #2')
];
return new Dispage()
    .setEmbeds(embeds)
    .start(message)
```
![Simple example](https://iili.io/Xf3MhP.png)

### If you want to push things further...
```js
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
```

![Page 1](https://iili.io/XnAgvR.png)
![Page 2](https://iili.io/XnAUYv.png)

## Properties
> Instead of (for example) setting `index` to 1 by hand. Use the build-in (`setIndex`) method. Same for `embeds` (.setEmbeds), `ended` (.end()), duration (.setDuration) etc..

| **Property**  | **Type**                                  | **Default Value**        |
| ------------- | ----------------------------------------- | ------------------------ |
| `client`      | `Client`                                  | `null`                   |
| `index`       | `number`                                  | `0`                      |
| `embeds`      | `Embed[]`                                 | `[]`                     |
| `message`     | `Message`                                 | `null`                   |
| `interaction` | `Interaction`                             | `null`                   |
| `collector`   | `InteractionCollector<ButtonInteraction>` | `null`                   |
| `reply`       | `Message`                                 | `null`                   |
| `ended`       | `boolean`                                 | `false`                  |
| `started`     | `boolean`                                 | `false`                  |
| `deleted`     | `boolean`                                 | `false`                  |
| `duration`    | `number`                                  | `60000`                  |
| `mainStyle`   | `MessageButtonStyle`                      | `"PRIMARY"`              |
| `buttons`     | `MessageButtonOptions[]`                  | `MessageButtonOptions[]` |

## Methods
> On the `Return` column, `this` means that the methode returns the original instance of the class. Like discord.js's MessageEmbed where we can call multiple times multiple methods following themselves. Like this: `new Dispage().setMainStyle('SECONDARY').setIndex(2)` etc..

**__*PS*__: ⚠ MEANS __[DEPRECATED]__ (Meaning you shouldn't use it anymore)**

|       **Name**        |         **Arguments**          |         **Return**         |
| :-------------------: | :----------------------------: | :------------------------: |
|    `setMainStyle`     |      `MessageButtonStyle`      |           `this`           |
| `showDisabledButtons` |           `boolean`            |           `this`           |
|     `removeUser`      |             `User`             |           `this`           |
|       `addUser`       |             `User`             |           `this`           |
|       `setUser`       |             `User`             |           `this`           |
|      `addButton`      |     `MessageButtonOptions`     |           `this`           |
|    `removeButton`     |            `string`            |           `this`           |
|     `editButton`      | `string, MessageButtonOptions` |           `this`           |
|       `getRows`       |           `boolean`            |    `MessageActionRow[]`    |
|      `setEmbeds`      |           `Embed[]`            |           `this`           |
|      `addEmbed`       |            `Embed`             |           `this`           |
|      `addEmbeds`      |           `Embed[]`            |           `this`           |
|     `_fixEmbeds`      | `Embed[] / Embed / Embed[][]`  |         `Embed[]`          |
|     `setDuration`     |            `number`            |           `this`           |
|     `addDuration`     |            `number`            |           `this`           |
|        `next`         |               ❌                |      `Promise<this>`       |
|      `previous`       |               ❌                |      `Promise<this>`       |
|    `changeToPage`     |            `number`            |     `Promise<Message>`     |
|   `doesIndexExist`    |            `number`            |         `boolean`          |
|      `setIndex`       |            `Number`            |           `this`           |
|        `edit`         |      `MessageEditOptions`      | `Promise<Discord.Message>` |
|   `disableButtons`    |               ❌                |           `void`           |
|         `end`         |               ❌                |           `void`           |
|       `delete`        |               ❌                |           `void`           |
|       `update`        |               ❌                |           `void`           |
|       `getOpts`       |           `Boolean`            |      `MessageOptions`      |
|      `isMessage`      |               ❌                |         `boolean`          |
|    `isInteraction`    |               ❌                |         `boolean`          |
|       `canEdit`       |               ❌                |         `boolean`          |
|     `isValidCtx`      |           `Context`            |         `boolean`          |
|   `checkForErrors`    |           `Context`            |         `string[]`         |
|        `start`        |           `Context`            |      `Promise<this>`       |

## Trouble
Having a problem using <a href="https://npmjs.com/package/dispage">**dispage**</a> ? Open an <a href="https://github.com/voxlinou1/dispage/issues">issue</a> on <a href="https://github.com/voxlinou1/dispage">Github<a> & Don't hesitate to send a message to the discord tag below 👇 !

## Credits
Made by voxlinou1 (*`Vox#6198`* on discord)
