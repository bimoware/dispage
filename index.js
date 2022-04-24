const Discord = require('discord.js');

module.exports = class PageSystem {
    constructor(client) {
        this.client = client;
        this.index = 0;
        this.id = null;
        this.embeds = [];
        this.message = null;
        this.interaction = null;
        this.collector = null;
        this.ended = false;
        this.started = false;
        this.deleted = false;
        this.duration = 1000 * 60;
        this.emojis = {
            previous: "⬅️",
            stop: "⏹️",
            next: "➡️"
        };
        this.footer = (index, total) => total - 1 ? `📜 Page ${index}/${total}` : '';
        this.filter = (i) => this.id === i.user.id;
        console.log(this);
    }
    get ctx() {
        return this.message ? "MESSAGE" : this.interaction ? "INTERACTION" : null;
    }
    get _row() {
        return [
            ['previous', 'PRIMARY'],
            ['stop', 'DANGER'],
            ['next', 'PRIMARY']
        ].map(arr => {
            return {
                name: arr[0],
                emoji: this.emojis[arr[0]],
                style: arr[1]
            }
        });
    }
    get type() {
        return this.ctx.toLowerCase();
    }

    get endUntill() {
        return this.collector ? (Date.now() - this.collector.options.time) : null;
    }

    /**
     * @param {boolean} disabled 
     * @returns {Discord.MessageActionRow | null}
     */
    getRow(disabled = false) {
        let ar = new Discord.MessageActionRow()
        let previous = this.embeds[this.index - 1];
        let next = this.embeds[this.index + 1];
        function format(a) {
            let d = disabled
                || (a.name == "previous" && !previous)
                || (a.name == "next" && !next)
                || false;

            let button = new Discord.MessageButton()
                .setCustomId(a.name)
                .setEmoji(a.emoji)
                .setStyle(a.style)
                .setDisabled(d);
            return ar.addComponents(button);
        }
        this._row.forEach(b => format(b));

        return ar.components.length ? ar : null;
    }

    /**
     * @param {Discord.UserResolvable} user 
     * @returns {this}
     */
    setUserID(user) {
        this.id = this.client.users.resolve(user).id;
        return this;
    }

    /**
     * @param {Function} func 
     * @returns {this}
     */
    setFooter(func) {
        this.footer = func || (() => '');
        return this;
    }

    /**
     * @param {Discord.MessageEmbed[]} embeds 
     * @returns {this}
     */
    setEmbeds(embeds) {
        embeds = this.fixEmbeds(embeds);
        this.embeds = embeds;
        return this;
    }

    /**
     * @param {Discord.MessageEmbed} embed
     * @returns {this}
     */
    addEmbed(embed) {
        return this.addEmbeds([embed]);
    }

    /**
     * @param {Discord.MessageEmbed | Discord.MessageEmbed[] | Discord.MessageEmbed[][]} embeds 
     * @returns {Discord.MessageEmbed[]}
     */
    fixEmbeds(embeds) {
        // embed
        embeds = Array.isArray(embeds[0]) ? embeds[0] : embeds
        embeds = embeds instanceof Discord.MessageEmbed ? [embeds] : embeds;
        return embeds;
    }

    /**
     * @param {Discord.MessageEmbed[]} embeds
     * @returns {this}
     */
    addEmbeds(embeds) {
        embeds = this.fixEmbeds(embeds);
        embeds.forEach(embed => this.addEmbed(embed));
        return this;
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

    /**
     * @param {Discord.MessageEditOptions} opts 
     */
    edit(opts) {
        if (this.deleted) return Promise.reject('No message to edit.')
        return this.reply.edit(opts)
    }

    disableButtons() {
        return this.edit({ components: [this.getRow(true)] })
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

    /** 
     * @returns {Discord.MessageEmbed}
     */
    get currentEmbed() {
        return this.embeds[this.index];
    }

    update() {
        return this.edit(this.getOpts())
    }

    getOpts(disabled = false) {
        return {
            embeds: [this.currentEmbed],
            components: [this.getRow(disabled)]
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
        if(msg.author){
            this.message = msg;
            this.setUserID(msg.author.id)
        } else if(msg.user) {
            this.interaction = msg;
            this.setUserID(msg.user.id)
        } else add(`.start(<ctx>) -> ctx is neiher an interaction nor a message.`);
        
        /*
        if (msg instanceof Discord.Message) {
            this.message = msg;
            this.setUserID(msg.author.id)
        } else if (msg instanceof Discord.Interaction) {
            this.interaction = msg;
            this.setUserID(msg.user.id)
            
        */
       
        if (!this.embeds.length) add('Embed array is empty.')
        /*
        else this.embeds.forEach((embed, i) =>{
            if(!(embed instanceof Discord.MessageEmbed)) add(`"Embed" at position ${i} is not an embed.`);
        })
        */

        if (typeof (this.index) !== "number"
            || isNaN(this.index)
            || this.index < 0
            || this.index > 10) add(`Invalid index ${this.index}`);

        if (!this.embeds[this.index]) add(`No embed at index ${this.index}`);

        if (typeof (this.footer) !== "function")
            add(`Footer is not a function but a ${typeof (this.footer)}.`)

        if (typeof (this.filter) !== "function")
            add(`Filter is not a function but a ${typeof (this.footer)}.`)

        if (typeof (this.id) !== "string") add(`ID "${this.id}" is not a string.`)
        else if (this.id.split(' ').some(c => !Number(c))) add(`ID "${this.id}" is not a valid user ID.`);

        return errors;
    }

    async start(ctx) {
        if (!this.id) this.id = ctx.author?.id || ctx.user?.id || this.id;
        let errors = this.checkForErrors(ctx)
        if (errors.length)
            throw new Error("Errors ecountered :\n" + errors.map((e, i) => `${i + 1} - ${e}`).join('\n'))

        /**
         * @type {Discord.Message} 
         */
        this.reply = await this[this.type].reply({
            fetchReply: true,
            ...this.getOpts()
        })
        this.started = true;

        if (!this.reply) throw new Error('Could not fetch reply of the message/interaction');
        if (!this.getRow()) return;

        this.collector = this.reply.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: this.duration,
        });

        this.collector.on('collect', async (int) => {
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
            int.deferUpdate()
        });

        this.collector.on('end', () => { this.end() });

        return this.reply;
    }
}