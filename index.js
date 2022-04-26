const Discord = require('discord.js');

module.exports = class Dispage {
    constructor(client) {
        this.client = client;
        this.index = 0;
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
        this.footer = (index, total) => total - 1 ? `📜 Page ${index}/${total}` : '';
        this.filter = (int) => this.users.includes(int.user.id);
        this.showDisabledButtons = true;
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
    shouldShowDisabledButtons(should = true) {
        this.showDisabledButtons = should;
        return this;
    }
    /**
     * @param {Discord.UserResolvable} user 
     * @returns {this}
     */
    removeUser(user) {
        this._userIDs.delete(this._getId(user));
        return this;
    }
    /**
     * @param {Discord.UserResolvable} user 
     * @returns {this}
     */
    addUser(user) {
        this._userIDs.add(this._getId(user));
        return this;
    }
    /**
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
        this._userIDs = new Set([this._getId(user)]);
        return this;
    }
    /**
     * @param {object} o
     * @returns {this}
     */
    addButton(o) {
        this.buttons.push(o);
        return this;
    }
    /**
     * @param {string} customId
     * @returns {this}
     */
    removeButton(customId) {
        const i = this.buttons.findIndex(btn => btn.customId === customId);
        if (i !== -1) this.buttons.splice(i, 1)
        return this;
    }
    /**
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
     * @param {boolean} disabled 
     * @returns {Discord.MessageActionRow | null}
     */
    getRows(disabled = false) {
        let ar = new Discord.MessageActionRow()
        let previous = this.embeds[this.index - 1];
        let next = this.embeds[this.index + 1];
        function format(a) {
            let d = disabled
                || (a.customId == "previous" && !previous)
                || (a.customId == "next" && !next)
                || false;

            let button = new Discord.MessageButton()
                .setCustomId(a.customId)
                .setEmoji(a.emoji)
                .setStyle(a.style)
                .setDisabled(d);
            return ar.addComponents(button);
        }
        this.buttons.forEach(format);
        if (!this.showDisabledButtons) ar.components = ar.components.filter(c => !c.disabled);
        return ar.components.length ? [ar] : null;
    }

    /**
     * @param {Function} func 
     * @returns {this}
     * @example
     * .setFooter((index, total) => total - 1 ? `📜 Page ${index}/${total}` : '');
     * // If it's the first page, will be empty. Othewise, ^^^^ will display this text
     */
    setFooter(func) {
        this.footer = func ?? (() => '');
        return this;
    }

    /**
     * @param {Discord.MessageEmbed[]} embeds 
     * @returns {this}
     */
    setEmbeds(embeds) {
        embeds = this._fixEmbeds(embeds);
        this.embeds = embeds;
        return this;
    }
    /**
     * @param {Discord.MessageEmbed} embed
     * @returns {this}
     */
    addEmbed(embed) {
        return this.setEmbeds([...this.embeds, embed]);
    }

    /**
     * @param {Discord.MessageEmbed[]} embeds
     * @returns {this}
     */
    addEmbeds(embeds) {
        embeds = this._fixEmbeds(embeds);
        embeds.forEach(embed => this.addEmbed(embed));
        return this;
    }

    /**
     * @param {Discord.MessageEmbed | Discord.MessageEmbed[] | Discord.MessageEmbed[][]} embeds 
     * @returns {Discord.MessageEmbed[]}
     */
    _fixEmbeds(embeds) {
        // embed
        embeds = Array.isArray(embeds[0]) ? embeds[0] : embeds
        embeds = embeds instanceof Discord.MessageEmbed ? [embeds] : embeds;
        return embeds;
    }

    /**
     * @param {number} duration 
     * @returns {this}
     */
    setDuration(duration) {
        this.duration = duration
        return this;
    }

    /**
     * @param {number} duration 
     * @returns {this}
     */
    addDuration(duration) {
        this.duration += duration
        return this;
    }

    next() {
        if (this.canEdit()) return this.setIndex(this.index + 1)
        else return Promise.resolve();

    }

    previous() {
        if (this.canEdit()) return this.setIndex(this.index - 1)
        else return Promise.resolve();
    }

    /**
     * @param {number} index 
     * @returns {this}
     */
    setIndex(index) {
        this.index = index;
        if (this.canEdit()) this.update()
        return this;
    }

    _fixEmbedFooters() {
        return this.embeds.forEach(embed => {
            embed.setFooter({ text: this.footer(this.index + 1, this.embeds.length) })
        });
    }
    /**
     * @param {Discord.MessageEditOptions} opts 
     */
    edit(opts) {
        if (this.deleted) return Promise.reject('No message to edit.')
        this._fixEmbedFooters();
        return this.reply.edit(opts)
    }

    disableButtons() {
        return this.edit({ components: this.getRows(true) })
    }

    end() {
        if (this.ended) return Promise.resolve();
        this.ended = true;
        return this.disableButtons()
    }

    delete() {
        this.deleted = true;
        this.ended = true;
        if (this.reply) return this.reply.delete();
        else return Promise.reject('No message to edit.');
    }

    update() {
        return this.edit(this.getOpts())
    }

    getOpts(disabled = false) {
        this._fixEmbedFooters();
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
    checkForErrors(msg) {
        let errors = []
        function add(error) { errors.push(error) };
        if (this.ended) add('Page system has ended already.')
        if (this.deleted) add('Page system has previously been deleted.')
        if (!msg) add('No message/interaction given.');
        if (msg.author) {
            this.message = msg;
            this.addUser(msg.author.id)
        } else if (msg.user) {
            this.interaction = msg;
            this.addUser(msg.user.id)
        } else add(`.start(<ctx>) -> ctx is neiher an interaction nor a message.`);

        if (!this.embeds.length) add('Embed array is empty.')

        if (typeof (this.index) !== "number"
            || isNaN(this.index)
            || this.index < 0) add(`Invalid index ${this.index}`);

        if (!this.embeds[this.index]) add(`No embed at index ${this.index}`);

        if (typeof (this.footer) !== "function")
            add(`.footer is not a function but is a ${typeof (this.footer)}.`)

        if (typeof (this.filter) !== "function")
            add(`.filter should be a function but is a ${typeof (this.filter)}.`)
        if (typeof (this.showDisabledButtons) !== "boolean")
            add(`.showDisabledButtons should be a boolean but is a ${typeof (this.showDisabledButtons)}`)
        if (typeof (this.duration) !== "number")
            add(`.duration should be a number but is a ${typeof this.duration}`)
        this.users.forEach((id, i) => {
            if (typeof (id) !== "string") add(`ID "${id}" at index ${i} is not a string but a ${typeof(id)}.`)
            else if (id.split(' ').some(c => !Number(c))) add(`ID "${id}" at index ${i} is not a valid user ID.`);
        })
        return errors;
    }

    async start(ctx) {
        if (!this.users.length) this._userIDs.add(ctx.author?.id || ctx.user?.id);
        let errors = this.checkForErrors(ctx)
        if (errors.length)
            throw new Error("Errors ecountered :\n" + errors.map((e, i) => `${i + 1} - ${e}`).join('\n'))

        this._fixEmbedFooters();
        /**
         * @type {Discord.Message} 
         */
        this.reply = await this[this.type].reply({
            fetchReply: true,
            ...this.getOpts()
        }).then(res => {
            this.started = true;
            return res;
        })

        if (!this.reply) throw new Error('Could not fetch reply of the message/interaction');
        if (!this.getRows()) return;

        this.collector = this.reply.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: this.duration,
        });

        this.collector.on('collect', async (int) => {
            if (this.users.includes(int.user.id)) {
                if (!this.filter(int)) return;
                const id = int.customId;
                if (id === "stop") await this.end();
                else {
                    switch (id) {
                        case 'next':
                            await this.next();
                            break;
                        case 'previous':
                            await this.previous();
                            break;
                    }
                    if (!this.ended) await this.update();
                }
            }
            await int.deferUpdate().catch(() => 0);
        });

        this.collector.on('end', () => { this.end() });
        return this;
    }
}