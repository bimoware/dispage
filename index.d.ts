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

export class PageSystem {
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
