<<<<<<< HEAD
export = PageSystem;
declare class PageSystem {
    constructor(client: Discord.Client);
    client: Discord.Client;
    index: number;
    id: string;
    embeds: Discord.MessageEmbed[];
    message: any;
    interaction: any;
    reply: Discord.Message;
    collector: Discord.InteractionCollector<Discord.ButtonInteraction<Discord.CacheType>>;
    ended: boolean;
    started: boolean;
    deleted: boolean;
    duration: number;
    mainStyle: string;
    buttons: Discord.MessageButtonOptions[];
    footer: (index: any, total: any) => string;
    filter: (i: any) => boolean;
    get ctx(): "MESSAGE" | "INTERACTION";
    get type(): "message" | "interaction";
    get endUntill(): number;
    get currentEmbed(): Discord.MessageEmbed;
    addButton(o: Discord.MessageButtonOptions): this;
    removeButton(customId: string): this;
    editButton(customId: string, o: Discord.MessageButtonOptions): this;
    getRow(disabled?: boolean): Discord.MessageActionRow | null;
    setUserID(user: Discord.UserResolvable): this;
    setFooter(func: Function): this;
    setEmbeds(embeds: Discord.MessageEmbed[]): this;
    addEmbed(embed: Discord.MessageEmbed): this;
    fixEmbeds(embeds: Discord.MessageEmbed | Discord.MessageEmbed[] | Discord.MessageEmbed[][]): Discord.MessageEmbed[];
    addEmbeds(embeds: Discord.MessageEmbed[]): this;
    setDuration(duration: number): this;
    addDuration(duration: number): this;
    next(): Promise<void> | import(".");
    previous(): Promise<void> | import(".");
    setIndex(index: number): this;
    fixEmbedFooters(): void;
    edit(opts: Discord.MessageEditOptions): Promise<Discord.Message<boolean>>;
    disableButtons(): Promise<Discord.Message<boolean>>;
    end(): Promise<void> | Promise<Discord.Message<boolean>>;
    delete(): Promise<Discord.Message<boolean>>;
    update(): Promise<Discord.Message<boolean>>;
    getOpts(disabled?: boolean): {
        embeds: Discord.MessageEmbed[];
        components: Discord.MessageActionRow[];
    };
    isMessage(): boolean;
    isInteraction(): boolean;
    canEdit(): boolean;
    isValidCtx(ctx: any): boolean;
    checkForErrors(msg: any): string[];
    start(ctx: any): Promise<import(".")>;
}
import Discord = require("discord.js");
=======
import {
    Client,
    CommandInteraction, 
    ButtonInteraction,
    InteractionCollector,
    Message,
    MessageActionRow,
    MessageEmbed,
    MessageOptions,
    UserResolvable
} from "discord.js";
export declare class PageSystem {
    client: Client | null;
    index: number;
    id: string | null;
    embeds: MessageEmbed[];
    message: Message | null;
    interaction: CommandInteraction | null;
    collector: InteractionCollector<ButtonInteraction> | null;
    ended: boolean;
    started: boolean;
    deleted: boolean;
    duration: number | null;
    emojis: {
        previous: string;
        stop: string;
        next: string;
    };
    footer: Function;
    filter: Function;
    reply: Message | null;
    constructor(client: Client);
    get ctx(): "MESSAGE" | "INTERACTION";
    get _row(): {
        name: string;
        emoji: any;
        style: string;
    }[];
    get type(): string;
    get endUntill(): number;
    getRow(disabled?: boolean): MessageActionRow;
    setUserID(user: UserResolvable): this;
    setFooter(func: Function): this;
    setEmbeds(embeds: MessageEmbed[]): this;
    addEmbed(embed: MessageEmbed): this;
    fixEmbeds(embeds: MessageEmbed[]): MessageEmbed[];
    addEmbeds(embeds: MessageEmbed[]): this;
    setDuration(duration: number): this;
    addDuration(duration: number): this;
    next(): Promise<void> | this;
    previous(): Promise<void> | this;
    setIndex(index: number): this;
    edit(opts: MessageOptions): Promise<import("discord-api-types").APIMessage | Message<boolean>>;
    disableButtons(): Promise<import("discord-api-types").APIMessage | Message<boolean>>;
    end(): Promise<void> | Promise<import("discord-api-types").APIMessage | Message<boolean>>;
    delete(): Promise<void> | Promise<Message<boolean>>;
    embed(): MessageEmbed;
    update(): Promise<import("discord-api-types").APIMessage | Message<boolean>>;
    getOpts(disabled?: boolean): {
        embeds: MessageEmbed[];
        components: MessageActionRow[];
    };
    isMessage(): boolean;
    isInteraction(): boolean;
    canEdit(): boolean;
    isValidCtx(ctx: CommandInteraction | Message): boolean;
    checkForErrors(msg: CommandInteraction | Message): string[];
    start(ctx: CommandInteraction | Message): Promise<Message<boolean>>;
}
>>>>>>> 972f500e522dfdaa4e5a8b45dde8602dbd65491a
