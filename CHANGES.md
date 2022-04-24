# 1.0.1
- Better README.md
- Added typescript notation support for typescript programmers

# 1.0.2
- Added a CHANGES.md (current file)
- Typescript declaration files are now automatic using `npx tsc index.js -d --allowJs`
- Fixed a bug with "instanceof" not working locally (not knowing if a message is a discord.js Message, embeds is MessageEmbed, interaction is CommandInteraction etc..).
- Transformed some static properties into getters for more logic and readability.
- next() and previous() either return the instance when using just after the constructor or returns a promise when using after the .start() promise.
- Possibility to control buttons with .addButton, .removeButton & .editButton