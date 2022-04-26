# 1.0.0
- Published the package

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

# 1.0.3
- Added .addUser, .removeUser and .setUser to add a user id to the people who can interact with the buttons.
- deprecated .addUserID by .addUser for better efficiency and flexibility.
- Added .setMainStyle() to change from the default PRIMARY style (for left and right mostly.)
- Users not allowed in the embed are now getting their interaction deferred and given an ephemeral response
- Made some properties & methods private for better experience with IDE's docs
- .getRow() replaced now by .getRow**s**();
- Improved index.d.ts.