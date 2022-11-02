import {
    Client,
    InteractionCollector,
    Message,
    ActionRowBuilder,
    Interaction,
    ButtonStyle,
    BaseMessageOptions,
    EmbedBuilder,
    UserResolvable,
    ButtonInteraction
} from "discord.js";

// Types
type ButtonId = "previous" | "stop" | "next" | string
type Embed = EmbedBuilder
type User = UserResolvable
type Context = Message | Interaction

declare class Dispage {
    /** @param {Client} client  */
    constructor(client: Client);
    client: Client<boolean>;
    stopReason: string;
    index: number;
    /** @type {Embed[]} */
    embeds: Embed[];
    message?: Message;
    interaction?: Interaction;
    collector: InteractionCollector<ButtonInteraction>;
    reply: Message;
    ended: boolean;
    started: boolean;
    deleted: boolean;
    duration: number;
    mainStyle: ButtonStyle;
    styles: string[];
    buttons: {
        customId: string;
        emoji: string;
        style: string;
        label: string;
    }[];
    filter: (int: ButtonInteraction) => boolean;
    _hdb: boolean;
    /** @type {Set<string>} */
    _userIDs: Set<string>;
    get users(): string[];
    get ctx(): "MESSAGE" | "INTERACTION";
    get type(): string;
    get endUntill(): number;
    /** @returns {Embed} */
    get currentEmbed(): Embed;
    _getId(user: any): any;
    setMainStyle(style: ButtonStyle): this;
    hideDisabledButtons(should?: boolean): this;
    removeUser(user: User): this;
    addUser(user: User): this;
    setUser(user: User): this;
    addButton(o: object): this;
    removeAllButtons(): this;
    findButtonAndRemove(query: Function): this;
    removeButton(customId: string): this;
    editButton(customId: string, o: object): this;
    getRows(disabled?: boolean): ActionRowBuilder | null;
    setEmbeds(embeds: Embed[]): this;
    addEmbed(embed: Embed): this;
    addEmbeds(embeds: Embed[]): this;
    _fixEmbeds(embeds: Embed | Embed[] | Embed[][]): Embed[];
    setDuration(duration: number): this;
    addDuration(duration: number): this;
    next(int: any): Promise<Message | false>;
    previous(int: any): Promise<Message | false>;
    doesIndexExist(index: number): boolean;
    changeToPage(index: number, int: any): Promise<Message>;
    setIndex(index: number): this;
    end(reason: string): Promise<void | Message>;
    delete(): Promise<Message>;
    getOpts(disabled?: boolean): BaseMessageOptions;
    isMessage(): boolean;
    isInteraction(): boolean;
    canEdit(): boolean;
    isValidCtx(ctx: Context): boolean;
    _createCollector(reply: Message): InteractionCollector<any>;
    checkForErrors(ctx: any): string[];
    start(ctx: Context): Promise<this>;
}
export = Dispage;
