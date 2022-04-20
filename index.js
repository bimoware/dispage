const Discord = require('discord.js');

module.exports.PageSystem = class PageSystem {
    /**
     * @param {Discord.Client} client Your client.
     */
    constructor(client) {
        this.client = client || null;
        /**
         * The index of the current showed embed.
         */
        this.index = 0;
        /**
         * The id that is allowed to use the embed buttons
         */
        this.id = null;
        /**
         * The embeds
         */
        this.embeds = [];
        /**
         * "interaction" "message" The type of reply (interaction/message)
         */
        this.ctx = null;
        /**
         * The command message that triggered the embed page system
         */
        this.message = null;
        /**
         * The reply interaction (if the command was an interaction)
         */
        this.interaction = null;
        /**
         * The collector of interactions (if the message got sent)
         */
        this.collector = null;
        /**
         * If the collector ended
         */
        this.ended = false;
        /**
         * If the reply got deleted.
         */
        this.deleted = false;
        /**
         *The duration of the collector
         */
        this.duration = 1000 * 60;
        /**
         * The emojis to use as buttons
         */
        this.emojis = {
            previous: "⬅️",
            stop: "⏹️",
            next: "➡️"
        };
        /**
         * The only component row containing the buttons
         */
        this._row = [
            ['previous', this.emojis.previous, 'PRIMARY'],
            ['stop', this.emojis.stop, 'DANGER'],
            ['next', this.emojis.next, 'PRIMARY']
        ].map(arr => {
            return {
                name: arr[0],
                emoji: arr[1],
                style: arr[2]
            }
        })
        /**
         * @param {Number} i Current embed page
         * @param {Number} l Embed page length
         * @returns {string}
         */
        this.footer = (i, l) => l - 1 ? `📜 Page ${i}/${l}` : '';
        /**
         * Checks if interaction can interact.
         * @param {Discord.ButtonInteraction}
         * @returns {Boolean}
         */
        this.filter = i => this.id === i.user.id;
        this.e = (msg) => { throw new Error(msg); };
    }

    /**
     * @description How much time untill the collector has finished.
     * @returns {Number} Time in milliseconds
    */
    get endUntill() {
        return this.collector ? (Date.now() - this.collector.options.time) : null;
    }
    /**
     * @param {Boolean} disabled If all of the buttons should be disabled.
     * @returns {Discord.MessageActionRow} The row.
     * @description Gives all rows
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
     * @param {string | Discord.GuildMember | Discord.User} user The ID of a new person that will be able to interact with the buttons.
     * @returns {this}
     * @example 
     * // For messages :
     * .addUser(message.author.id)
     * // For interactions :
     * .addUser(interaction.user.id)
     */
    setUserID(user) {
        if (!user) throw this.e('No ID given.')
        if (user instanceof Discord.GuildMember || user instanceof Discord.User)
            user = user.id;
        if (typeof (user) !== "string") return this.e(`"${id}" is not a string (ID).`)
        if (!Number(user)) return this.e(`"${id}" is not a valid ID.`)
        this.id = user;
        return this;
    }
    /**
     * @param {Function} func The function to (when given the page index) should return the footer text.
     * @returns {this}
     * @example
     * .setFooter((i,l) => `Page ${i} of ${l}`)
     */
    setFooter(func = () => '') {
        if (typeof (func) !== "function") return this.e(`${func} is not a function but a ${typeof (func)}.`)
        this.footer = func;
        return this;
    }
    /**
     * @param {Discord.MessageEmbed[]} embeds An array of the embeds to use.
     * @returns {this}
     * @example
     * .setEmbeds([
     *     new Discord.MessageEmbed().setDescription('First embed')
     *     new Discord.MessageEmbed().setDescription('Middle embed')
     *     new Discord.MessageEmbed().setDescription('Last embed')
     * ])
     */
    setEmbeds(embeds) {
        if (!embeds) return this.e('No embed given')
        if (embeds instanceof Discord.MessageEmbed) embeds = [embeds];
        if (!Array.isArray(embeds)) return this.e(`"${embeds}" is not an array but a ${typeof(embeds)}.`)
        if (!embeds.length) return this.e(`Embed pages is an empty array.`)
        const notAnEmbed = embeds.find(e => typeof(e) !== "object");
        if (notAnEmbed) return this.e(`Array contains a none-embed at index ${embeds.indexOf(notAnEmbed)} (${notAnEmbed})`)
        this.embeds = embeds;
        this.fixEmbeds();
        return this;
    }

    /**
     * @param {Discord.MessageEmbed} embed 
     * @returns {this}
     */
    addEmbed(embed) {
        if (!embed) return this.e('No embed given')
        if ((embed instanceof Discord.MessageEmbed)) return this.e(`"${embed}" is not an embed.`)
        this.setEmbeds([...this.embeds,embed]);
        return this;
    }
    /**
     * @param {Discord.MessageEmbed[][0]} embed 
     * @returns {this}
     */
    addEmbeds(...embeds) {
        if (!embeds) return this.e('No embeds given')
        embeds = Array.isArray(embeds[0]) ? embeds[0] : embeds;
        embeds.forEach(embed => this.addEmbed(embed));
        return this;
    }
    /**
     * @param {Number} duration How long should the embed pages work for (milliseconds)
     * @returns {this}
     * @example // If you want the pages to last 1 minute
     * .setDuration(1000 * 60) // 1000ms = 1s, so 1s * 60 = 1m.
     * // If you want it to last 5 minutes :
     * .setDuration(100 * 60 * 5) // Same than before, 1m * 5 = 5m.
     * // You can even use 1e5 syntax:
     * .setDuration(1e5) // 100000ms (100s)
     * .setDuration(100000) // 100000ms (100s)
    */
    setTime(duration) {
        if (!duration) return this.e('No duration given.')
        if (typeof (duration) !== "number") return this.e(`${duration} is not a number.`)
        if (isNaN(duration)) return this.e(`Duration is NaN.`);
        if (duration < 0) return this.e(`${duration} can't be negative.`);
        this.duration = duration
        return this;
    }
    _handleEdit() {
        if (!this.ctx) return this.e('Embed not sent yet.')
        if (this.ended) return this.e('Page system has already ended.')
        return true;
    }
    next() {
        this._handleEdit();
        return this.setIndex(this.index + 1)
    }

    previous() {
        this._handleEdit();
        return this.setIndex(this.index - 1)
    }
    /**
     * @param {Number} index The index of the page you want to select 
     * @returns {this}
     * @example // For the first page, use
     * ps.setIndex(0)
     * // For the second,
     * ps.setIndex(1)
     * // For the last page, use
     * ps.setIndex(this.index - 1)
     */
    setIndex(index) {
        if (!this.ctx) return this.e('Embed not sent yet.')
        if (this.ended) return this.e('Page system has already ended.')
        if (typeof (index) !== "number") return this.e(`'${index}' is not a number.`)
        if (isNaN(index)) return this.e(`'${index}' is NaN.`)
        if (!this.embeds[index]) return this.e(`No page at index '${index}'`)
        this.index = index;
        return this;
    }
    /**
     * @description Replaces every embed's footer by the wanted footer.
     */
    fixEmbeds() {
        this.embeds = this.embeds.map((e, i) => e.setFooter({
            text: this.footer(this.index + 1 + i, this.embeds.length)
        }))
    }
    /**
     * @param {Discord.ReplyMessageOptions | Discord.InteractionReplyOptions} opts 
     * @description Edits the reply to the message with the given data.
     * @example
     * let embed1 = new Discord.MessageEmbed().setDescription('no')
     * .edit({ embeds : [embed1] })
     */
    edit(opts) {
        if (this.ended || this.deleted) return;
        if (this.ctx == "interaction") return this.interaction.editReply(opts).catch(console.error)
        else if (this.ctx == "message") return this.reply.edit(opts).catch(console.error)
        else return this.e('No message to edit.')
    }
    /**
     * @description Will disable all the buttons.
     * @example
     * .disableButtons()
     */
    disableButtons() {
        if (!this.ctx) return this.e("No reply sended to disable it's embeds?")
        return this.edit({ components: [this.getRow(true)] }).catch(console.error)
    }
    /**
     * @description Ends the embed page system.
     * @returns {void}
     */
    end() {
        if (!this.ctx) return this.e("Nothing to end.")
        if (this.ended) return this.e('EBPS already ended.');
        this.disableButtons()
        return this.ended = true;
    }
    /**
     * @description Deletes the remply to the embed.
     */
    delete() {
        if (!this.ctx) return this.e('No message/interaction to delete ?');
        if (this.deleted) return;
        this.deleted = true
        this.ended = true;
        if (this.ctx == "message") return this.reply.delete();
        else return this.interaction.deleteReply();
    }
    /**
     * @returns {Discord.MessageEmbed}
     * @description Gives the current showed embed.
     * @example
     * .embed() instanceof Discord.MessageEmbed // true
     */
    embed() {
        return this.embeds[this.index]
    }
    /**
     * @description Refresh the embed.
     * @returns {Promise<Discord.Message>} The edited reply.
     */
    update() {
        return this.edit(this.getOpts())
    }
    /**
     * 
     * @param {boolean} disabled If the buttons should be returned disabled 
     * @returns {Discord.MessageOptions} Options used when editing/sending the page system embeds with buttons
     */
    getOpts(disabled) {
        return {
            embeds: [this.embed()],
            components: [this.getRow(disabled)]
        };
    }

    /**
     * @param {Discord.Message | Discord.CommandInteraction} ctx
     * @description Starts the embed pages. Make sure you use this method after you've added the embeds, set the channel, added the ids etc..
     * @returns {Discord.Message} The reply to the message if you want to use it
     */
    async start(ctx) {
        if (!ctx) return this.e('No message/interaction given.');
        if (ctx instanceof Discord.Message || ctx.author) {
            this.message = ctx;
            this.ctx = "message";
            this.setUserID(ctx.author.id)
        } else if (ctx instanceof Discord.CommandInteraction || ctx.user) {
            this.interaction = ctx;
            this.ctx = "interaction";
            this.setUserID(ctx.user.id)
        } else if (ctx instanceof Discord.Interaction){
            return this.e(`${ctx} is an interaction but not a command (it's type is "${ctx.type}").`)
        } else return this.e(`${ctx} is neiher an interaction or a message.`);

        let opts = this.getOpts();

        this.reply = await this[this.ctx].reply({ fetchReply: true, ...opts });

        if (!this.reply) return this.e('Could not fetch reply of the message/interaction');
        if (!this.getRow()) return;
        this.collector = this.reply.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: this.duration
        });

        this.collector.on('collect', int => {
            if (!int.isButton()) return;
            if (!this.filter(int)) return;
            int.deferUpdate();
            switch (int.customId) {
                case 'next':
                    this.next();
                    break;
                case 'previous':
                    this.previous();
                    break;
                case 'stop':
                    return this.collector.emit('end');
            }
            if (!this.ended) this.update();
        });
        this.collector.on('end', () => !this.ended ? this.end() : true)
        return this.reply;
    }
}