const {
    Client,
    CommandInteraction,
    ButtonInteraction,
    Interaction,
    InteractionCollector,
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageOptions,
    UserResolvable,
} = require('discord.js');

export class PageSystem {
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

    getRow(disabled = false) {
        let ar = new MessageActionRow()
        let previous = this.embeds[this.index - 1];
        let next = this.embeds[this.index + 1];
        function format(a) {
            let d = disabled
                || (a.name == "previous" && !previous)
                || (a.name == "next" && !next)
                || false;

            let button = new MessageButton()
                .setCustomId(a.name)
                .setEmoji(a.emoji)
                .setStyle(a.style)
                .setDisabled(d);
            return ar.addComponents(button);
        }
        this._row.forEach(b => format(b));

        return ar.components.length ? ar : null;
    }

    setUserID(user) {
        this.id = this.client.users.resolve(user).id;
        return this;
    }

    setFooter(func) {
        this.footer = func || (() => '');
        return this;
    }

    setEmbeds(embeds) {
        embeds = this.fixEmbeds(embeds);
        this.embeds = embeds;
        return this;
    }

    addEmbed(embed) {
        return this.addEmbeds([embed]);
    }
    fixEmbeds(embeds) {
        embeds = embeds instanceof MessageEmbed ? [embeds] : embeds;
        embeds = Array.isArray(embeds[0]) ? embeds[0] : embeds
        return embeds;
    }

    addEmbeds(embeds) {
        embeds = this.fixEmbeds(embeds);
        embeds.forEach(embed => this.addEmbed(embed));
        return this;
    }

    setDuration(duration) {
        this.duration = duration
        return this;
    }
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

    setIndex(index) {
        this.index = index;
        if (this.canEdit()) this.update()
        return this;
    }

    edit(opts) {
        if (this.ended || this.deleted) return Promise.reject('No message to edit.')
        if (this.ctx == "INTERACTION") return this.interaction.editReply(opts)
        else if (this.ctx == "MESSAGE") return this.reply.edit(opts)
    }

    disableButtons() {
        return this.edit({ components: [this.getRow(true)] })
    }

    end() {
        if(this.ended) return Promise.resolve();
        this.ended = true;
        return this.disableButtons()
    }

    delete() {
        this.deleted = true;
        this.ended = true;
        if (this.ctx == "MESSAGE") return this.reply.delete();
        else if (this.ctx == "INTERACTION") return this.interaction.deleteReply();
        else return Promise.reject('No message to edit.');
    }

    embed() {
        return this.embeds[this.index]
    }

    update() {
        return this.edit(this.getOpts())
    }

    getOpts(disabled = false) {
        return {
            embeds: [this.embed()],
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
        return this.ctx && !this.ended && !this.deleted
    }
    isValidCtx(ctx) {
        return [CommandInteraction, Message].some(c => ctx instanceof c);
    }
    checkForErrors(msg) {
        let errors = []
        function add(error) { this.errors.push(error) };
        if (!this.isValidCtx(msg)) add('Invalid context. Must be a message or interaction');
        if (!this.ctx) add('No embed sent yet.')
        if (this.ended) add('Page system has ended already.')
        if (!msg) add('No message/interaction given.');
        if (msg instanceof Message && msg.author) {
            this.message = msg;
            this.setUserID(msg.author.id)
        } else if (msg instanceof CommandInteraction && msg.user) {
            this.interaction = msg;
            this.setUserID(msg.user.id)
        } else if (msg instanceof Interaction) {
            add(`${msg} is an interaction but not a command (it's type is "${msg.type}").`)
        } else add(`${msg} is neiher an interaction or a message.`);

        if (!this.embeds.length) add('Embed array is empty.')
        else {
            this.embeds.forEach((embed, i) => {
                if (!(embed instanceof MessageEmbed)) add(`Embed at position ${i} is not an embed.`);
            })
        }
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
        if (!(this.id.split(' ').every(c => Number(c)))) add(`ID "${this.id}" is not a valid user ID.`);
        return errors;
    }

    async start(ctx) {
        let errors = this.checkForErrors(ctx)
        if (errors.length)
            throw new Error("Errors ecountered :\n" + errors.map((e, i) => `${i + 1} - ${e}`).join('\n'))

        this.reply = await this[this.type].reply({
            fetchReply: true,
            ...this.getOpts()
        });

        if (!this.reply) throw new Error('Could not fetch reply of the message/interaction');
        if (!this.getRow()) return;

        this.collector = this.reply.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: this.duration,
        });

        this.collector.on('collect', (int) => {
            if(!this.filter(int)) return;
            switch (int.customId) {
                case 'next':
                    this.next();
                    break;
                case 'previous':
                    this.previous();
                    break;
                case 'stop':
                    this.collector.emit('end');
            }
            if (!this.ended) this.update();
        });

        this.collector.on('end', () =>{ this.end() });

        return this.reply;
    }
}