const Discord = require('discord.js');
module.exports = class Dispage {
    /** @param {Discord.Client} client  */
    constructor(client) {
        this.client = client;
        this.index = 0;
        /** @type {Discord.MessageEmbed[]} */
        this.embeds = [];
        this.message = null;
        this.interaction = null;
        this.collector = null;
        this.reply = null;
        this.ended = false;
        this.started = false;
        this.deleted = false;
        this.duration = 1000 * 60;
        this.mainStyle = "PRIMARY";
        this.buttons = [
            ['previous', "⬅️"],
            ['stop', "⏹️", "DANGER"],
            ['next', "➡️"]
        ].map(arr => {
            return {
                customId: arr[0],
                emoji: arr[1],
                style: arr[2] || this.mainStyle,
                label: arr[3]
            }
        });
        this.filter = (int) => this.users.includes(int.user.id);
        this._sdb = true;
        this._userIDs = new Set();
    }
    get users() {
        return Array.from(this._userIDs)
    }
    get ctx() {
        return this.message ? "MESSAGE" : this.interaction ? "INTERACTION" : null;
    }
    get type() {
        return this.ctx?.toLowerCase() ?? null;
    }
    get endUntill() {
        return this.collector ? (Date.now() - this.collector.options.time) : null;
    }
    /** @returns {Discord.MessageEmbed} */
    get currentEmbed() {
        return this.embeds[this.index];
    }
    _getId(user) {
        return this.client?.users.resolve(user)?.id || user;
    }
    setMainStyle(style) {
        this.mainStyle = style ?? mainStyle;
        return this;
    }
    /**
     * If 
     * @param {boolean} should 
     * @returns {this}
     */
    showDisabledButtons(should) {
        this._sdb = should ?? true;
        return this;
    }
    /**
     * Rmoves a user from the list of users allowed to interact with the buttons
     * @param {Discord.UserResolvable} user 
     * @returns {this}
     */
    removeUser(user) {
        this._userIDs.delete(this._getId(user));
        return this;
    }
    /**
     * Adds a user to the list of users allowed to interact with the buttons
     * @param {Discord.UserResolvable} user 
     * @returns {this}
     */
    addUser(user) {
        this._userIDs.add(this._getId(user));
        return this;
    }
    /**
     * Sets the user being the only one allowed to interact with the buttons
     * @tip To have multiple users beeing able to interact with the buttons, use .addUser()
     * @param {Discord.UserResolvable} user 
     * @returns {this}
     */
    setUser(user) {
        this._userIDs = new Set([this._getId(user)]);
        return this;
    }

    /** @deprecated Use .setUser() instead. */
    setUserID(user) {
        console.warn('.setUserID() is deprecated. Please use .setUser() instead.')
        this.setUser(user);
        return this;
    }
    /**
     * Creates a button
     * @param {object} o
     * @returns {this}
     */
    addButton(o) {
        this.buttons.push(o);
        return this;
    }
    /**
     * Removes a specific button with it's id
     * @param {string} customId
     * @returns {this}
     */
    removeButton(customId) {
        const i = this.buttons.findIndex(btn => btn?.customId === customId);
        if (i !== -1) this.buttons.splice(i, 1)
        return this;
    }
    /**
     * Edit an existing button with it's id
     * @param {string} customId
     * @param {object} o
     * @returns {this}
     */
    editButton(customId, o) {
        const i = this.buttons.findIndex(btn => btn.customId === customId);
        if (i < 0) this.addButton(o)
        else this.buttons[i] = { ...this.buttons[i], ...o };
        return this;
    }
    /**
     * Gets the current button component row
     * @param {boolean} disabled 
     * @returns {Discord.MessageActionRow | null}
     */
    getRows(disabled = false) {
        let ar = new Discord.MessageActionRow()
        let previous = this.embeds[this.index - 1];
        let next = this.embeds[this.index + 1];
        let format = a => {
            let d = disabled
                || (a.customId == "previous" && !previous)
                || (a.customId == "next" && !next)
                || this.ended
                || false;

            let button = new Discord.MessageButton()
                .setCustomId(a.customId)
                .setEmoji(a.emoji)
                .setStyle(a.style)
                .setDisabled(d);
            return ar.addComponents(button);
        }
        this.buttons.forEach(format);
        if (!this._sdb) ar.components = ar.components.filter(c => !c.disabled);
        return ar.components.length ? [ar] : null;
    }
    /**
     * Sets the embed array.
     * @param {Discord.MessageEmbed[]} embeds 
     * @returns {this}
     * @example
     * .setEmbeds([
     *     new MessageEmbed().setDescription('embed 1'),
     *     new MessageEmbed().setDescription('embed 2!'),
     *     new MessageEmbed().setDescription('embed 3!!')
     * ])
     */
    setEmbeds(embeds) {
        embeds = this._fixEmbeds(embeds);
        this.embeds = embeds;
        return this;
    }
    /**
     * Add an embed to the array of embed
     * @param {Discord.MessageEmbed} embed
     * @returns {this}
     * @example
     * .addEmbed(new MessageEmbed().setDescription('embed 4??'))
     */
    addEmbed(embed) {
        let embeds = this._fixEmbeds(embed)
        return this.setEmbeds([...this.embeds, ...embeds]);
    }

    /**
     * Add multiple arrays to the array of embeds
     * @param {Discord.MessageEmbed[]} embeds
     * @returns {this}
     * @example
     * .addEmbeds([
     *   new MessageEmbed().setDescription('embed 5!!'),
     *   new MessageEmbed().setDescription('embed 6!!'),
     *   new MessageEmbed().setDescription('embed 7!!'),
     * ])
     */
    addEmbeds(embeds) {
        embeds = this._fixEmbeds(embeds);
        embeds.forEach(embed => this.addEmbed(embed));
        return this;
    }

    /**
     * Returns an array of embeds whether the parameter is ONE embed, an array of embeds or an array of arrays
     * @param {Discord.MessageEmbed | Discord.MessageEmbed[] | Discord.MessageEmbed[][]} embeds 
     * @returns {Discord.MessageEmbed[]}
     */
    _fixEmbeds(embeds) {
        embeds = Array.isArray(embeds[0]) ? embeds.flat(1) : embeds
        embeds = embeds?.type === "rich" ? [embeds] : embeds;
        console.log(embeds);
        return embeds;
    }

    /**
     * Sets the number of milliseconds before the embed page system stops
     * @param {number} duration 
     * @returns {this}
     */
    setDuration(duration) {
        this.duration = duration
        return this;
    }

    /**
     * Adds milliseconds to the current duration of the page system
     * @param {number} duration 
     * @returns {this}
     */
    addDuration(duration) {
        this.duration = (this.duration ?? 0) + duration;
        return this;
    }

    /**
     * Get to the next page
     */
    next() {
        let newIndex = this.index + 1
        if (this.canEdit() && this.doesIndexExist(newIndex))
            return this.changeToPage(newIndex)
        return Promise.resolve(false);
    }

    /**
     * Get to the previous page
     * @returns {Promise}
     */
    previous() {
        let newIndex = this.index - 1
        if (this.canEdit() && this.doesIndexExist(newIndex))
            return this.changeToPage(newIndex)
        return Promise.resolve(false);
    }
    /**
     * Checks if the index exists on the embed array
     * @param {number} index 
     * @returns {boolean}
     */
    doesIndexExist(index) {
        return Boolean(this.embeds[index]);
    }
    /**
     * Change pages
     * @param {number} index 
     */
    changeToPage(index){
        this.setIndex(index)
        return this.update();
    }
    /**
     * @param {number} index 
     * @returns {this}
     */
    setIndex(index) {
        this.index = index;
        return this;
    }
    /**
     * @param {Discord.MessageEditOptions} opts 
     */
    async edit(opts) {
        if (!this.canEdit()) return await Promise.reject("Cannot edit message");
        return await this.reply.edit(opts)
    }

    async end(reason) {
        if (!this.canEdit()) return Promise.resolve();
        await this.edit({
            components: this.getRows(true)
        })
        this.ended = true;
        if (reason === "button") await this.reply.suppressEmbeds();
    }

    async delete() {
        this.deleted = true;
        this.ended = true;
        if (this.reply) return await this.reply.delete();
        else return await Promise.reject('No message to edit.');
    }

    async update() {
        return await this.edit(this.getOpts())
    }

    getOpts(disabled = false) {
        return {
            embeds: [this.currentEmbed],
            components: this.getRows(disabled)
        };
    }
    isMessage() {
        return this.ctx ? this.ctx === "MESSAGE" : null;
    }
    isInteraction() {
        return this.ctx ? this.ctx === "INTERACTION" : null;
    }
    canEdit() {
        return this.ctx && this.started && !this.ended && !this.deleted;
    }
    isValidCtx(ctx) {
        return ['DEFAULT', 'REPLY', 'APPLICATION_COMMAND', 'CONTEXT_MENU_COMMAND']
            .includes(ctx?.type);
    }
    /**
     * Creates a collector of buttons of the message with the duration
     * @param {Discord.Message} reply 
     * @returns {Discord.InteractionCollector}
     */
    _createCollector(reply) {
        return reply.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: this.duration,
        });
    }
    checkForErrors(msg) {
        let errors = []
        function add(error) { errors.push(error) };
        if (this.ended) add('Dispage has ended already.')
        if (this.deleted) add('Dispage has previously been deleted.')
        if (!msg) add('No message/interaction given.');
        if (msg.author) {
            this.message = msg;
            this.addUser(msg.author.id)
        } else if (msg.user) {
            this.interaction = msg;
            this.addUser(msg.user.id)
        } else add(`.start(<ctx>) -> ctx is neiher an interaction nor a message.`);

        if (!this.embeds.length) add('Embed array is empty.')
        else if (!this.embeds[this.index]) add(`No embed at index ${this.index}`);

        if (typeof (this.index) !== "number"
            || isNaN(this.index)
            || this.index < 0) add(`Invalid index ${this.index}`);

        if (typeof (this.filter) !== "function")
            add(`.filter should be a function but is a ${typeof (this.filter)}.`)
        if (typeof (this._sdb) !== "boolean")
            add(`.showDisabledButtons() should be a boolean but is a ${typeof (this._sdb)}`)
        if (typeof (this.duration) !== "number")
            add(`.duration should be a number but is a ${typeof this.duration}`)
        this.users.forEach((id, i) => {
            if (typeof (id) !== "string") add(`ID "${id}" at index ${i} is not a string but a ${typeof (id)}.`)
            else if (id.split(' ').some(c => !Number(c))) add(`ID "${id}" at index ${i} is not a valid user ID.`);
        })
        return errors;
    }
    async start(ctx) {
        if (this.started) throw new Error('Dispage already started')
        if (!this.users.length) this._userIDs.add(ctx.author?.id || ctx.user?.id);
        let errs = this.checkForErrors(ctx)
        if (errs.length) throw new Error(`Errors ecountered :\n`
            + errs.map((e, i) => `${i} - ${e}`).join('\n'))

        /** @type {Discord.Message} */
        this.reply = await this[this.type].reply({
            fetchReply: true,
            ...this.getOpts()
        }).then(res => {
            this.started = true;
            return res;
        })

        if (!this.reply) throw new Error('Could not fetch reply of the message/interaction');
        if (!this.getRows()) return;

        this.collector = this._createCollector(this.reply)

        this.collector.on('collect', async (int) => {
            if (this.users.includes(int.user.id)) {
                if (!this.filter(int)) return;
                const id = int.customId;
                if (id === "stop") this.collector.stop('button');
                else {
                    switch (id) {
                        case 'next':
                            await this.next();
                            break;
                        case 'previous':
                            await this.previous();
                            break;
                    }
                }
                if (this.canEdit()) await this.update();
            }
            await int.deferUpdate().catch(() => 0);
        })

        this.collector.on('end', async (_, reason) => await this.end(reason));
        return this;
    }
}