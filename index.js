const {
    Client,
    Message,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    MessageEditOptions,
    MessageOptions,
    Interaction,
    InteractionCollector,
    ButtonStyle,
    MessageType,
    ComponentType
} = require('discord.js');

module.exports = class Dispage {
    /** @param {Client} client  */
    constructor(client) {
        this.client = client;
        this.stopReason = null;
        this.index = 0;
        /** @type {EmbedBuilder[]} */
        this.embeds = [];
        this.message = null;
        this.interaction = null;
        this.collector = null;
        this.reply = null;
        this.ended = false;
        this.stopReason = null;
        this.started = false;
        this.deleted = false;
        this.duration = 1000 * 60;
        this.mainStyle = "Primary";
        this.styles = Object.keys(ButtonStyle);
        this.buttons = [
            ['previous', "⬅️"],
            ['stop', "⏹️", "DANGER"],
            ['next', "➡️"]
        ].map(arr => {
            return {
                customId: arr[0],
                emoji: arr[1],
                style: arr[2],
                label: arr[3]
            }
        });
        this.filter = (int) => this.users.includes(int.user.id);
        this._hdb = false;
        /** @type {Set<string>} */
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
    /** @returns {EmbedBuilder} */
    get currentEmbed() {
        return this.embeds[this.index];
    }
    _getId(user) {
        return this.client?.users.resolve(user)?.id || user;
    }
    /**
     * Sets the main style for buttons who don't have a per-defined style.
     * @param {ButtonBuilderStyle} style 
     * @returns {this}
     */
    setMainStyle(style) {
        this.mainStyle = style;
        return this;
    }
    /**
     * If buttons that aren't available should be hidden.
     * @param {boolean} should 
     * @returns {this}
     */
    hideDisabledButtons(should = false) {
        this._hdb = should;
        return this;
    }
    /**
     * Rmoves a user from the list of users allowed to interact with the buttons
     * @param {UserResolvable} user 
     * @returns {this}
     */
    removeUser(user) {
        this._userIDs.delete(this._getId(user));
        return this;
    }
    /**
     * Adds a user to the list of users allowed to interact with the buttons
     * @param {UserResolvable} user 
     * @returns {this}
     */
    addUser(user) {
        this._userIDs.add(this._getId(user));
        return this;
    }
    /**
     * Sets the user being the only one allowed to interact with the buttons
     * @tip To have multiple users beeing able to interact with the buttons, use .addUser()
     * @param {UserResolvable} user 
     * @returns {this}
     */
    setUser(user) {
        this._userIDs = new Set([this._getId(user)]);
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
     * Removes every existing button
     * @returns {this}
     */
    removeAllButtons() {
        this.buttons = [];
        return this;
    }
    /**
     * Find a button with a function to remove it.
     * @param {Function} query 
     * @returns {this}
     */
    findButtonAndRemove(query) {
        const i = this.buttons.findIndex(query);
        if (i !== -1) this.buttons.splice(i, 1)
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
        else {
            this.buttons[i] = { ...this.buttons[i], ...o };
        }
        return this;
    }
    /**
     * Gets the current button component row
     * @param {boolean} disabled 
     * @returns {ActionRowBuilder | null}
     */
    getRows(disabled = false) {
        let ar = new ActionRowBuilder()
        let previous = this.embeds[this.index - 1];
        let next = this.embeds[this.index + 1];
        let format = a => {
            let d = disabled
                || (a.customId == "previous" && !previous)
                || (a.customId == "next" && !next)
                || this.ended
                || false;

            if (this._hdb && d) return;

            let button = new ButtonBuilder()
                .setDisabled(d)
                .setStyle(a.style || this.mainStyle)
            if (a.customId) button.setCustomId(a.customId)
            if (a.emoji) button.setEmoji(a.emoji)
            if (a.label) button.setLabel(a.label)
            if (a.url) button.setURL(a.url)
            return ar.addComponents(button);
        }
        this.buttons.forEach(format)
        if (this._hdb) ar.components = ar.components.filter(c =>!c.disabled );
        return ar.components.length ? [ar] : [];
    }
    /**
     * Sets the embed array.
     * @param {EmbedBuilder[]} embeds 
     * @returns {this}
     * @example
     * .setEmbeds([
     *     new EmbedBuilder().setDescription('embed 1'),
     *     new EmbedBuilder().setDescription('embed 2!'),
     *     new EmbedBuilder().setDescription('embed 3!!')
     * ])
     */
    setEmbeds(embeds) {
        embeds = this._fixEmbeds(embeds);
        this.embeds = embeds;
        return this;
    }

    /**
     * Add an embed to the array of embed
     * @param {EmbedBuilder} embed
     * @returns {this}
     * @example
     * .addEmbed(new EmbedBuilder().setDescription('embed 4??'))
     */
    addEmbed(embed) {
        let embeds = this._fixEmbeds(embed)
        return this.setEmbeds([...this.embeds, ...embeds]);
    }

    /**
     * Add multiple arrays to the array of embeds
     * @param {EmbedBuilder[]} embeds
     * @returns {this}
     * @example
     * .addEmbeds([
     *   new EmbedBuilder().setDescription('embed 5!!'),
     *   new EmbedBuilder().setDescription('embed 6!!'),
     *   new EmbedBuilder().setDescription('embed 7!!'),
     * ])
     */
    addEmbeds(embeds) {
        embeds = this._fixEmbeds(embeds);
        embeds.forEach(embed => this.addEmbed(embed));
        return this;
    }

    /**
     * Returns an array of embeds whether the parameter is ONE embed, an array of embeds or an array of arrays
     * @param {EmbedBuilder | EmbedBuilder[] | EmbedBuilder[][]} embeds 
     * @returns {EmbedBuilder[]}
     */
    _fixEmbeds(embeds) {
        embeds = Array.isArray(embeds[0]) ? embeds.flat(1) : embeds
        embeds = embeds?.type ? [embeds] : embeds;
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
     * Go to the next page
     * @returns {Promise<Message | false>}
     */
    next(int) {
        let newIndex = this.index + 1
        if (this.canEdit() && this.doesIndexExist(newIndex))
            return this.changeToPage(newIndex, int)
        return Promise.resolve(false);
    }

    /**
     * Get to the previous page
     * @returns {Promise<Message | false>}
     */
    previous(int) {
        let newIndex = this.index - 1
        if (this.canEdit() && this.doesIndexExist(newIndex))
            return this.changeToPage(newIndex, int)
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
     * @returns {Promise<Message>} 
     */
    async changeToPage(index, int) {
        this.setIndex(index)
        return await int.update(this.getOpts())
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
     * End the embed page system
     * @param {string} reason 
     * @returns {Promise<void | Message>}
     */
    async end(reason) {
        this.stopReason = reason;
        this.ended = true;
        if (!this.canEdit()) return await Promise.resolve();
        return await this.reply.edit(this.getOpts(true));
    }

    /**
     * Delete the embed page system message
     * @returns {Promise<Message>}
     */
    async delete() {
        this.deleted = true;
        this.end("messageDelete")
        if (this.reply) return await this.reply.delete();
        else return await Promise.reject('No message to edit.');
    }

    /**
     * @param {boolean} disabled 
     * @returns {MessageOptions}
     */
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
        return this.ctx && this.started && !this.deleted;
    }
    /**
     * Check if the argument can be used in the .start() method
     * @param {Message | Interaction} ctx 
     * @returns {boolean}
     */
    isValidCtx(ctx) {
        return ctx &&
            (ctx.isRepliable() || [
                MessageType.Default, MessageType.Reply,
                MessageType.ChatInputCommand, MessageType.ContextMenuCommand
            ].includes(ctx.type))
    }
    /**
     * Creates a collector of buttons of the message with the duration
     * @param {Message} reply 
     * @returns {InteractionCollector}
     */
    _createCollector(reply) {
        return reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: this.duration,
        });
    }
    /**
     * Check if any problems are existing in the current 
     * @param {Message | Interaction} msg 
     * @returns {string[]}
     */
    checkForErrors(ctx) {
        let errors = []
        function add(error) { errors.push(error) };
        if (this.ended) add('Dispage has ended already.')
        if (this.deleted) add('Dispage has previously been deleted.')
        if (!ctx) add('No message/interaction given.');
        else {
            if (ctx.author) {
                this.message = ctx;
                this.addUser(ctx.author.id)
            } else if (ctx.user) {
                this.interaction = ctx;
                this.addUser(ctx.user.id)
            } else add(`.start(<ctx>) -> ctx is neiher an interaction nor a message.`);
        }
        if (!this.embeds.length) add('Embed array is empty.')
        else if (!this.embeds[this.index]) add(`No embed at index ${this.index}`);

        if (typeof (this.index) !== "number"
            || isNaN(this.index)
            || this.index < 0) add(`Invalid index ${this.index}`);

        if (typeof (this.filter) !== "function")
            add(`.filter should be a function but is a ${typeof (this.filter)}.`)
        if (typeof (this._hdb) !== "boolean")
            add(`.hideDisabledButtons() should be a boolean but is a ${typeof (this._sdb)}`)
        if (typeof (this.duration) !== "number")
            add(`.duration should be a number but is a ${typeof this.duration}`)

        if (!this.styles.includes(this.mainStyle)) add('.mainStyle is not a valid button style')
        if (!Array.isArray(this.buttons)) add('.buttons is not an array as expected.')

        this.users.forEach((id, i) => {
            if (typeof (id) !== "string") add(`ID "${id}" at index ${i} is not a string but a ${typeof (id)}.`)
            else if (id.split(' ').some(c => !Number(c))) add(`ID "${id}" at index ${i} is not a valid user ID.`);
        })
        return errors;
    }
    /**
     * Execute the embed page system 
     * @param {Message | Interaction} ctx 
     * @returns {Promise<this>}
     */
    async start(ctx) {
        let errs = this.checkForErrors(ctx)
        const err = new Error(`Errors ecountered :\n${errs.map((e, i) => `${i} - ${e}`).join('\n')}`);
        if (errs.length) throw err;
        if (this.started) throw new Error('Dispage already started')
        if (!this.users.length) this._userIDs.add(ctx.author?.id || ctx.user?.id);

        /** @type {Message} */
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
                if (id === "stop") {
                    await int.update(this.getOpts(true))
                    return this.collector.stop('button');
                }
                else {
                    switch (id) {
                        case 'next':
                            await this.next(int);
                            break;
                        case 'previous':
                            await this.previous(int);
                            break;
                    }
                }
            }
            await int.deferUpdate().catch(() => 0);
        })

        this.collector.on('end', async (_, reason) => {
            if (reason && reason.toLowerCase().includes('delete')) this.deleted = true;
            return await this.end(reason).catch(console.error)
        });
        return this;
    }
}