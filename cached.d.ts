import {
    Client,
    InteractionCollector,
    UserResolvable,
    MessageEmbed,
    Interaction,
    Message,
    MessageOptions,
    MessageEditOptions,
    MessageActionRow,
    MessageButtonOptions,
    MessageButtonStyle,
    ButtonInteraction
} from "discord.js";

type Context = Discord.Interaction | Discord.Message

export = Dispage;
declare class Dispage {
    setMainStyle(style: MessageButtonStyle): this;
    removeUser(user: UserResolvable): this;
    addUser(user: UserResolvable): this;
    setUser(user: UserResolvable): this;
    addButton(o: MessageButtonOptions): this;
    removeButton(customId: string): this;
    editButton(customId: string, o: object): this;
    getRow(disabled?: boolean): MessageActionRow | null;
    setFooter(func: Function): this;
    setEmbeds(embeds: MessageEmbed[]): this;
    shouldShowDisabledButtons(should?: boolean): this;
    addEmbed(embed: MessageEmbed): this;
    fixEmbeds(embeds: MessageEmbed | MessageEmbed[] | MessageEmbed[][]): MessageEmbed[];
    addEmbeds(embeds: MessageEmbed[]): this;
    setDuration(duration: number): this;
    addDuration(duration: number): this;
    next(): Promise<void> | this;
    previous(): Promise<void> | this;
    setIndex(index: number): this;
    fixEmbedFooters(): void;
    edit(opts: MessageEditOptions): Promise<Message<boolean>>;
    disableButtons(): Promise<Message<boolean>>;
    end(): Promise<void> | Promise<Message<boolean>>;
    delete(): Promise<Message<boolean>>;
    update(): Promise<Message<boolean>>;
    getOpts(disabled?: boolean): MessageOptions;
    canEdit(): boolean;
    isMessage(): boolean;
    isInteraction(): boolean;
    isValidCtx(ctx: Context): boolean;
    checkForErrors(msg: Context): string[];
    start(ctx: Context): Promise<this>;
    /** @deprecated Use .setUser() instead. */
    private setUserID(user: UserResolvable): this;
    private _getId(user: UserResolvable): string;
}
