export = Dispage;
// Main
declare class Dispage {
    constructor(client: Discord.Client);
    client: Discord.Client;
    index: number;
    embeds: Embed[];
    message: Message;
    interaction: Discord.Interaction;
    collector: Discord.InteractionCollector<Discord.ButtonInteraction>;
    reply: Message;
    ended: boolean;
    started: boolean;
    deleted: boolean;
    duration: number;
    mainStyle: string;
    buttons: Discord.MessageButtonOptions[];
    filter: (int: Discord.ButtonInteraction) => boolean;
    _sdb: boolean;
    _userIDs: Set<string>;
    get users(): string[];
    get ctx(): "MESSAGE" | "INTERACTION";
    get type(): string;
    get endUntill(): number;
    get currentEmbed(): Embed;
    _getId(user: User): string;
    setMainStyle(style: Discord.MessageButtonStyleResolvable): this;
    showDisabledButtons(should: boolean): this;
    removeUser(user: User): this;
    addUser(user: User): this;
    setUser(user: User): this;
    /** @deprecated Use .setUser() instead. */
    setUserID(user: any): this;
    addButton(o: Discord.MessageButtonOptions): this;
    removeButton(customId: ButtonId): this;
    editButton(customId: ButtonId, o: Discord.MessageButtonOptions): this;
    getRows(disabled?: boolean): Discord.MessageActionRow | null;
    setEmbeds(embeds: Embed[]): this;
    addEmbed(embed: Embed): this;
    addEmbeds(embeds: Embed[]): this;
    _fixEmbeds(embeds: Embed | Embed[] | Embed[][]): Embed[];
    setDuration(duration: number): this;
    addDuration(duration: number): this;
    next(): Promise<this>;
    previous(): Promise<this>;
    changeToPage(index: number): Promise<Message>;
    doesIndexExist(index: number): boolean;
    setIndex(index: number): this;
    edit(opts: Discord.MessageEditOptions): Promise<Message>;
    disableButtons(): Promise<Message>;
    end(): Promise<Message>;
    delete(): Promise<Message>;
    update(): Promise<Message>;
    getOpts(disabled?: boolean): {
        embeds: Embed[];
        components: Discord.MessageActionRow;
    };
    isMessage(): boolean;
    isInteraction(): boolean;
    canEdit(): boolean;
    isValidCtx(ctx: Context): boolean;
    _createCollector(reply: Message): Discord.InteractionCollector<Discord.ButtonInteraction>;
    checkForErrors(msg: Context): string[];
    start(ctx: Context): Promise<this>;
}
// Types
type ButtonId = "previous" | "stop" | "next" | string
type Message = Discord.Message
type Embed = Discord.MessageEmbed
type User = Discord.UserResolvable
type Context = Discord.Message | Discord.Interaction

// Packages
import Discord = require("discord.js");
