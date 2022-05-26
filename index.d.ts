export = Dispage;
import {
    Client,
    MessageEmbed,
    Message,
    MessageButtonStyle,
    InteractionCollector,
    UserResolvable,
    MessageOptions,
    MessageEditOptions,
    MessageActionRow,
    Interaction,
    ButtonInteraction,
    MessageButtonOptions
} from 'discord.js'

// Types
type ButtonId = "previous" | "stop" | "next" | string
type Embed = MessageEmbed
type User = UserResolvable
type Context = Message | Interaction

declare class Dispage {
    constructor(client: Client);
    client: Client;
    index: number;
    embeds: Embed[];
    message: Message | null;
    interaction: Interaction | null;
    collector: InteractionCollector<ButtonInteraction>;
    reply: Message;
    ended: boolean;
    started: boolean;
    deleted: boolean;
    duration: number;
    mainStyle: MessageButtonStyle;
    buttons: MessageButtonOptions[];
    filter: (int: ButtonInteraction) => boolean;
    _sdb: boolean;
    _userIDs: Set<string>;
    get users(): string[];
    get ctx(): "MESSAGE" | "INTERACTION";
    get type(): string;
    get endUntill(): number;
    get currentEmbed(): Embed;
    _getId(user: User): any;
    setMainStyle(style: MessageButtonStyle): this;
    showDisabledButtons(should?: boolean): this;
    removeUser(user: User): this;
    addUser(user: User): this;
    setUser(user: User): this;
    addButton(o: MessageButtonOptions): this;
    removeAllButtons(): this;
    findButtonAndRemove(query: Function): this;
    removeButton(customId: ButtonId): this;
    editButton(customId: ButtonId, o: MessageButtonOptions): this;
    getRows(disabled?: boolean): MessageActionRow | null;
    setEmbeds(embeds: Embed[]): this;
    addEmbed(embed: Embed): this;
    addEmbeds(embeds: Embed[]): this;
    _fixEmbeds(embeds: Embed | Embed[] | Embed[][]): Embed[];
    setDuration(duration: number): this;
    addDuration(duration: number): this;
    next(): Promise<Message | false>;
    previous(): Promise<Message | false>;
    doesIndexExist(index: number): boolean;
    changeToPage(index: number): Promise<Message>;
    setIndex(index: number): this;
    edit(opts: MessageEditOptions): Promise<Message>;
    end(reason: "button" | "time"): Promise<void | Message>;
    delete(): Promise<Message>;
    update(): Promise<Message>;
    getOpts(disabled?: boolean): MessageOptions;
    isMessage(): boolean;
    isInteraction(): boolean;
    canEdit(): boolean;
    isValidCtx(ctx: Context): boolean;
    _createCollector(reply: Message): InteractionCollector<ButtonInteraction>;
    checkForErrors(ctx: Context): string[];
    start(ctx: Context): Promise<this>;
}