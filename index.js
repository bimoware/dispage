"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.PageSystem = void 0;
var discord_js_1 = require("discord.js");
var PageSystem = /** @class */ (function () {
    function PageSystem(client) {
        var _this = this;
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
        this.footer = function (index, total) { return total - 1 ? "\uD83D\uDCDC Page ".concat(index, "/").concat(total) : ''; };
        this.filter = function (i) { return _this.id === i.user.id; };
    }
    Object.defineProperty(PageSystem.prototype, "ctx", {
        get: function () {
            return this.message ? "MESSAGE" : this.interaction ? "INTERACTION" : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PageSystem.prototype, "_row", {
        get: function () {
            var _this = this;
            return [
                ['previous', 'PRIMARY'],
                ['stop', 'DANGER'],
                ['next', 'PRIMARY']
            ].map(function (arr) {
                return {
                    name: arr[0],
                    emoji: _this.emojis[arr[0]],
                    style: arr[1]
                };
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PageSystem.prototype, "type", {
        get: function () {
            return this.ctx.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PageSystem.prototype, "endUntill", {
        get: function () {
            return this.collector ? (Date.now() - this.collector.options.time) : null;
        },
        enumerable: false,
        configurable: true
    });
    PageSystem.prototype.getRow = function (disabled) {
        if (disabled === void 0) { disabled = false; }
        var ar = new discord_js_1.MessageActionRow();
        var previous = this.embeds[this.index - 1];
        var next = this.embeds[this.index + 1];
        function format(a) {
            var d = disabled
                || (a.name == "previous" && !previous)
                || (a.name == "next" && !next)
                || false;
            var button = new discord_js_1.MessageButton()
                .setCustomId(a.name)
                .setEmoji(a.emoji)
                .setStyle(a.style)
                .setDisabled(d);
            return ar.addComponents(button);
        }
        this._row.forEach(function (b) { return format(b); });
        return ar.components.length ? ar : null;
    };
    PageSystem.prototype.setUserID = function (user) {
        this.id = this.client.users.resolve(user).id;
        return this;
    };
    PageSystem.prototype.setFooter = function (func) {
        if (func === void 0) { func = function () { return ''; }; }
        this.footer = func;
        return this;
    };
    PageSystem.prototype.setEmbeds = function (embeds) {
        embeds = this.fixEmbeds(embeds);
        this.embeds = embeds;
        return this;
    };
    PageSystem.prototype.addEmbed = function (embed) {
        return this.addEmbeds([embed]);
    };
    PageSystem.prototype.fixEmbeds = function (embeds) {
        embeds = embeds instanceof discord_js_1.MessageEmbed ? [embeds] : embeds;
        embeds = Array.isArray(embeds[0]) ? embeds[0] : embeds;
        return embeds;
    };
    PageSystem.prototype.addEmbeds = function (embeds) {
        var _this = this;
        embeds = this.fixEmbeds(embeds);
        embeds.forEach(function (embed) { return _this.addEmbed(embed); });
        return this;
    };
    PageSystem.prototype.setDuration = function (duration) {
        this.duration = duration;
        return this;
    };
    PageSystem.prototype.addDuration = function (duration) {
        this.duration += duration;
        return this;
    };
    PageSystem.prototype.next = function () {
        if (this.canEdit())
            return this.setIndex(this.index + 1);
        else
            return false;
    };
    PageSystem.prototype.previous = function () {
        if (this.canEdit())
            return this.setIndex(this.index - 1);
        else
            return false;
    };
    PageSystem.prototype.setIndex = function (index) {
        this.index = index;
        if (this.canEdit())
            return this.update();
        return this;
    };
    PageSystem.prototype.edit = function (opts) {
        if (this.ended || this.deleted)
            return Promise.reject('No message to edit.');
        if (this.ctx == "INTERACTION")
            return this.interaction.editReply(opts);
        else if (this.ctx == "MESSAGE")
            return this.reply.edit(opts);
    };
    PageSystem.prototype.disableButtons = function () {
        return this.edit({ components: [this.getRow(true)] });
    };
    PageSystem.prototype.end = function () {
        if (this.ended)
            return Promise.resolve();
        this.ended = true;
        return this.disableButtons();
    };
    PageSystem.prototype["delete"] = function () {
        this.deleted = true;
        this.ended = true;
        if (this.ctx == "MESSAGE")
            return this.reply["delete"]();
        else if (this.ctx == "INTERACTION")
            return this.interaction.deleteReply();
        else
            return Promise.reject('No message to edit.');
    };
    PageSystem.prototype.embed = function () {
        return this.embeds[this.index];
    };
    PageSystem.prototype.update = function () {
        return this.edit(this.getOpts());
    };
    PageSystem.prototype.getOpts = function (disabled) {
        if (disabled === void 0) { disabled = false; }
        return {
            embeds: [this.embed()],
            components: [this.getRow(disabled)]
        };
    };
    PageSystem.prototype.isMessage = function () {
        return this.ctx ? this.ctx === "MESSAGE" : null;
    };
    PageSystem.prototype.isInteraction = function () {
        return this.ctx ? this.ctx === "INTERACTION" : null;
    };
    PageSystem.prototype.canEdit = function () {
        return this.ctx && !this.ended && !this.deleted;
    };
    PageSystem.prototype.isValidCtx = function (ctx) {
        return [discord_js_1.CommandInteraction, discord_js_1.Message].some(function (c) { return ctx instanceof c; });
    };
    PageSystem.prototype.checkForErrors = function (msg) {
        var errors = [];
        function add(error) { this.errors.push(error); }
        ;
        if (!this.isValidCtx(msg))
            add('Invalid context. Must be a message or interaction');
        if (!this.ctx)
            add('No embed sent yet.');
        if (this.ended)
            add('Page system has ended already.');
        if (!msg)
            add('No message/interaction given.');
        if (msg instanceof discord_js_1.Message && msg.author) {
            this.message = msg;
            this.setUserID(msg.author.id);
        }
        else if (msg instanceof discord_js_1.CommandInteraction && msg.user) {
            this.interaction = msg;
            this.setUserID(msg.user.id);
        }
        else if (msg instanceof discord_js_1.Interaction) {
            add("".concat(msg, " is an interaction but not a command (it's type is \"").concat(msg.type, "\")."));
        }
        else
            add("".concat(msg, " is neiher an interaction or a message."));
        if (!this.embeds.length)
            add('Embed array is empty.');
        else {
            this.embeds.forEach(function (embed, i) {
                if (!(embed instanceof discord_js_1.MessageEmbed))
                    add("Embed at position ".concat(i, " is not an embed."));
            });
        }
        if (typeof (this.index) !== "number"
            || isNaN(this.index)
            || this.index < 0
            || this.index > 10)
            add("Invalid index ".concat(this.index));
        if (!this.embeds[this.index])
            add("No embed at index ".concat(this.index));
        if (typeof (this.footer) !== "function")
            add("Footer is not a function but a ".concat(typeof (this.footer), "."));
        if (typeof (this.filter) !== "function")
            add("Filter is not a function but a ".concat(typeof (this.footer), "."));
        if (typeof (this.id) !== "string")
            add("ID \"".concat(this.id, "\" is not a string."));
        if (!(this.id.split(' ').every(function (c) { return Number(c); })))
            add("ID \"".concat(this.id, "\" is not a valid user ID."));
        return errors;
    };
    PageSystem.prototype.start = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        errors = this.checkForErrors(ctx);
                        if (errors.length)
                            throw new Error("Errors ecountered :\n" + errors.map(function (e, i) { return "".concat(i + 1, " - ").concat(e); }).join('\n'));
                        _a = this;
                        return [4 /*yield*/, this[this.type].reply(__assign({ fetchReply: true }, this.getOpts()))];
                    case 1:
                        _a.reply = _b.sent();
                        if (!this.reply)
                            throw new Error('Could not fetch reply of the message/interaction');
                        if (!this.getRow())
                            return [2 /*return*/];
                        this.collector = this.reply.createMessageComponentCollector({
                            componentType: 'BUTTON',
                            time: this.duration
                        });
                        this.collector.on('collect', function (int) {
                            if (!_this.filter(int))
                                return;
                            switch (int.customId) {
                                case 'next':
                                    _this.next();
                                    break;
                                case 'previous':
                                    _this.previous();
                                    break;
                                case 'stop':
                                    _this.collector.emit('end');
                            }
                            if (!_this.ended)
                                _this.update();
                        });
                        this.collector.on('end', function () { _this.end(); });
                        return [2 /*return*/, this.reply];
                }
            });
        });
    };
    return PageSystem;
}());
exports.PageSystem = PageSystem;
