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
- [DEPRECATED] .addUserID by .addUser for better efficiency and flexibility.
- Added .setMainStyle() to change from the default PRIMARY style (for left and right mostly.)
- Users not allowed in the embed are now getting their interaction deferred and given an ephemeral response
- Made some properties & methods private for better experience with IDE's docs
- .getRow() replaced now by .getRow**s**();
- Improved index.d.ts.

# 1.0.4
- Removed automatic footer as it's not user-friendly
- Collected moved to another method for possibility of change
- If the stop button is pressed, the embeds will disapear but if it's only the time that runs out. The buttons will be disabled only.
- Built-in .doesIndexExist()
- Types for typescript (Context, User, Message and Embed & ButtonId)
- Methods that starts with _ should only be used inside the class.
- Added an example.js file to copy/paste
- Added a tsconfig.json for efficiency and reliable experience while updating the package
- .addDuration not crashing when .setDuration has been used with a none-number
- async every method for better error handling and crash path tracability
- .canEdit that returns true if dispage has neither stopped, been deleted, the time has run out and the page system has been sent and successfully started
- .editButton, .createButton and .removeButton to manipulate buttons on screen and create existing imaginations
- Better JSDoc for none-typescript cases.
# 1.0.5
- Fixed a small bug that crashed when the embed page system gets deleted.
# 1.0.6
- Made it compatible for v14
- Fixed bug that made the buttons still enabled after dispage turning off
- Fixed bug that crashed the process when the message is deleted while the buttons are still active
- Fixed example.js including intents, builders and button style
- Fixed buttons that still appear even if .showDisabledButtons is disabled