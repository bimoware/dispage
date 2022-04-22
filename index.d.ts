import {
    Client,
    CommandInteraction, 
    InteractionCollector, 
    Message,
    MessageActionRow,
    MessageButtonStyle,
    MessageEditOptions,
    MessageEmbed,
    MessageOptions,
    UserResolvable
} from "discord.js";

declare class PageSystem {
    public constructor(client: Client);
    public index: number;
    public id: string | null;
    public embeds: MessageEmbed[] | object[] | null;
    public ctx: "INTERACTION" | "MESSAGE" | null;
    public message: Message | null;
    public interaction: CommandInteraction | null;
    public collector: InteractionCollector | null;
    public ended: boolean;
    public started: boolean;
    public deleted: boolean;
    public duration: number | null;
    public emojis: {
        previous: string,
        stop: string,
        next: string
    }
    public footer: Function;
    public filter: Function;
    private e: Function;
    private _row: {
        name: string,
        emoji: string,
        style: MessageButtonStyle
    }[]
    public type: string;
    public endUntill: number | null;
    public getRow(disabled?: boolean): MessageActionRow;
    public setUserID(id: UserResolvable): this;
    public setFooter(footer: Function): this;
    public setEmbeds(...embeds: MessageEmbed[]): this;
    public addEmbed(embed: MessageEmbed): this;
    public setDuration(duration: number): this;
    public next(): this;
    public previous(): this;
    public setIndex(index: number): this;
    private _fixEmbeds(): this;
    public edit(opts: MessageEditOptions): this;
    public disableButtons(): this;
    public end(): this;
    public delete(): this; 
    public embed(): MessageEmbed; 
    public update(): Promise<Message>; 
    public getOpts(disabled?: boolean): MessageOptions; 
    public async start(ctx: Message | CommandInteraction): Message;
}
export = PageSystem;