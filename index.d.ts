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

type Context = Interaction | Message

export = Dispage;
declare class Dispage {
    constructor(client: Client);
    client: Client;
    index: number;
    embeds: MessageEmbed[];
    message: Message;
    interaction: Interaction;
    collector: InteractionCollector<ButtonInteraction>;
    reply: Message;
    ended: boolean;
    started: boolean;
    deleted: boolean;
    duration: number;
    mainStyle: string;
    buttons: {
        customId: string;
        emoji: string;
        style: string;
        label: string;
    }[];
    footer: (index: number, total: number) => string;
    filter: (int: ButtonInteraction) => boolean;
    showDisabledButtons: boolean;
    private _userIDs: Set<string>;
    get users(): string[];
    get ctx(): "MESSAGE" | "INTERACTION";
    get type(): string;
    get endUntill(): number;
    get currentEmbed(): MessageEmbed;
    _getId(user: UserResolvable): string;
    setMainStyle(style: MessageButtonStyle): this;
    shouldShowDisabledButtons(should?: boolean): this;
    removeUser(user: UserResolvable): this;
    addUser(user: UserResolvable): this;
    setUser(user: UserResolvable): this;
    /** @deprecated Use .setUser() instead. */
    setUserID(user: UserResolvable): this;
    addButton(o: object): this;
    removeButton(customId: string): this;
    editButton(customId: string, o: object): this;
    getRows(disabled?: boolean): MessageActionRow | null;
    setFooter(func: Function): this;
    setEmbeds(embeds: MessageEmbed[]): this;
    addEmbed(embed: MessageEmbed): this;
    addEmbeds(embeds: MessageEmbed[]): this;
    _fixEmbeds(embeds: MessageEmbed | MessageEmbed[] | MessageEmbed[][]): MessageEmbed[];
    setDuration(duration: number): this;
    addDuration(duration: number): this;
    next(): Promise<void> | this;
    previous(): Promise<void> | this;
    setIndex(index: number): this;
    _fixEmbedFooters(): void;
    edit(opts: MessageEditOptions): Promise<Message<boolean>>;
    disableButtons(): Promise<Message<boolean>>;
    end(): Promise<void> | Promise<Message<boolean>>;
    delete(): Promise<Message<boolean>>;
    update(): Promise<Message<boolean>>;
    getOpts(disabled?: boolean): {
        embeds: MessageEmbed[];
        components: MessageActionRow;
    };
    isMessage(): boolean;
    isInteraction(): boolean;
    canEdit(): boolean;
    isValidCtx(ctx: Context): boolean;
    checkForErrors(msg: Context): string[];
    start(ctx: Context): this;
}
