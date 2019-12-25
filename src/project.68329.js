window.__require = function t(e, o, n) {
    function i(c, a) {
        if (!o[c]) {
            if (!e[c]) {
                var s = c.split("/");
                if (s = s[s.length - 1],
                !e[s]) {
                    var l = "function" == typeof __require && __require;
                    if (!a && l)
                        return l(s, !0);
                    if (r)
                        return r(s, !0);
                    throw new Error("Cannot find module '" + c + "'")
                }
            }
            var u = o[c] = {
                exports: {}
            };
            e[c][0].call(u.exports, function(t) {
                return i(e[c][1][t] || t)
            }, u, u.exports, t, e, o, n)
        }
        return o[c].exports
    }
    for (var r = "function" == typeof __require && __require, c = 0; c < n.length; c++)
        i(n[c]);
    return i
}({
    AudioPlayer: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "6ded9VqaA5MjZErune4OGJZ", "AudioPlayer");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }();
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i, r = t("../loader/loader_mgr"), c = t("../util"), a = t("../base/SingletonClass"), s = t("../localStorage/LocalStorage"), l = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.clip_cache = new Map,
                e.loading_map = new Map,
                e.music_id = -1,
                e.sound_ids = [],
                e
            }
            return n(e, t),
            e.ins = function() {
                return t.ins.call(this)
            }
            ,
            e.prototype.init = function() {
                this.set_music_mute(s.LocalStorage.ins().getLocal(s.CONST_STORAGE_KEY.KEY_MUSIC_IS_MUTE, !1)),
                this.set_music_volume(s.LocalStorage.ins().getLocal(s.CONST_STORAGE_KEY.KEY_MUSIC_VOLUME, .5)),
                this.set_sound_mute(s.LocalStorage.ins().getLocal(s.CONST_STORAGE_KEY.KEY_SOUND_IS_MUTE, !1)),
                this.set_sound_volume(s.LocalStorage.ins().getLocal(s.CONST_STORAGE_KEY.KEY_SOUND_VOLUME, 1))
            }
            ,
            e.prototype.flush = function() {}
            ,
            e.prototype.play_music = function(t) {
                this.music_id >= 0 && this.stop_music();
                var e = c.strfmt("sound/{0}", t);
                if (this.curr_music = t,
                !this.music_mute) {
                    var o = this.clip_cache.get(e);
                    if (o)
                        this.play_clip(o, this.music_volume, !0, i.Music);
                    else {
                        var n = {
                            type: i.Music,
                            name: t,
                            path: e,
                            volume: this.music_volume,
                            loop: !0
                        };
                        this.load_task(n)
                    }
                }
            }
            ,
            e.prototype.stop_music = function() {
                this.music_id < 0 || (cc.audioEngine.stop(this.music_id),
                this.music_id = -1)
            }
            ,
            e.prototype.get_music_mute = function() {
                return this.music_mute
            }
            ,
            e.prototype.set_music_mute = function(t) {
                this.music_mute = t,
                s.LocalStorage.ins().setLocal(s.CONST_STORAGE_KEY.KEY_MUSIC_IS_MUTE, t),
                this.music_id < 0 ? !t && this.curr_music && this.play_music(this.curr_music) : t ? cc.audioEngine.pause(this.music_id) : cc.audioEngine.resume(this.music_id)
            }
            ,
            e.prototype.set_music_volume = function(t) {
                this.music_volume = t,
                this.music_id >= 0 && cc.audioEngine.setVolume(this.music_id, t),
                s.LocalStorage.ins().setLocal(s.CONST_STORAGE_KEY.KEY_MUSIC_VOLUME, t)
            }
            ,
            e.prototype.load_task = function(t) {
                var e = t.path;
                this.loading_map.get(e) || (this.loading_map.set(e, !0),
                r.loader_mgr.get_inst().loadRawAsset(e, c.gen_handler(this.on_clip_loaded, this, t)))
            }
            ,
            e.prototype.on_clip_loaded = function(t, e) {
                this.clip_cache.set(t.path, e),
                t.type == i.Music && t.name != this.curr_music || this.play_clip(e, t.volume, t.loop, t.type, t.cb)
            }
            ,
            e.prototype.play_clip = function(t, e, o, n, r) {
                var c = this
                  , a = cc.audioEngine.play(t, o, e);
                n == i.Music ? this.music_id = a : n == i.Sound && (this.sound_ids.push(a),
                cc.audioEngine.setFinishCallback(a, function() {
                    c.on_sound_finished(a),
                    r && r.exec()
                }))
            }
            ,
            e.prototype.on_sound_finished = function(t) {
                var e = this.sound_ids.findIndex(function(e) {
                    return e == t
                });
                -1 != e && this.sound_ids.splice(e, 1)
            }
            ,
            e.prototype.play_sound = function(t, e) {
                if (!this.sound_mute) {
                    var o = c.strfmt("sound/{0}", t)
                      , n = this.clip_cache.get(o);
                    if (n)
                        this.play_clip(n, this.sound_volume, !1, i.Sound, e);
                    else {
                        var r = {
                            type: i.Sound,
                            name: t,
                            path: o,
                            volume: this.sound_volume,
                            loop: !1,
                            cb: e
                        };
                        this.load_task(r)
                    }
                }
            }
            ,
            e.prototype.get_sound_mute = function() {
                return this.sound_mute
            }
            ,
            e.prototype.set_sound_mute = function(t) {
                this.sound_mute = t,
                this.sound_ids.forEach(function(e) {
                    t ? cc.audioEngine.pause(e) : cc.audioEngine.resume(e)
                }),
                s.LocalStorage.ins().setLocal(s.CONST_STORAGE_KEY.KEY_SOUND_IS_MUTE, t)
            }
            ,
            e.prototype.set_sound_volume = function(t) {
                this.sound_volume = t,
                this.sound_ids.forEach(function(e) {
                    cc.audioEngine.setVolume(e, t)
                }),
                s.LocalStorage.ins().setLocal(s.CONST_STORAGE_KEY.KEY_SOUND_VOLUME, t)
            }
            ,
            e.prototype.stop_sound = function() {
                this.sound_ids.forEach(function(t) {
                    cc.audioEngine.stop(t)
                }),
                this.sound_ids.length = 0
            }
            ,
            e.prototype.clear_cache = function() {
                this.clip_cache.forEach(function(t, e) {
                    r.loader_mgr.get_inst().release(t)
                }),
                this.clip_cache.clear(),
                this.loading_map.clear(),
                cc.audioEngine.uncacheAll()
            }
            ,
            e
        }(a.default);
        o.AudioPlayer = l,
        function(t) {
            t[t.Music = 1] = "Music",
            t[t.Sound = 2] = "Sound"
        }(i || (i = {})),
        o.AUDIO_CONFIG = {
            Audio_Btn: "button",
            Audio_levelup: "levelup",
            Audio_star: "star",
            Audio_balls: "balls",
            Audio_Bgm: "bg",
            Audio_gameover: "gameover",
            Audio_win: "win",
            Audio_congra: "congra"
        },
        cc._RF.pop()
    }
    , {
        "../base/SingletonClass": "SingletonClass",
        "../loader/loader_mgr": "loader_mgr",
        "../localStorage/LocalStorage": "LocalStorage",
        "../util": "util"
    }],
    BallItem: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "908e7hGo41Op5knNUQ8AuMr", "BallItem");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }()
          , i = this && this.__decorate || function(t, e, o, n) {
            var i, r = arguments.length, c = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                c = Reflect.decorate(t, e, o, n);
            else
                for (var a = t.length - 1; a >= 0; a--)
                    (i = t[a]) && (c = (r < 3 ? i(c) : r > 3 ? i(e, o, c) : i(e, o)) || c);
            return r > 3 && c && Object.defineProperty(e, o, c),
            c
        }
        ;
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r, c = t("../GameConst"), a = t("../model/GameModel"), s = t("../../common/util"), l = t("../../common/localStorage/LocalStorage"), u = cc._decorator, p = u.ccclass, _ = u.property, h = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.ball_type = 0,
                e.ball_icon = null,
                e._ball_status = 0,
                e._power_scale = 1,
                e
            }
            return n(e, t),
            Object.defineProperty(e.prototype, "ball_status", {
                get: function() {
                    return this._ball_status
                },
                set: function(t) {
                    var e = this;
                    switch (this._ball_status = t,
                    t) {
                    case r.onLand:
                        this.scheduleOnce(function() {
                            e.node && e.node.active && (e.node.setPosition(c.default.ins().ball_init_x, c.default.ins().ball_init_y),
                            e.ball_status = r.onReady)
                        }, 0);
                        break;
                    case r.onReady:
                    case r.onRemoved:
                    }
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "power_scale", {
                get: function() {
                    return this._power_scale
                },
                set: function(t) {
                    this._power_scale = t,
                    this.ball_icon.node.setScale(t > 1 ? 1.5 : 1)
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.reset = function() {
                this.node.stopAllActions(),
                this._ball_status = r.onRemoved,
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0),
                this.power_scale = 1,
                this.node.active = !1
            }
            ,
            e.prototype.init = function(t, e, o) {
                this.power_scale = 1,
                this.node.x = t,
                this.node.y = e,
                this.ball_status = o;
                var n = l.LocalStorage.ins().getLocal(l.CONST_STORAGE_KEY.KEY_SLEECTQQ, 0);
                s.load_plist_img(this.ball_icon, "texture/plist/customize", "ball" + n)
            }
            ,
            e.prototype.fireBall = function(t) {
                var e = t * Math.PI / 180
                  , o = c.default.ins().ball_speed + 100 * a.default.ins().ball_fire_speed;
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(Math.sin(e) * o, Math.cos(e) * o),
                this.ball_status = r.onFire
            }
            ,
            e.prototype.onBeginContact = function(t, e, o) {
                switch (o.tag) {
                case 1:
                    this.node.active && (this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0),
                    this.ball_status = r.onLand)
                }
            }
            ,
            i([_(cc.Integer)], e.prototype, "ball_type", void 0),
            i([_(cc.Sprite)], e.prototype, "ball_icon", void 0),
            e = i([p], e)
        }(cc.Component);
        o.default = h,
        function(t) {
            t[t.onReady = 0] = "onReady",
            t[t.onLand = 1] = "onLand",
            t[t.onFire = 2] = "onFire",
            t[t.onRemoved = 3] = "onRemoved"
        }(r = o.EnumBallStatus || (o.EnumBallStatus = {})),
        cc._RF.pop()
    }
    , {
        "../../common/localStorage/LocalStorage": "LocalStorage",
        "../../common/util": "util",
        "../GameConst": "GameConst",
        "../model/GameModel": "GameModel"
    }],
    BrickItem: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "8395bFNuq1NjrVnqs7rG2hF", "BrickItem");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }()
          , i = this && this.__decorate || function(t, e, o, n) {
            var i, r = arguments.length, c = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                c = Reflect.decorate(t, e, o, n);
            else
                for (var a = t.length - 1; a >= 0; a--)
                    (i = t[a]) && (c = (r < 3 ? i(c) : r > 3 ? i(e, o, c) : i(e, o)) || c);
            return r > 3 && c && Object.defineProperty(e, o, c),
            c
        }
        ;
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = t("../model/GameModel")
          , c = t("../../common/event/EventDispatch")
          , a = t("../GameConst")
          , s = t("./BallItem")
          , l = t("../../common/audio/AudioPlayer")
          , u = t("../../common/localStorage/LocalStorage")
          , p = cc._decorator
          , _ = p.ccclass
          , h = p.property
          , d = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.lb_hp = null,
                e.icon = null,
                e.icon_hp_reduce = null,
                e.icon_power = null,
                e.brick_type = 0,
                e.star_num = 0,
                e.ball_num = 0,
                e.effect_type = 0,
                e.brick_radius_mul = 1,
                e._hp = 1,
                e._color_hp = 1,
                e
            }
            return n(e, t),
            Object.defineProperty(e.prototype, "hp", {
                get: function() {
                    return this._hp
                },
                set: function(t) {
                    var e = this
                      , o = this._hp;
                    if (this._hp = t,
                    t <= 0) {
                        if (o > 0) {
                            if (this.ball_num > 0) {
                                for (var n = 0; n < this.ball_num; n++)
                                    c.EventDispatch.ins().fire(c.Event_Name.GAME_CREATE_BALL);
                                l.AudioPlayer.ins().play_sound(l.AUDIO_CONFIG.Audio_balls)
                            }
                            this.star_num > 0 && (c.EventDispatch.ins().fire(c.Event_Name.GAME_STAR_GET_EFFECT, this.node.x, this.node.y, this.star_num),
                            r.default.ins().ball_power += this.star_num,
                            l.AudioPlayer.ins().play_sound(l.AUDIO_CONFIG.Audio_star)),
                            this.effect_type > 0 && c.EventDispatch.ins().fire(c.Event_Name.GAME_POWER_TYPE_CHANGED, this.effect_type),
                            c.EventDispatch.ins().fire(c.Event_Name.GAME_PLAY_BRICK_REMOVE_EFFECT, this.node.x, this.node.y, this.icon_hp_reduce.color)
                        }
                        this.node.active = !1
                    } else {
                        this.lb_hp.string = "" + (t > 1e6 ? Math.round(t / 1e6) + "M" : t > 1e3 ? Math.round(t / 1e3) + "K" : t);
                        var i = u.LocalStorage.ins().getLocal(u.CONST_STORAGE_KEY.KEY_SLEECTFG, 0)
                          , s = a.default.ins().theme_config[i];
                        this.icon_hp_reduce.color = this.icon.color = a.default.ins().theme_config[0].color[Math.ceil(t / this._color_hp) - 1] || s.color[0],
                        t < o && this.icon_hp_reduce.getNumberOfRunningActions() <= 0 && (this.icon_hp_reduce.active = !0,
                        this.icon_hp_reduce.opacity = 255,
                        this.icon_hp_reduce.runAction(cc.sequence(cc.blink(.2, 1), cc.callFunc(function() {
                            e.icon_hp_reduce && (e.icon_hp_reduce.active = !1)
                        }))))
                    }
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.onLoad = function() {
                this.icon_power && this.icon_power.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1, 1.2, 1.2), cc.scaleTo(1, 1, 1))))
            }
            ,
            e.prototype.init = function(t, e) {
                var o = u.LocalStorage.ins().getLocal(u.CONST_STORAGE_KEY.KEY_SLEECTFG, 0);
                a.default.ins().theme_config[o];
                t = (t = t > a.default.ins().theme_config[0].color.length ? a.default.ins().theme_config[0].color.length : t) > 0 ? t : 1,
                this._color_hp = Math.ceil(e / t),
                this._hp = e,
                this.hp = e,
                this.icon_hp_reduce.active = !1,
                this.icon_hp_reduce.stopAllActions()
            }
            ,
            e.prototype.reset = function() {
                this.node.stopAllActions(),
                this.node.active = !1
            }
            ,
            e.prototype.update = function(t) {
                this.lb_hp.node.rotation !== -this.node.rotation && (this.lb_hp.node.rotation = -this.node.rotation)
            }
            ,
            e.prototype.onEndContact = function(t, e, o) {
                switch (o.tag) {
                case 100:
                    var n = o.node.getComponent(s.default);
                    if (n && this.hp > 0) {
                        var i = r.default.ins().ball_power * n.power_scale;
                        i = i > this.hp ? this.hp : i,
                        this.hp -= i,
                        r.default.ins().score += i
                    }
                }
            }
            ,
            i([h(cc.Label)], e.prototype, "lb_hp", void 0),
            i([h(cc.Node)], e.prototype, "icon", void 0),
            i([h(cc.Node)], e.prototype, "icon_hp_reduce", void 0),
            i([h(cc.Node)], e.prototype, "icon_power", void 0),
            i([h(cc.Integer)], e.prototype, "brick_type", void 0),
            i([h(cc.Integer)], e.prototype, "star_num", void 0),
            i([h(cc.Integer)], e.prototype, "ball_num", void 0),
            i([h(cc.Integer)], e.prototype, "effect_type", void 0),
            i([h(cc.Integer)], e.prototype, "brick_radius_mul", void 0),
            e = i([_], e)
        }(cc.Component);
        o.default = d,
        cc._RF.pop()
    }
    , {
        "../../common/audio/AudioPlayer": "AudioPlayer",
        "../../common/event/EventDispatch": "EventDispatch",
        "../../common/localStorage/LocalStorage": "LocalStorage",
        "../GameConst": "GameConst",
        "../model/GameModel": "GameModel",
        "./BallItem": "BallItem"
    }],
    CommonLabelScroll: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "2b107OGN/dPgaWkAj9qT67K", "CommonLabelScroll");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }()
          , i = this && this.__decorate || function(t, e, o, n) {
            var i, r = arguments.length, c = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                c = Reflect.decorate(t, e, o, n);
            else
                for (var a = t.length - 1; a >= 0; a--)
                    (i = t[a]) && (c = (r < 3 ? i(c) : r > 3 ? i(e, o, c) : i(e, o)) || c);
            return r > 3 && c && Object.defineProperty(e, o, c),
            c
        }
        ;
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = t("../../common/tween/Tween")
          , c = cc._decorator
          , a = c.ccclass
          , s = c.property
          , l = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.lb_num = null,
                e._num = {
                    value: 0
                },
                e
            }
            return n(e, t),
            e.prototype.onEnable = function() {
                this.lb_num || (this.lb_num = this.node.getComponent(cc.Label)),
                this.initValue(this._num.value)
            }
            ,
            e.prototype.initValue = function(t) {
                this._num.value = t,
                this.lb_num && (this.lb_num.string = "" + Math.ceil(this._num.value))
            }
            ,
            e.prototype.updateValue = function(t, e) {
                var o = this;
                if (void 0 != e && this.initValue(e),
                this.lb_num)
                    if (r.Tween.removeTweens(this._num),
                    t < this._num.value)
                        t == this._num.value ? (this._num.value = t,
                        this.lb_num.string = "" + t) : r.Tween.get(this._num, {
                            onChange: function() {
                                o.lb_num.string = "" + Math.ceil(o._num.value)
                            }
                        }).to({
                            value: t
                        }, 1500);
                    else {
                        var n = t - this._num.value;
                        r.Tween.get(this._num, {
                            onChange: function() {
                                o.lb_num.string = "" + Math.ceil(o._num.value)
                            }
                        }).to({
                            value: t
                        }, 300 + (n > 10 ? 700 : 0) + (n > 100 ? 500 : 0) + (n > 1e3 ? 500 : 0))
                    }
                else
                    this._num.value = t
            }
            ,
            e.prototype.onDisable = function() {
                r.Tween.removeTweens(this._num)
            }
            ,
            i([s(cc.Label)], e.prototype, "lb_num", void 0),
            e = i([a], e)
        }(cc.Component);
        o.default = l,
        cc._RF.pop()
    }
    , {
        "../../common/tween/Tween": "Tween"
    }],
    EventDispatch: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "eed4aQJ7TtAqptDX40AW5tU", "EventDispatch");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }();
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.listeners = {},
                e
            }
            return n(e, t),
            e.ins = function() {
                return t.ins.call(this)
            }
            ,
            e.prototype.fire = function(t) {
                for (var e = [], o = 1; o < arguments.length; o++)
                    e[o - 1] = arguments[o];
                var n = this.listeners[t];
                if (n)
                    for (var i = 0, r = n.length; i < r; i += 2) {
                        var c = n[i]
                          , a = n[i + 1];
                        c && c.call.apply(c, [a].concat(e))
                    }
            }
            ,
            e.prototype.add = function(t, e, o, n) {
                void 0 === o && (o = null),
                void 0 === n && (n = !1);
                for (var i = [], r = 4; r < arguments.length; r++)
                    i[r - 4] = arguments[r];
                var c = this.listeners[t];
                c || (this.listeners[t] = c = []),
                c.push(e, o),
                n && e.call.apply(e, [o].concat(i))
            }
            ,
            e.prototype.remove = function(t, e) {
                var o = this.listeners[t];
                if (o) {
                    var n = o.indexOf(e);
                    n < 0 ? cc.warn("EventDispatch remove " + t + ", but cb not exists!") : o.splice(n, 2)
                }
            }
            ,
            e.prototype.clear = function() {
                for (var t in this.listeners)
                    this.listeners[t].length = 0;
                this.listeners = {}
            }
            ,
            e
        }(t("../base/SingletonClass").default);
        o.EventDispatch = i,
        function(t) {
            t[t.GAME_TIME_CHANGED = 0] = "GAME_TIME_CHANGED",
            t[t.GAME_CREATE_BALL = 1] = "GAME_CREATE_BALL",
            t[t.GAME_SCORE_CHANGED = 2] = "GAME_SCORE_CHANGED",
            t[t.GAME_BALL_POWER_CHANGED = 3] = "GAME_BALL_POWER_CHANGED",
            t[t.GAME_BEST_SCORE_CHANGED = 4] = "GAME_BEST_SCORE_CHANGED",
            t[t.GAME_ON_TOUCH_MOVE = 5] = "GAME_ON_TOUCH_MOVE",
            t[t.GAME_POWER_TYPE_CHANGED = 6] = "GAME_POWER_TYPE_CHANGED",
            t[t.GAME_RELIVE = 7] = "GAME_RELIVE",
            t[t.GAME_PLAY_BRICK_REMOVE_EFFECT = 8] = "GAME_PLAY_BRICK_REMOVE_EFFECT",
            t[t.SHOW_TIPS = 9] = "SHOW_TIPS",
            t[t.GAME_STAR_GET_EFFECT = 10] = "GAME_STAR_GET_EFFECT"
        }(o.Event_Name || (o.Event_Name = {})),
        cc._RF.pop()
    }
    , {
        "../base/SingletonClass": "SingletonClass"
    }],
    GameConst: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "39d7ekGOCtHeZcPBzFEwSxV", "GameConst");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }();
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.ball_init_x = 0,
                e.ball_init_y = -400,
                e.ball_speed = 1e3,
                e.ball_radius = 15,
                e.brick_radius = 43,
                e.brick_init_x = 0,
                e.brick_init_y = 500,
                e.max_ball_init_count = 60,
                e.max_ball_fire_speed = 10,
                e.theme_price = 500,
                e.sign_interval_sec = 3600,
                e.theme_config = [{
                    color: [cc.color(0, 232, 231), cc.color(0, 232, 132), cc.color(0, 232, 52), cc.color(125, 232, 52), cc.color(190, 190, 50), cc.color(150, 220, 40), cc.color(230, 215, 40), cc.color(230, 80, 20), cc.color(228, 35, 20), cc.color(228, 0, 20), cc.color(241, 116, 193, 255), cc.color(66, 216, 229, 255)],
                    theme: ["theme0", "theme1", "snow1", "theme3", "leaf1", "diamond", "theme5", "flower", "leaf2", "snow2", "spark1", "spark2"]
                }],
                e.brick_type_percent = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 9, 10],
                e
            }
            return n(e, t),
            e.ins = function() {
                return t.ins.call(this)
            }
            ,
            e
        }(t("../common/base/SingletonClass").default);
        o.default = i,
        cc._RF.pop()
    }
    , {
        "../common/base/SingletonClass": "SingletonClass"
    }],
    GameModel: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "cb0cdBciShMAqW7SF8LqDNi", "GameModel");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }();
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i = t("../../common/base/SingletonClass")
          , r = t("../../common/event/EventDispatch")
          , c = t("../../common/localStorage/LocalStorage")
          , a = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e._fireBallDt = 2,
                e._ball_power = 1,
                e._ball_fire_speed = 2,
                e._ball_init_count = 4,
                e._score = 0,
                e._revive_times = 0,
                e
            }
            return n(e, t),
            e.ins = function() {
                return t.ins.call(this)
            }
            ,
            Object.defineProperty(e.prototype, "fireBallDt", {
                get: function() {
                    return this._fireBallDt
                },
                set: function(t) {
                    t = t < 2 ? 2 : t,
                    this._fireBallDt = t
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "ball_power", {
                get: function() {
                    return this._ball_power
                },
                set: function(t) {
                    var e = this._ball_power;
                    t = t < 1 ? 1 : t,
                    this._ball_power = t,
                    r.EventDispatch.ins().fire(r.Event_Name.GAME_BALL_POWER_CHANGED, e, t)
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "ball_fire_speed", {
                get: function() {
                    return this._ball_fire_speed
                },
                set: function(t) {
                    t = t < 2 ? 2 : t,
                    this._ball_fire_speed = t
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "ball_init_count", {
                get: function() {
                    return this._ball_init_count
                },
                set: function(t) {
                    t = t < 4 ? 4 : t,
                    this._ball_init_count = t
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "score", {
                get: function() {
                    return this._score
                },
                set: function(t) {
                    t = t < 0 ? 0 : t;
                    var e = this._score;
                    this._score = t,
                    r.EventDispatch.ins().fire(r.Event_Name.GAME_SCORE_CHANGED, e, t)
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "revive_times", {
                get: function() {
                    return this._revive_times
                },
                set: function(t) {
                    t = t < 0 ? 0 : t,
                    this._revive_times = t
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.init = function() {
                var t = c.LocalStorage.ins().getLocal(c.CONST_STORAGE_KEY.KEY_QIULV, 0);
                t <= 0 && (c.LocalStorage.ins().setLocal(c.CONST_STORAGE_KEY.KEY_QIULV, 5),
                t = 5,
                this.reset());
                var e = c.LocalStorage.ins().getLocal(c.CONST_STORAGE_KEY.KEY_HSLV, 1)
                  , o = c.LocalStorage.ins().getLocal(c.CONST_STORAGE_KEY.KEY_HLLV, 1);
                this.ball_fire_speed = e,
                this.ball_power = o,
                this.ball_init_count = t,
                console.log("init game ")
            }
            ,
            e.prototype.reset = function() {
                this.score = 0,
                this.revive_times = 0,
                this.ball_init_count = 4,
                this.ball_fire_speed = 1,
                this.ball_power = 1;
                var t = c.LocalStorage.ins().getLocal(c.CONST_STORAGE_KEY.KEY_QIULV, 0);
                t <= 0 && (c.LocalStorage.ins().setLocal(c.CONST_STORAGE_KEY.KEY_QIULV, 5),
                t = 5,
                this.reset());
                var e = c.LocalStorage.ins().getLocal(c.CONST_STORAGE_KEY.KEY_HSLV, 1)
                  , o = c.LocalStorage.ins().getLocal(c.CONST_STORAGE_KEY.KEY_HLLV, 1);
                this.ball_fire_speed = e,
                this.ball_power = o,
                this.ball_init_count = t,
                console.log("init game ")
            }
            ,
            e
        }(i.default);
        o.default = a,
        cc._RF.pop()
    }
    , {
        "../../common/base/SingletonClass": "SingletonClass",
        "../../common/event/EventDispatch": "EventDispatch",
        "../../common/localStorage/LocalStorage": "LocalStorage"
    }],
    GameView: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "75ce10juNRO1r76kZtFyY9h", "GameView");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }()
          , i = this && this.__decorate || function(t, e, o, n) {
            var i, r = arguments.length, c = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                c = Reflect.decorate(t, e, o, n);
            else
                for (var a = t.length - 1; a >= 0; a--)
                    (i = t[a]) && (c = (r < 3 ? i(c) : r > 3 ? i(e, o, c) : i(e, o)) || c);
            return r > 3 && c && Object.defineProperty(e, o, c),
            c
        }
        ;
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = t("../../common/ui/pop_ui_base")
          , c = t("../item/BallItem")
          , a = t("../GameConst")
          , s = t("../model/GameModel")
          , l = t("../item/BrickItem")
          , u = t("../../common/random/RandomUtil")
          , p = t("../../common/event/EventDispatch")
          , _ = t("../../common/ui/pop_mgr")
          , h = t("../../common/audio/AudioPlayer")
          , d = t("../../common/util")
          , f = t("../../common/loader/loader_mgr")
          , m = t("../../common/tween/Tween")
          , g = t("../../common/localStorage/LocalStorage")
          , v = cc._decorator
          , y = v.ccclass
          , b = v.property
          , E = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.bg = null,
                e.node_top = null,
                e.cannon_head = null,
                e.physics = null,
                e.lb_ball_count = null,
                e.lb_ball_power = null,
                e.guide_hand = null,
                e.node_freeze = null,
                e.lb_score = null,
                e.node_power_progress = null,
                e.power_txts = [],
                e.particleSystem = null,
                e.balls_ins = [],
                e.bricks_ins = [],
                e.node_star_img = null,
                e.tuji = null,
                e.star_ins = null,
                e._star_pool = [],
                e._star_num = 0,
                e.balls_pool = [],
                e.bricks_pool = [],
                e.balls_in_game = [],
                e.bricks_in_game = [],
                e._updateDt = 0,
                e._brick_speed = 1,
                e._moved_length = 0,
                e._moved_level = 0,
                e._power_type = 0,
                e._isGameOver = !1,
                e._brick_img_pool = [],
                e
            }
            return n(e, t),
            e.prototype.onLoad = function() {
                this.bg.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this),
                cc.director.getPhysicsManager().enabled = !0;
                for (var t = 0, e = this.balls_ins.length; t < e; )
                    this.balls_pool[t++] = [];
                for (t = 0,
                e = this.bricks_ins.length; t < e; )
                    this.bricks_pool[t++] = [];
                cc.director.getPhysicsManager().enabledAccumulator = !0;
                var o = g.LocalStorage.ins().getLocal(g.CONST_STORAGE_KEY.KEY_SLEECTFG, 0);
                this.particleSystem.spriteFrame = this.tuji.getSpriteFrame(this.gettheam(o)[0]),
                this.particleSystem.startColor = this.gettheam(o)[1]
            }
            ,
            e.prototype.gettheam = function(t) {
                var e = [[89, 211, 229, 255], [225, 225, 225, 255], [242, 244, 55, 255], [245, 129, 241, 255], [232, 152, 38, 255], [68, 206, 235, 255], [225, 225, 225, 255], [231, 220, 43, 255], [66, 243, 195, 255], [243, 224, 66, 255], [241, 116, 193, 255], [66, 216, 229, 255]]
                  , o = [];
                return o[0] = ["theme0", "theme1", "snow1", "theme3", "leaf1", "diamond", "theme5", "flower", "leaf2", "snow2", "spark1", "spark2"][t],
                o[1] = new cc.Color(e[t][0],e[t][1],e[t][2]),
                o
            }
            ,
            e.prototype.onTouchMove = function(t) {
                var e = t.getDeltaX()
                  , o = t.getDeltaY()
                  , n = .3 * Math.sqrt(e * e + o * o)
                  , i = Math.sign(e)
                  , r = this.cannon_head.rotation + n * i;
                r = Math.abs(r) >= 85 ? 85 * Math.sign(r) : r,
                this.cannon_head.rotation = r
            }
            ,
            e.prototype.update = function(t) {
                var e = this;
                if (!this._isGameOver) {
                    if (this._power_type > 0)
                        switch (this.node_power_progress.width -= 1.5,
                        this.node_power_progress.active && this.node_power_progress.width <= 0 && this.updateGamePowerType(0),
                        this._power_type) {
                        case 3:
                            this._brick_speed = 0
                        }
                    this._updateDt++,
                    this._moved_length += this._brick_speed,
                    this._updateDt % s.default.ins().fireBallDt != 0 && 2 !== this._power_type || this.balls_in_game.some(function(t) {
                        return t.ball_status === c.EnumBallStatus.onReady && (0 === t.ball_type || 2 === e._power_type) && (t.power_scale = 1 === e._power_type ? 2 : 1,
                        t.fireBall(e.cannon_head.rotation),
                        !0)
                    });
                    var o = a.default.ins().brick_radius
                      , n = s.default.ins().ball_power;
                    if (Math.floor(this._moved_length / 4 / o) > this._moved_level) {
                        this._moved_level++;
                        var i = this.balls_in_game.length / (2 === this._power_type ? 2 : 1)
                          , r = Math.ceil(i * n * .5 + this._moved_level * n * 1.2)
                          , l = a.default.ins().brick_type_percent
                          , p = -999
                          , _ = -999
                          , h = -999;
                        this._moved_level % 12 == 0 && (p = u.RandomUtil.ins().randomNum(-2, 3),
                        this.createBrick(p * o * 2 - o + a.default.ins().brick_init_x, o + a.default.ins().brick_init_y, u.RandomUtil.ins().randomNum(3 * r, 6 * r), u.RandomUtil.ins().randomNum(14, 16), 10)),
                        this._moved_level % 11 == 0 && (_ = u.RandomUtil.ins().randomNum(0, 1),
                        h = u.RandomUtil.ins().randomNum(-3, 3));
                        for (var d = 0; d < 2; d++)
                            for (var f = -3; f < 4; f++)
                                if (f === p || f === p - 1)
                                    ;
                                else {
                                    var m = d === _ && f === h ? u.RandomUtil.ins().randomNum(n, Math.ceil(r / 2)) : u.RandomUtil.ins().randomNum(-Math.round(r / (this._moved_level % 5 + 1)), r)
                                      , g = d === _ && f === h ? u.RandomUtil.ins().randomNum(11, 13) : l[u.RandomUtil.ins().randomNum(0, l.length - 1)];
                                    m >= n && this.createBrick(f * o * 2 + a.default.ins().brick_init_x, d * o * 2 + a.default.ins().brick_init_y, m, g, Math.ceil(10 * m / r))
                                }
                    }
                    for (var v = 9999, y = 0, b = this.bricks_in_game.length; y < b; y++) {
                        var E = this.bricks_in_game[y];
                        if (E && E.node) {
                            var O = E.node;
                            if (E.hp <= 0 || !O.active)
                                this._updateDt % 60 == 0 && (E.reset(),
                                this.bricks_in_game.splice(y, 1),
                                this.bricks_pool[E.brick_type].push(O),
                                y--);
                            else {
                                if (O.y -= this._brick_speed,
                                O.y - E.brick_radius_mul * o <= a.default.ins().ball_init_y)
                                    return void this.gameOver();
                                O.y < v && (v = O.y)
                            }
                        }
                    }
                    this._brick_speed = v > a.default.ins().ball_init_y + 7 * o ? 1 : v > a.default.ins().ball_init_y + 5 * o ? .9 : .6
                }
            }
            ,
            e.prototype.createBall = function(t, e, o, n) {
                void 0 === t && (t = a.default.ins().ball_init_x),
                void 0 === e && (e = a.default.ins().ball_init_y),
                void 0 === o && (o = c.EnumBallStatus.onReady),
                void 0 === n && (n = 0);
                var i = this.balls_pool[n].shift();
                i || (i = cc.instantiate(this.balls_ins[n]),
                this.physics.addChild(i));
                var r = i.getComponent(c.default);
                r.init(t, e, o),
                i.active = !0,
                this.balls_in_game.unshift(r),
                this.lb_ball_count.string = "" + this.balls_in_game.length / 2,
                0 === n && this.createBall(a.default.ins().ball_init_x, a.default.ins().ball_init_y, c.EnumBallStatus.onReady, 1)
            }
            ,
            e.prototype.createBrick = function(t, e, o, n, i) {
                void 0 === t && (t = a.default.ins().brick_init_x),
                void 0 === e && (e = a.default.ins().brick_init_y),
                void 0 === o && (o = 1),
                void 0 === n && (n = 0),
                void 0 === i && (i = 1),
                7 === n && this.balls_in_game.length > 200 && (n = 0);
                var r = this.bricks_pool[n].shift();
                r || (r = cc.instantiate(this.bricks_ins[n]),
                this.physics.addChild(r));
                var c = r.getComponent(l.default);
                r.active = !0,
                r.x = t,
                r.y = e,
                c.init(i, o),
                this.bricks_in_game.push(c)
            }
            ,
            e.prototype.resetGame = function() {
                this.cannon_head.rotation = 10 - 20 * Math.random(),
                cc.director.getPhysicsManager().enabled = !0,
                this._updateDt = 0,
                this._moved_length = 0,
                this._moved_level = 0,
                this._isGameOver = !1,
                this.updateGamePowerType(0),
                s.default.ins().reset();
                for (var t = s.default.ins().ball_init_count, e = 0; e < t; e++)
                    this.createBall();
                for (var o = a.default.ins().brick_radius, n = 0; n < 2; n++)
                    for (var i = -3; i < 4; i++) {
                        var r = (n + 1) * s.default.ins().ball_power + (t - 4);
                        r = r < 0 ? 1 : r,
                        this.createBrick(i * o * 2 + a.default.ins().brick_init_x, n * o * 2 + a.default.ins().brick_init_y, r)
                    }
                this._star_num = s.default.ins().ball_power,
                this.lb_ball_power.string = "" + this._star_num
            }
            ,
            e.prototype.clearGame = function() {
                var t = this;
                cc.director.getPhysicsManager().enabled = !1,
                this.balls_in_game.forEach(function(e) {
                    e.reset(),
                    t.balls_pool[e.ball_type].push(e.node)
                }),
                this.balls_in_game = [],
                this.bricks_in_game.forEach(function(e) {
                    e.reset(),
                    t.bricks_pool[e.brick_type].push(e.node)
                }),
                this.bricks_in_game = [],
                s.default.ins().reset()
            }
            ,
            e.prototype.updateScore = function(t, e) {
                var o = s.default.ins().score;
                this.lb_score.string = "" + o

                //埋点 上报分数
              //  console.log("score:" + o);
                if (window.h5api && window.h5api.isLogin() && o) {
                    window.h5api.submitRanking(o, function (data) { });
                }
            }
            ,
            e.prototype.updateBallPower = function(t, e) {
                s.default.ins().ball_power
            }
            ,
            e.prototype.updateStarNumGetEffect = function(t, e, o) {
                for (var n = this, i = this.node_top.convertToNodeSpaceAR(this.node_star_img.convertToWorldSpaceAR(cc.v2(0, 0))), r = function(o) {
                    var r = c._star_pool.shift();
                    r || (r = cc.instantiate(c.star_ins),
                    c.node_top.addChild(r)),
                    r.x = t,
                    r.y = e,
                    r.rotation = 0,
                    r.active = !0,
                    m.Tween.get(r).to({
                        rotation: 720,
                        x: i.x,
                        y: i.y
                    }, 800 + 100 * o, m.Ease.getBackInOut(1.2)).call(function() {
                        r.active = !1,
                        n._star_pool.push(r),
                        m.Tween.get(n.node_star_img).to({
                            scale: 1.2
                        }, 300).to({
                            scale: 1
                        }, 300, m.Ease.backInOut).call(function() {
                            n._star_num += 1;
                            var t = g.LocalStorage.ins().getLocal(g.CONST_STORAGE_KEY.KEY_XING, 0);
                            g.LocalStorage.ins().setLocal(g.CONST_STORAGE_KEY.KEY_XING, t + 1),
                            n.lb_ball_power.string = "" + n._star_num
                        })
                    })
                }, c = this, a = 0; a < o; a++)
                    r(a)
            }
            ,
            e.prototype.playBrickDeleteEffect = function(t, e, o) {
                var n = this
                  , i = a.default.ins().theme_config[0];
                i && f.loader_mgr.get_inst().loadAsset("texture/plist/customize", d.gen_handler(function(r) {
                    var c = r.getSpriteFrame(i.theme);
                    if (c)
                        for (var a = function(i) {
                            var r = i % 3 - 1.5
                              , a = Math.floor(i / 3) - 1.5
                              , s = t + r * (100 + 150 * Math.random())
                              , l = e + a * (100 + 150 * Math.random())
                              , u = n._brick_img_pool.shift();
                            u || ((u = new cc.Node).addComponent(cc.Sprite),
                            n.physics.addChild(u)),
                            u.active = !0,
                            u.rotation = 0,
                            u.getComponent(cc.Sprite).spriteFrame = c,
                            u.color = o;
                            var p = 50 * Math.random() + 50;
                            u.width = u.height = p,
                            u.x = t,
                            u.y = e,
                            m.Tween.get(u).to({
                                x: s,
                                y: l,
                                width: p / 3,
                                height: p / 3,
                                rotation: 1e3 * Math.random()
                            }, 500 * Math.random() + 500).call(function() {
                                u.active = !1,
                                n._brick_img_pool.push(u)
                            })
                        }, s = 0; s < 9; s++)
                            a(s)
                }), cc.SpriteAtlas)
            }
            ,
            e.prototype.updateGamePowerType = function(t) {
                if (void 0 === t && (t = 0),
                t > 0) {
                    if (0 === this._power_type) {
                        switch (this.node_power_progress.active = !0,
                        this.node_power_progress.width = 640,
                        this._power_type = t,
                        t) {
                        case 2:
                            this.cannon_head.scale = 2;
                            break;
                        case 3:
                            this.node_freeze.active = !0
                        }
                        this.lb_ball_count.node.color = this.node_power_progress.color = [cc.Color.WHITE, cc.Color.RED, cc.Color.YELLOW, cc.Color.GRAY][t] || cc.Color.WHITE;
                        var e = this.power_txts[t];
                        if (e) {
                            e.active = !0,
                            e.stopAllActions(),
                            e.opacity = 0;
                            e.runAction(cc.sequence(cc.fadeIn(1), cc.moveBy(.5, 0, 100), cc.delayTime(.5), cc.fadeOut(1), cc.callFunc(function() {
                                e && (e.y -= 100,
                                e.active = !1)
                            })))
                        }
                        h.AudioPlayer.ins().play_sound(h.AUDIO_CONFIG.Audio_levelup)
                    }
                } else
                    this.node_freeze.active = this.node_power_progress.active = !1,
                    this.node_power_progress.width = 640,
                    this.lb_ball_count.node.color = cc.Color.WHITE,
                    this.cannon_head.scale = 1,
                    this._power_type,
                    this._power_type = t
            }
            ,
            e.prototype.gameRelive = function(event) {
                var t = this;
                s.default.ins().revive_times++,
                this.bricks_in_game.forEach(function(e) {
                    e.reset(),
                    t.bricks_pool[e.brick_type].push(e.node)
                }),
                this.bricks_in_game = [],
                this._isGameOver = !1,
                cc.director.getPhysicsManager().enabled = !0,
                h.AudioPlayer.ins().play_music(h.AUDIO_CONFIG.Audio_Bgm)
            }
            ,
            e.prototype.gameOver = function() {
                this._isGameOver = !0,
                cc.director.getPhysicsManager().enabled = !1,
                _.pop_mgr.get_inst().show(_.UI_CONFIG.result)
            }
            ,
            e.prototype.on_show = function() {
                var e = this;
                t.prototype.on_show.call(this),
                p.EventDispatch.ins().add(p.Event_Name.GAME_CREATE_BALL, this.createBall, this),
                p.EventDispatch.ins().add(p.Event_Name.GAME_RELIVE, this.gameRelive, this),
                p.EventDispatch.ins().add(p.Event_Name.GAME_ON_TOUCH_MOVE, this.onTouchMove, this),
                p.EventDispatch.ins().add(p.Event_Name.GAME_POWER_TYPE_CHANGED, this.updateGamePowerType, this),
                p.EventDispatch.ins().add(p.Event_Name.GAME_SCORE_CHANGED, this.updateScore, this, !0),
                p.EventDispatch.ins().add(p.Event_Name.GAME_BALL_POWER_CHANGED, this.updateBallPower, this, !0),
                p.EventDispatch.ins().add(p.Event_Name.GAME_PLAY_BRICK_REMOVE_EFFECT, this.playBrickDeleteEffect, this),
                p.EventDispatch.ins().add(p.Event_Name.GAME_STAR_GET_EFFECT, this.updateStarNumGetEffect, this),
                h.AudioPlayer.ins().play_music(h.AUDIO_CONFIG.Audio_Bgm);
                this.guide_hand.active = !0,
                this.guide_hand.stopAllActions(),
                this.guide_hand.runAction(cc.sequence(cc.repeat(cc.sequence(cc.moveBy(.5, 100, 0), cc.moveBy(.5, -100, 0), cc.moveBy(.5, -100, 0), cc.moveBy(.5, 100, 0)), 5), cc.callFunc(function() {
                    e.guide_hand && (e.guide_hand.active = !1)
                }))),
                this.btn_close.node.active = !1,
                setTimeout(function() {
                    e.btn_close.node.active = !0
                }, 5e3),
                this.resetGame()
            }
            ,
            e.prototype.onCloseBtnTouch = function() {
                t.prototype.onCloseBtnTouch.call(this)
            }
            ,
            e.prototype.on_hide = function() {
                p.EventDispatch.ins().remove(p.Event_Name.GAME_CREATE_BALL, this.createBall),
                p.EventDispatch.ins().remove(p.Event_Name.GAME_RELIVE, this.gameRelive),
                p.EventDispatch.ins().remove(p.Event_Name.GAME_ON_TOUCH_MOVE, this.onTouchMove),
                p.EventDispatch.ins().remove(p.Event_Name.GAME_POWER_TYPE_CHANGED, this.updateGamePowerType),
                p.EventDispatch.ins().remove(p.Event_Name.GAME_SCORE_CHANGED, this.updateScore),
                p.EventDispatch.ins().remove(p.Event_Name.GAME_PLAY_BRICK_REMOVE_EFFECT, this.playBrickDeleteEffect),
                p.EventDispatch.ins().remove(p.Event_Name.GAME_STAR_GET_EFFECT, this.updateStarNumGetEffect),
                h.AudioPlayer.ins().stop_music(),
                this.guide_hand.stopAllActions(),
                this.clearGame(),
                t.prototype.on_hide.call(this)
            }
            ,
            i([b(cc.Node)], e.prototype, "bg", void 0),
            i([b(cc.Node)], e.prototype, "node_top", void 0),
            i([b(cc.Node)], e.prototype, "cannon_head", void 0),
            i([b(cc.Node)], e.prototype, "physics", void 0),
            i([b(cc.Label)], e.prototype, "lb_ball_count", void 0),
            i([b(cc.Label)], e.prototype, "lb_ball_power", void 0),
            i([b(cc.Node)], e.prototype, "guide_hand", void 0),
            i([b(cc.Node)], e.prototype, "node_freeze", void 0),
            i([b(cc.Label)], e.prototype, "lb_score", void 0),
            i([b(cc.Node)], e.prototype, "node_power_progress", void 0),
            i([b([cc.Node])], e.prototype, "power_txts", void 0),
            i([b(cc.ParticleSystem)], e.prototype, "particleSystem", void 0),
            i([b([cc.Prefab])], e.prototype, "balls_ins", void 0),
            i([b([cc.Prefab])], e.prototype, "bricks_ins", void 0),
            i([b(cc.Node)], e.prototype, "node_star_img", void 0),
            i([b(cc.SpriteAtlas)], e.prototype, "tuji", void 0),
            i([b(cc.Prefab)], e.prototype, "star_ins", void 0),
            e = i([y], e)
        }(r.POP_UI_BASE);
        o.default = E,
        cc._RF.pop()
    }
    , {
        "../../common/audio/AudioPlayer": "AudioPlayer",
        "../../common/event/EventDispatch": "EventDispatch",
        "../../common/loader/loader_mgr": "loader_mgr",
        "../../common/localStorage/LocalStorage": "LocalStorage",
        "../../common/random/RandomUtil": "RandomUtil",
        "../../common/tween/Tween": "Tween",
        "../../common/ui/pop_mgr": "pop_mgr",
        "../../common/ui/pop_ui_base": "pop_ui_base",
        "../../common/util": "util",
        "../GameConst": "GameConst",
        "../item/BallItem": "BallItem",
        "../item/BrickItem": "BrickItem",
        "../model/GameModel": "GameModel"
    }],
    LanguageData: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "61de062n4dJ7ZM9/Xdumozn", "LanguageData");
        var n = t("polyglot.min")
          , i = null;
        function r(t) {
            return window.i18n.languages[t]
        }
        function c(t) {
            t && (i ? i.replace(t) : i = new n({
                phrases: t,
                allowMissing: !0
            }))
        }
        window.i18n || (window.i18n = {
            languages: {},
            curLang: ""
        }),
        e.exports = {
            init: function(t) {
                if (t !== window.i18n.curLang) {
                    var e = r(t) || {};
                    window.i18n.curLang = t,
                    c(e),
                    this.inst = i
                }
            },
            t: function(t, e) {
                if (i)
                    return i.t(t, e)
            },
            inst: i,
            updateSceneRenderers: function() {
                for (var t = cc.director.getScene().children, e = [], o = 0; o < t.length; ++o) {
                    var n = t[o].getComponentsInChildren("LocalizedLabel");
                    Array.prototype.push.apply(e, n)
                }
                for (var i = 0; i < e.length; ++i) {
                    var r = e[i];
                    r.node.active && r.updateLabel()
                }
                for (var c = [], a = 0; a < t.length; ++a) {
                    var s = t[a].getComponentsInChildren("LocalizedSprite");
                    Array.prototype.push.apply(c, s)
                }
                for (var l = 0; l < c.length; ++l) {
                    var u = c[l];
                    u.node.active && u.updateSprite(window.i18n.curLang)
                }
            }
        },
        cc._RF.pop()
    }
    , {
        "polyglot.min": "polyglot.min"
    }],
    LocalStorage: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "268f8O0nHBNeLgcPVchYcOV", "LocalStorage");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }();
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e._game_key = "nonstop_balls_tt_",
                e
            }
            return n(e, t),
            e.ins = function() {
                return t.ins.call(this)
            }
            ,
            e.prototype.setLocal = function(t, e) {
                try {
                    "object" == typeof e && (e = JSON.stringify(e)),
                    cc.sys.localStorage.setItem(this._game_key + t, e)
                } catch (t) {}
            }
            ,
            e.prototype.getLocal = function(t, e) {
                try {
                    var o = cc.sys.localStorage.getItem(this._game_key + t);
                    if (null == o)
                        return e;
                    switch (o = o,
                    typeof e) {
                    case "object":
                        var n = e;
                        try {
                            var i = JSON.parse(o);
                            "object" == typeof i && (n = i)
                        } catch (t) {}
                        return n;
                    case "boolean":
                        return "true" === o;
                    case "number":
                        return Number(o) || e
                    }
                    return o
                } catch (t) {
                    return e
                }
            }
            ,
            e.prototype.str_encrypt = function(t, e) {
                void 0 === e && (e = this._game_key);
                for (var o = 0, n = 0, i = e.length; n < i; n++)
                    o += e.charCodeAt(n);
                t = t.toString(),
                t += e;
                for (var r = String.fromCharCode(t.charCodeAt(0) + t.length * o), c = 1; c < t.length; c++)
                    r += String.fromCharCode(t.charCodeAt(c) + t.charCodeAt(c - 1));
                return encodeURIComponent(r)
            }
            ,
            e.prototype.str_decrypt = function(t, e) {
                void 0 === e && (e = this._game_key);
                for (var o = 0, n = 0, i = e.length; n < i; n++)
                    o += e.charCodeAt(n);
                t = t.toString(),
                t = decodeURIComponent(t);
                for (var r = String.fromCharCode(t.charCodeAt(0) - t.length * o), c = 1; c < t.length; c++)
                    r += String.fromCharCode(t.charCodeAt(c) - r.charCodeAt(c - 1));
                return r.slice(0, r.length - e.length)
            }
            ,
            e
        }(t("../base/SingletonClass").default);
        o.LocalStorage = i,
        o.CONST_STORAGE_KEY = {
            KEY_MUSIC_VOLUME: "KEY_MUSIC_VOLUME",
            KEY_SOUND_VOLUME: "KEY_SOUND_VOLUME",
            KEY_SOUND_IS_MUTE: "KEY_SOUND_IS_MUTE",
            KEY_MUSIC_IS_MUTE: "KEY_MUSIC_IS_MUTE",
            KEY_XING: "KEY_XING",
            KEY_QIULV: "KEY_QIULV",
            KEY_HSLV: "KEY_HSLV",
            KEY_HLLV: "KEY_HLLV",
            KEY_PIFUID: "KEY_PIFUID",
            KEY_ZHUTIID: "KEY_ZHUTIID",
            KEY_HEIGHT: "KEY_HEIGHT",
            KEY_SLEECTQQ: "KEY_SLEECTQQ",
            KEY_SLEECTFG: "KEY_SLEECTFG"
        },
        cc._RF.pop()
    }
    , {
        "../base/SingletonClass": "SingletonClass"
    }],
    LocalizedLabel: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "744dcs4DCdNprNhG0xwq6FK", "LocalizedLabel");
        var n = t("LanguageData");
        cc.Class({
            extends: cc.Component,
            editor: {
                executeInEditMode: !0,
                menu: "i18n/LocalizedLabel"
            },
            properties: {
                dataID: {
                    get: function() {
                        return this._dataID
                    },
                    set: function(t) {
                        this._dataID !== t && (this._dataID = t,
                        this.updateLabel())
                    }
                },
                _dataID: ""
            },
            onLoad: function() {
                n.inst || n.init(),
                this.fetchRender()
            },
            fetchRender: function() {
                var t = this.getComponent(cc.Label);
                if (t)
                    return this.label = t,
                    void this.updateLabel()
            },
            updateLabel: function() {
                this.label ? n.t(this.dataID) && (this.label.string = n.t(this.dataID)) : cc.error("Failed to update localized label, label component is invalid!")
            }
        }),
        cc._RF.pop()
    }
    , {
        LanguageData: "LanguageData"
    }],
    LocalizedSprite: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "f34ac2GGiVOBbG6XlfvgYP4", "LocalizedSprite");
        var n = t("SpriteFrameSet");
        cc.Class({
            extends: cc.Component,
            editor: {
                executeInEditMode: !0,
                inspector: "packages://i18n/inspector/localized-sprite.js",
                menu: "i18n/LocalizedSprite"
            },
            properties: {
                spriteFrameSet: {
                    default: [],
                    type: n
                }
            },
            onLoad: function() {
                this.fetchRender()
            },
            fetchRender: function() {
                var t = this.getComponent(cc.Sprite);
                if (t)
                    return this.sprite = t,
                    void this.updateSprite(window.i18n.curLang)
            },
            getSpriteFrameByLang: function(t) {
                for (var e = 0; e < this.spriteFrameSet.length; ++e)
                    if (this.spriteFrameSet[e].language === t)
                        return this.spriteFrameSet[e].spriteFrame
            },
            updateSprite: function(t) {
                if (this.sprite) {
                    var e = this.getSpriteFrameByLang(t);
                    !e && this.spriteFrameSet[0] && (e = this.spriteFrameSet[0].spriteFrame),
                    this.sprite.spriteFrame = e
                } else
                    cc.error("Failed to update localized sprite, sprite component is invalid!")
            }
        }),
        cc._RF.pop()
    }
    , {
        SpriteFrameSet: "SpriteFrameSet"
    }],
    Main: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "d11441zdgFEV5MkeWy6aa9W", "Main");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }()
          , i = this && this.__decorate || function(t, e, o, n) {
            var i, r = arguments.length, c = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                c = Reflect.decorate(t, e, o, n);
            else
                for (var a = t.length - 1; a >= 0; a--)
                    (i = t[a]) && (c = (r < 3 ? i(c) : r > 3 ? i(e, o, c) : i(e, o)) || c);
            return r > 3 && c && Object.defineProperty(e, o, c),
            c
        }
        ;
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = t("../common/ui/pop_mgr")
          , c = t("../common/timer/timer_mgr")
          , a = t("../common/random/RandomUtil")
          , s = t("../game/model/GameModel")
          , l = t("../common/audio/AudioPlayer")
          , u = t("../common/event/EventDispatch")
          , p = t("../common/tween/Tween")
          , _ = cc._decorator
          , h = _.ccclass
          , d = _.property
          , f = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.lb_loading = null,
                e.node_loading = null,
                e.bg_tips = null,
                e.lb_tips = null,
                e.top_layer = null,
                e
            }
            return n(e, t),
            e.prototype.onLoad = function() {
                var t = this;
                console.log("onLoadq 2"),
                a.RandomUtil.ins().init(Math.round(1e6 + 8999999 * Math.random()).toString()),
                u.EventDispatch.ins().add(u.Event_Name.SHOW_TIPS, this.showTips, this),
                this.lb_tips.node.on(cc.Node.EventType.SIZE_CHANGED, function() {
                    t.bg_tips.width = t.lb_tips.node.width + 10,
                    t.bg_tips.height = t.lb_tips.node.height + 10
                }),
                this.node_loading.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
                    t.node_loading.scaleX = 1
                }), cc.moveBy(3, -1200, 0), cc.callFunc(function() {
                    t.node_loading.scaleX = -1
                }), cc.moveBy(3, 1200, 0)))),
                console.log("onLoadq 1"),
                l.AudioPlayer.ins().init(),
                s.default.ins().init(),
                r.pop_mgr.get_inst().show(r.UI_CONFIG.menu),
                console.log("onLoadq 0")
            }
            ,
            e.prototype.showTips = function(t) {
                var e = this;
                p.Tween.removeTweens(this.bg_tips),
                this.lb_tips.string = t,
                this.bg_tips.opacity = 255,
                this.bg_tips.active = !0,
                p.Tween.get(this.bg_tips).wait(2e3).to({
                    opacity: 0
                }, 2e3).call(function() {
                    e.bg_tips.active = !1
                })
            }
            ,
            e.prototype.update = function(t) {
                c.TimerMgr.getInst().update(t)
            }
            ,
            i([d(cc.Label)], e.prototype, "lb_loading", void 0),
            i([d(cc.Node)], e.prototype, "node_loading", void 0),
            i([d(cc.Node)], e.prototype, "bg_tips", void 0),
            i([d(cc.Label)], e.prototype, "lb_tips", void 0),
            i([d(cc.Node)], e.prototype, "top_layer", void 0),
            e = i([h], e)
        }(cc.Component);
        o.default = f,
        cc._RF.pop()
    }
    , {
        "../common/audio/AudioPlayer": "AudioPlayer",
        "../common/event/EventDispatch": "EventDispatch",
        "../common/random/RandomUtil": "RandomUtil",
        "../common/timer/timer_mgr": "timer_mgr",
        "../common/tween/Tween": "Tween",
        "../common/ui/pop_mgr": "pop_mgr",
        "../game/model/GameModel": "GameModel"
    }],
    MenuView: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "fbe8dywH6JCwbmwYsARWyMe", "MenuView");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }()
          , i = this && this.__decorate || function(t, e, o, n) {
            var i, r = arguments.length, c = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                c = Reflect.decorate(t, e, o, n);
            else
                for (var a = t.length - 1; a >= 0; a--)
                    (i = t[a]) && (c = (r < 3 ? i(c) : r > 3 ? i(e, o, c) : i(e, o)) || c);
            return r > 3 && c && Object.defineProperty(e, o, c),
            c
        }
        ;
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = t("../../common/ui/pop_ui_base")
          , c = t("../../common/ui/pop_mgr")
          , a = t("../../common/event/EventDispatch")
          , s = t("../../common/audio/AudioPlayer")
          , l = t("../../common/localStorage/LocalStorage")
          , u = cc._decorator
          , p = u.ccclass
          , _ = u.property
          , h = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.node_title = null,
                e.btn_play = null,
                e.btn_share = null,
                e.btn_sound = null,
                e.btn_music = null,
                e.guide_hand = null,
                e.xingxinglabel = null,
                e.heightlabel = null,
                e.preload_prefabs = [],
                e
            }
            return n(e, t),
            e.prototype.onLoad = function() {
                console.log("onLoad 1"),
                this.btn_play.on(cc.Node.EventType.TOUCH_START, this.playGame, this),
                this.btn_play.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this),
                this.btn_share.on(cc.Node.EventType.TOUCH_END, this.share, this);
                this.guide_hand.runAction(cc.repeatForever(cc.sequence(cc.moveBy(.5, 100, 0), cc.moveBy(.5, -100, 0), cc.moveBy(.5, -100, 0), cc.moveBy(.5, 100, 0))));
                var t = cc.repeatForever(cc.sequence(cc.scaleTo(.5, 1.2, 1.2), cc.scaleTo(.5, 1, 1)));
                this.btn_share.runAction(t.clone()),
                this.node_title.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(.5, 5), cc.rotateTo(1, -5), cc.rotateTo(.5, 0), cc.delayTime(1)))),
                s.AudioPlayer.ins().get_sound_mute() ? this.btn_sound.uncheck() : this.btn_sound.check(),
                s.AudioPlayer.ins().get_music_mute() ? this.btn_music.check() : this.btn_music.uncheck(),
                this.btn_sound.node.on("toggle", this.soundChange, this),
                this.btn_music.node.on("toggle", this.musicChange, this),
                console.log("onLoad 2"),
                this.schedule(this.update1, 1)
            }
            ,
            e.prototype.update1 = function() {
                this.xingxinglabel.string = l.LocalStorage.ins().getLocal(l.CONST_STORAGE_KEY.KEY_XING, 0),
                this.heightlabel.string = l.LocalStorage.ins().getLocal(l.CONST_STORAGE_KEY.KEY_HEIGHT, 0)
            }
            ,
            e.prototype.pifu = function() {
                c.pop_mgr.get_inst().show(c.UI_CONFIG.pifu),
                s.AudioPlayer.ins().play_sound(s.AUDIO_CONFIG.Audio_Btn)
            }
            ,
            e.prototype.rank = function() {
                // c.pop_mgr.get_inst().show(c.UI_CONFIG.rank),
                // s.AudioPlayer.ins().play_sound(s.AUDIO_CONFIG.Audio_Btn)
                //埋点 排行榜
             //   console.log("ranking");
                if(window.h5api){
					if (window.h5api.isLogin()) {
                     window.h5api.showRanking();
					} else if (confirm("登录后才能看到好友哦~")) {
						window.h5api.login(function (obj) { });
					}
				}
            }
            ,
            e.prototype.shengji = function() {
                c.pop_mgr.get_inst().show(c.UI_CONFIG.upgrade),
                s.AudioPlayer.ins().play_sound(s.AUDIO_CONFIG.Audio_Btn)
            }
            ,
            e.prototype.soundChange = function() {
                var t = !this.btn_sound.isChecked;
                s.AudioPlayer.ins().set_sound_mute(t)
            }
            ,
            e.prototype.musicChange = function() {
                var t = this.btn_music.isChecked;
                s.AudioPlayer.ins().set_music_mute(t)
            }
            ,
            e.prototype.playGame = function() {
                c.pop_mgr.get_inst().show(c.UI_CONFIG.game),
                s.AudioPlayer.ins().play_sound(s.AUDIO_CONFIG.Audio_Btn)
            }
            ,
            e.prototype.onTouchMove = function(t) {
                a.EventDispatch.ins().fire(a.Event_Name.GAME_ON_TOUCH_MOVE, t)
            }
            ,
            e.prototype.share = function() {
                //埋点 分享
                //console.log("share");
                window.h5api && window.h5api.share();
               // a.EventDispatch.ins().fire(a.Event_Name.SHOW_TIPS, "分享失败")
            }
            ,
            e.prototype.openCustomizeView = function() {
                c.pop_mgr.get_inst().show(c.UI_CONFIG.customize)
            }
            ,
            i([_(cc.Node)], e.prototype, "node_title", void 0),
            i([_(cc.Node)], e.prototype, "btn_play", void 0),
            i([_(cc.Node)], e.prototype, "btn_share", void 0),
            i([_(cc.Toggle)], e.prototype, "btn_sound", void 0),
            i([_(cc.Toggle)], e.prototype, "btn_music", void 0),
            i([_(cc.Node)], e.prototype, "guide_hand", void 0),
            i([_(cc.Label)], e.prototype, "xingxinglabel", void 0),
            i([_(cc.Label)], e.prototype, "heightlabel", void 0),
            i([_([cc.Prefab])], e.prototype, "preload_prefabs", void 0),
            e = i([p], e)
        }(r.POP_UI_BASE);
        o.default = h,
        cc._RF.pop()
    }
    , {
        "../../common/audio/AudioPlayer": "AudioPlayer",
        "../../common/event/EventDispatch": "EventDispatch",
        "../../common/localStorage/LocalStorage": "LocalStorage",
        "../../common/ui/pop_mgr": "pop_mgr",
        "../../common/ui/pop_ui_base": "pop_ui_base"
    }],
    RandomUtil: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "9dcebZ21S1CcoCfjaM6tclf", "RandomUtil");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }();
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i, r = t("../base/SingletonClass");
        (function(t) {
            t[t.UNDEFINED = 0] = "UNDEFINED"
        }
        )(i = o.RandomSeedType || (o.RandomSeedType = {}));
        var c = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e._seeds = [],
                e._seedIndex = [],
                e._selectedIndexes = [],
                e._randomSeed = "0123456789abcdef",
                e
            }
            return n(e, t),
            e.ins = function() {
                return t.ins.call(this)
            }
            ,
            e.prototype.init = function(t) {
                void 0 === t && (t = "0123456789abcdef"),
                this._randomSeed = t;
                this._seeds = [],
                this._selectedIndexes = [],
                this._seedIndex = [];
                for (var e = 0, o = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; e < o.length; e++) {
                    var n = o[e];
                    this.resetSeed(n)
                }
            }
            ,
            e.prototype.resetSeed = function(t) {
                this._seeds[t] = [],
                this._selectedIndexes[t] = [],
                this._seedIndex[t] = 0;
                for (var e = 0; e < this._randomSeed.length; e++) {
                    var o = parseInt(this._randomSeed[e], 36) || 0;
                    o = (9301 * o + 49297) % 10485763 || 0,
                    this._seeds[t].push(o)
                }
            }
            ,
            e.prototype.randomNum = function(t, e, o) {
                void 0 === o && (o = i.UNDEFINED),
                t > e && (e = t);
                var n = this._seedIndex[o] % this._randomSeed.length
                  , r = t + this._seeds[o][n] % (e - t + 1);
                return this._seeds[o][n] = (9301 * this._seeds[o][n] + 49297) % 10485763 || 0,
                this._seedIndex[o]++,
                this._selectedIndexes[o].push(r),
                r
            }
            ,
            e.prototype.randomNumArray = function(t, e, o, n) {
                void 0 === n && (n = i.UNDEFINED),
                t > e && (e = t);
                var r = [];
                e - t + 1 < o && (o = e - t + 1);
                for (var c = 0; c < o; ) {
                    var a = this.randomNum(t, e, n);
                    r.indexOf(a) < 0 && (r.push(a),
                    c++)
                }
                return r
            }
            ,
            e.prototype.getPercentProbability = function(t, e) {
                return void 0 === e && (e = i.UNDEFINED),
                t >= this.randomNum(1, 100, e)
            }
            ,
            e
        }(r.default);
        o.RandomUtil = c,
        cc._RF.pop()
    }
    , {
        "../base/SingletonClass": "SingletonClass"
    }],
    ResultView: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "70743Uwb81FW7HSepgHlXBr", "ResultView");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }()
          , i = this && this.__decorate || function(t, e, o, n) {
            var i, r = arguments.length, c = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                c = Reflect.decorate(t, e, o, n);
            else
                for (var a = t.length - 1; a >= 0; a--)
                    (i = t[a]) && (c = (r < 3 ? i(c) : r > 3 ? i(e, o, c) : i(e, o)) || c);
            return r > 3 && c && Object.defineProperty(e, o, c),
            c
        }
        ;
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = t("../../common/ui/pop_mgr")
          , c = t("../../common/ui/pop_ui_base")
          , a = t("../model/GameModel")
          , s = t("../../common/audio/AudioPlayer")
          , l = t("../../common/event/EventDispatch")
          , u = cc._decorator
          , p = u.ccclass
          , _ = u.property
          , h = function(t) {
            function e() {
                var e = t.call(this) || this;
                return e.btn_reset = null,
                e.btn_revive = null,
                e.btn_revive_back = null,
                e.lb_revive_count = null,
                e.node_no_revive = null,
                e.node_revive = null,
                e.btn_share = null,
                e.lb_score = null,
                e._sound = [s.AUDIO_CONFIG.Audio_gameover, s.AUDIO_CONFIG.Audio_win, s.AUDIO_CONFIG.Audio_congra],
                e._autoReviveCount = 10,
                e
            }
            return n(e, t),
            e.prototype.onLoad = function() {
                this.btn_reset.on(cc.Node.EventType.TOUCH_END, this.backToMenu, this),
                this.btn_revive.on(cc.Node.EventType.TOUCH_END, this.gameRevive, this),
                this.btn_revive_back.on(cc.Node.EventType.TOUCH_END, this.closeGameRevive, this),
                this.btn_share.on(cc.Node.EventType.TOUCH_END, this.share, this);
                var t = cc.repeatForever(cc.sequence(cc.scaleTo(.5, 1.2, 1.2), cc.scaleTo(.5, 1, 1)));
                this.btn_revive.runAction(t),
                this.btn_share.runAction(t.clone())
            }
            ,
            e.prototype.backToMenu = function() {
                this.onCloseBtnTouch(),
                r.pop_mgr.get_inst().hide(r.UI_CONFIG.game)
            }
            ,
            e.prototype.share = function() {
               // l.EventDispatch.ins().fire(l.Event_Name.SHOW_TIPS, "\u5206\u4eab\u5931\u8d25")
               //埋点 分享
              // console.log("share");
              window.h5api && window.h5api.share();
            }
            ,
            e.prototype.closeGameRevive = function() {
                this.updateCanRevive(!1)
            }
            ,
            e.prototype.gameRevive = function() {
                l.EventDispatch.ins().fire(l.Event_Name.GAME_RELIVE),
                this.onCloseBtnTouch()
            }
            ,
            e.prototype.updateCanRevive = function(t) {
                //埋点 没有激励 t = 0, 有激励不修改t
                window.h5api && window.h5api.canPlayAd(function(data){
					if(data.canPlayAd){
                        this.node_revive.active = t,
                        this.node_no_revive.active = !t,
                        t ? (this._autoReviveCount = 10,
                        this.autoReviveCountFn(),
                        this.schedule(this.autoReviveCountFn, 1, this._autoReviveCount + 1, 0)) : this.unschedule(this.autoReviveCountFn)
                    }else{
                        t = 0;
                        this.node_revive.active = t,
                        this.node_no_revive.active = !t,
                        t ? (this._autoReviveCount = 10,
                        this.autoReviveCountFn(),
                        this.schedule(this.autoReviveCountFn, 1, this._autoReviveCount + 1, 0)) : this.unschedule(this.autoReviveCountFn)
                    }
				}.bind(this));
            }
            ,
            e.prototype.autoReviveCountFn = function() {
                this._autoReviveCount--,
                this.lb_revive_count.string = "" + this._autoReviveCount,
                this._autoReviveCount <= 0 && this.closeGameRevive()
            }
            ,
            e.prototype.on_show = function() {
                t.prototype.on_show.call(this);
                var e = a.default.ins().score;
                e > a.default.ins().bestScore && (a.default.ins().bestScore = e),
                this.lb_score.string = "" + e,
                s.AudioPlayer.ins().play_sound(this._sound[Math.floor(Math.random() * this._sound.length)] || this._sound[0]),
                a.default.ins().revive_times < 1 ? this.updateCanRevive(!0) : this.updateCanRevive(!1)
            }
            ,
            e.prototype.on_hide = function() {
                t.prototype.on_hide.call(this)
            }
            ,
            i([_(cc.Node)], e.prototype, "btn_reset", void 0),
            i([_(cc.Node)], e.prototype, "btn_revive", void 0),
            i([_(cc.Node)], e.prototype, "btn_revive_back", void 0),
            i([_(cc.Label)], e.prototype, "lb_revive_count", void 0),
            i([_(cc.Node)], e.prototype, "node_no_revive", void 0),
            i([_(cc.Node)], e.prototype, "node_revive", void 0),
            i([_(cc.Node)], e.prototype, "btn_share", void 0),
            i([_(cc.Label)], e.prototype, "lb_score", void 0),
            e = i([p], e)
        }(c.POP_UI_BASE);
        o.default = h,
        cc._RF.pop()
    }
    , {
        "../../common/audio/AudioPlayer": "AudioPlayer",
        "../../common/event/EventDispatch": "EventDispatch",
        "../../common/ui/pop_mgr": "pop_mgr",
        "../../common/ui/pop_ui_base": "pop_ui_base",
        "../model/GameModel": "GameModel"
    }],
    SingletonClass: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "67b6bxkrdtJJph7b4mJgN8P", "SingletonClass"),
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var n = function() {
            function t() {}
            return t.ins = function() {
                return this._ins || (this._ins = new this),
                this._ins
            }
            ,
            t
        }();
        o.default = n,
        cc._RF.pop()
    }
    , {}],
    SpriteFrameSet: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "97019Q80jpE2Yfz4zbuCZBq", "SpriteFrameSet");
        var n = cc.Class({
            name: "SpriteFrameSet",
            properties: {
                language: "",
                spriteFrame: cc.SpriteFrame
            }
        });
        e.exports = n,
        cc._RF.pop()
    }
    , {}],
    Tween: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "28890U/NmdCwqWMUik18OnQ", "Tween"),
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var n = t("../timer/timer_mgr")
          , i = t("../util")
          , r = function() {
            function t(t, e, o) {
                this._target = null,
                this._useTicks = !1,
                this.ignoreGlobalPause = !1,
                this.loop = !1,
                this.pluginData = null,
                this._steps = null,
                this.paused = !1,
                this.duration = 0,
                this._prevPos = -1,
                this.position = null,
                this._prevPosition = 0,
                this._stepPosition = 0,
                this.passive = !1,
                this.initialize(t, e, o)
            }
            return t.get = function(e, o, n, i) {
                return void 0 === n && (n = null),
                void 0 === i && (i = !1),
                i && t.removeTweens(e),
                new t(e,o,n)
            }
            ,
            t.removeTweens = function(e) {
                if (e.tween_count) {
                    for (var o = t._tweens, n = o.length - 1; n >= 0; n--)
                        o[n]._target == e && (o[n].paused = !0,
                        o.splice(n, 1));
                    e.tween_count = 0
                }
            }
            ,
            t.pauseTweens = function(e) {
                if (e.tween_count)
                    for (var o = t._tweens, n = o.length - 1; n >= 0; n--)
                        o[n]._target == e && (o[n].paused = !0)
            }
            ,
            t.resumeTweens = function(e) {
                if (e.tween_count)
                    for (var o = t._tweens, n = o.length - 1; n >= 0; n--)
                        o[n]._target == e && (o[n].paused = !1)
            }
            ,
            t.tick = function(e, o) {
                void 0 === o && (o = !1);
                for (var n = t._tweens.concat(), i = n.length - 1; i >= 0; i--) {
                    var r = n[i];
                    o && !r.ignoreGlobalPause || r.paused || r.$tick(r._useTicks ? 1 : e)
                }
            }
            ,
            t._register = function(e, o) {
                var r = e._target
                  , c = t._tweens;
                if (o)
                    r && (r.tween_count = r.tween_count > 0 ? r.tween_count + 1 : 1),
                    c.push(e),
                    t._inited || (t._inited = !0,
                    n.TimerMgr.getInst().add_updater(i.gen_handler(function(e) {
                        t.tick(1e3 * e)
                    })));
                else {
                    r && r.tween_count--;
                    for (var a = c.length; a--; )
                        if (c[a] == e)
                            return void c.splice(a, 1)
                }
            }
            ,
            t.removeAllTweens = function() {
                for (var e = t._tweens, o = 0, n = e.length; o < n; o++) {
                    var i = e[o];
                    i.paused = !0,
                    i._target.tween_count = 0
                }
                e.length = 0
            }
            ,
            t.prototype.initialize = function(e, o, n) {
                this._target = e,
                o && (this._useTicks = o.useTicks,
                this.ignoreGlobalPause = o.ignoreGlobalPause,
                this.loop = o.loop,
                this.onChange = o.onChange,
                this.onChangeObj = o.onChangeObj,
                o.override && t.removeTweens(e)),
                this.pluginData = n || {},
                this._curQueueProps = {},
                this._initQueueProps = {},
                this._steps = [],
                o && o.paused ? this.paused = !0 : t._register(this, !0),
                o && null != o.position && this.setPosition(o.position, t.NONE)
            }
            ,
            t.prototype.setPosition = function(t, e) {
                void 0 === e && (e = 1),
                t < 0 && (t = 0);
                var o = t
                  , n = !1;
                if (o >= this.duration)
                    if (this.loop) {
                        var i = o % this.duration;
                        o = o > 0 && 0 === i ? this.duration : i
                    } else
                        o = this.duration,
                        n = !0;
                if (o == this._prevPos)
                    return n;
                n && this.setPaused(!0);
                var r = this._prevPos;
                if (this.position = this._prevPos = o,
                this._prevPosition = t,
                this._target && this._steps.length > 0) {
                    for (var c = this._steps.length, a = -1, s = 0; s < c && !("step" == this._steps[s].type && (a = s,
                    this._steps[s].t <= o && this._steps[s].t + this._steps[s].d >= o)); s++)
                        ;
                    for (s = 0; s < c; s++)
                        if ("action" == this._steps[s].type)
                            0 != e && (this._useTicks ? this._runAction(this._steps[s], o, o) : 1 == e && o < r ? (r != this.duration && this._runAction(this._steps[s], r, this.duration),
                            this._runAction(this._steps[s], 0, o, !0)) : this._runAction(this._steps[s], r, o));
                        else if ("step" == this._steps[s].type && a == s) {
                            var l = this._steps[a];
                            this._updateTargetProps(l, Math.min((this._stepPosition = o - l.t) / l.d, 1))
                        }
                }
                return this.onChange && this.onChange.call(this.onChangeObj),
                n
            }
            ,
            t.prototype._runAction = function(t, e, o, n) {
                void 0 === n && (n = !1);
                var i = e
                  , r = o;
                e > o && (i = o,
                r = e);
                var c = t.t;
                (c == r || c > i && c < r || n && c == e) && t.f.apply(t.o, t.p)
            }
            ,
            t.prototype._updateTargetProps = function(e, o) {
                var n, i, r, c, a, s;
                if (e || 1 != o) {
                    if (this.passive = !!e.v,
                    this.passive)
                        return;
                    e.e && (o = e.e(o, 0, 1, 1)),
                    n = e.p0,
                    i = e.p1
                } else
                    this.passive = !1,
                    n = i = this._curQueueProps;
                for (var l in this._initQueueProps) {
                    null == (c = n[l]) && (n[l] = c = this._initQueueProps[l]),
                    null == (a = i[l]) && (i[l] = a = c),
                    r = c == a || 0 == o || 1 == o || "number" != typeof c ? 1 == o ? a : c : c + (a - c) * o;
                    var u = !1;
                    if (s = t._plugins[l])
                        for (var p = 0, _ = s.length; p < _; p++) {
                            var h = s[p].tween(this, l, r, n, i, o, !!e && n == i, !e);
                            h == t.IGNORE ? u = !0 : r = h
                        }
                    u || (this._target[l] = r)
                }
            }
            ,
            t.prototype.setPaused = function(e) {
                return this.paused == e ? this : (this.paused = e,
                t._register(this, !e),
                this)
            }
            ,
            t.prototype._cloneProps = function(t) {
                var e = {};
                for (var o in t)
                    e[o] = t[o];
                return e
            }
            ,
            t.prototype._addStep = function(t) {
                return t.d > 0 && (t.type = "step",
                this._steps.push(t),
                t.t = this.duration,
                this.duration += t.d),
                this
            }
            ,
            t.prototype._appendQueueProps = function(e) {
                var o, n, i, r, c;
                for (var a in e)
                    if (void 0 === this._initQueueProps[a]) {
                        if (n = this._target[a],
                        o = t._plugins[a])
                            for (i = 0,
                            r = o.length; i < r; i++)
                                n = o[i].init(this, a, n);
                        this._initQueueProps[a] = this._curQueueProps[a] = void 0 === n ? null : n
                    } else
                        n = this._curQueueProps[a];
                for (var a in e) {
                    if (n = this._curQueueProps[a],
                    o = t._plugins[a])
                        for (c = c || {},
                        i = 0,
                        r = o.length; i < r; i++)
                            o[i].step && o[i].step(this, a, n, e[a], c);
                    this._curQueueProps[a] = e[a]
                }
                return c && this._appendQueueProps(c),
                this._curQueueProps
            }
            ,
            t.prototype._addAction = function(t) {
                return t.t = this.duration,
                t.type = "action",
                this._steps.push(t),
                this
            }
            ,
            t.prototype._set = function(t, e) {
                for (var o in t)
                    e[o] = t[o]
            }
            ,
            t.prototype.wait = function(t, e) {
                if (null == t || t <= 0)
                    return this;
                var o = this._cloneProps(this._curQueueProps);
                return this._addStep({
                    d: t,
                    p0: o,
                    p1: o,
                    v: e
                })
            }
            ,
            t.prototype.to = function(t, e, o) {
                return void 0 === o && (o = void 0),
                (isNaN(e) || e < 0) && (e = 0),
                this._addStep({
                    d: e || 0,
                    p0: this._cloneProps(this._curQueueProps),
                    e: o,
                    p1: this._cloneProps(this._appendQueueProps(t))
                }),
                this.set(t)
            }
            ,
            t.prototype.call = function(t, e, o) {
                return void 0 === e && (e = void 0),
                void 0 === o && (o = void 0),
                this._addAction({
                    f: t,
                    p: o || [],
                    o: e || this._target
                })
            }
            ,
            t.prototype.set = function(t, e) {
                return void 0 === e && (e = null),
                this._appendQueueProps(t),
                this._addAction({
                    f: this._set,
                    o: this,
                    p: [t, e || this._target]
                })
            }
            ,
            t.prototype.play = function(t) {
                return t || (t = this),
                this.call(t.setPaused, t, [!1])
            }
            ,
            t.prototype.pause = function(t) {
                return t || (t = this),
                this.call(t.setPaused, t, [!0])
            }
            ,
            t.prototype.$tick = function(t) {
                this.paused || this.setPosition(this._prevPosition + t)
            }
            ,
            t.NONE = 0,
            t.LOOP = 1,
            t.REVERSE = 2,
            t._tweens = [],
            t.IGNORE = {},
            t._plugins = {},
            t._inited = !1,
            t._lastTime = 0,
            t
        }();
        o.Tween = r;
        var c = function() {
            function t() {}
            return t.get = function(t) {
                return t < -1 && (t = -1),
                t > 1 && (t = 1),
                function(e) {
                    return 0 == t ? e : t < 0 ? e * (e * -t + 1 + t) : e * ((2 - e) * t + (1 - t))
                }
            }
            ,
            t.getPowIn = function(t) {
                return function(e) {
                    return Math.pow(e, t)
                }
            }
            ,
            t.getPowOut = function(t) {
                return function(e) {
                    return 1 - Math.pow(1 - e, t)
                }
            }
            ,
            t.getPowInOut = function(t) {
                return function(e) {
                    return (e *= 2) < 1 ? .5 * Math.pow(e, t) : 1 - .5 * Math.abs(Math.pow(2 - e, t))
                }
            }
            ,
            t.sineIn = function(t) {
                return 1 - Math.cos(t * Math.PI / 2)
            }
            ,
            t.sineOut = function(t) {
                return Math.sin(t * Math.PI / 2)
            }
            ,
            t.sineInOut = function(t) {
                return -.5 * (Math.cos(Math.PI * t) - 1)
            }
            ,
            t.getBackIn = function(t) {
                return function(e) {
                    return e * e * ((t + 1) * e - t)
                }
            }
            ,
            t.getBackOut = function(t) {
                return function(e) {
                    return --e * e * ((t + 1) * e + t) + 1
                }
            }
            ,
            t.getBackInOut = function(t) {
                return t *= 1.525,
                function(e) {
                    return (e *= 2) < 1 ? e * e * ((t + 1) * e - t) * .5 : .5 * ((e -= 2) * e * ((t + 1) * e + t) + 2)
                }
            }
            ,
            t.circIn = function(t) {
                return -(Math.sqrt(1 - t * t) - 1)
            }
            ,
            t.circOut = function(t) {
                return Math.sqrt(1 - --t * t)
            }
            ,
            t.circInOut = function(t) {
                return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
            }
            ,
            t.bounceIn = function(e) {
                return 1 - t.bounceOut(1 - e)
            }
            ,
            t.bounceOut = function(t) {
                return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
            }
            ,
            t.bounceInOut = function(e) {
                return e < .5 ? .5 * t.bounceIn(2 * e) : .5 * t.bounceOut(2 * e - 1) + .5
            }
            ,
            t.getElasticIn = function(t, e) {
                var o = 2 * Math.PI;
                return function(n) {
                    if (0 == n || 1 == n)
                        return n;
                    var i = e / o * Math.asin(1 / t);
                    return -t * Math.pow(2, 10 * (n -= 1)) * Math.sin((n - i) * o / e)
                }
            }
            ,
            t.getElasticOut = function(t, e) {
                var o = 2 * Math.PI;
                return function(n) {
                    if (0 == n || 1 == n)
                        return n;
                    var i = e / o * Math.asin(1 / t);
                    return t * Math.pow(2, -10 * n) * Math.sin((n - i) * o / e) + 1
                }
            }
            ,
            t.getElasticInOut = function(t, e) {
                var o = 2 * Math.PI;
                return function(n) {
                    var i = e / o * Math.asin(1 / t);
                    return (n *= 2) < 1 ? t * Math.pow(2, 10 * (n -= 1)) * Math.sin((n - i) * o / e) * -.5 : t * Math.pow(2, -10 * (n -= 1)) * Math.sin((n - i) * o / e) * .5 + 1
                }
            }
            ,
            t.quadIn = t.getPowIn(2),
            t.quadOut = t.getPowOut(2),
            t.quadInOut = t.getPowInOut(2),
            t.cubicIn = t.getPowIn(3),
            t.cubicOut = t.getPowOut(3),
            t.cubicInOut = t.getPowInOut(3),
            t.quartIn = t.getPowIn(4),
            t.quartOut = t.getPowOut(4),
            t.quartInOut = t.getPowInOut(4),
            t.quintIn = t.getPowIn(5),
            t.quintOut = t.getPowOut(5),
            t.quintInOut = t.getPowInOut(5),
            t.backIn = t.getBackIn(1.7),
            t.backOut = t.getBackOut(1.7),
            t.backInOut = t.getBackInOut(1.7),
            t.elasticIn = t.getElasticIn(1, .3),
            t.elasticOut = t.getElasticOut(1, .3),
            t.elasticInOut = t.getElasticInOut(1, .3 * 1.5),
            t
        }();
        o.Ease = c,
        cc._RF.pop()
    }
    , {
        "../timer/timer_mgr": "timer_mgr",
        "../util": "util"
    }],
    cell: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "c6c0bzcHZpB8pJZtMBpxvkw", "cell");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }()
          , i = this && this.__decorate || function(t, e, o, n) {
            var i, r = arguments.length, c = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                c = Reflect.decorate(t, e, o, n);
            else
                for (var a = t.length - 1; a >= 0; a--)
                    (i = t[a]) && (c = (r < 3 ? i(c) : r > 3 ? i(e, o, c) : i(e, o)) || c);
            return r > 3 && c && Object.defineProperty(e, o, c),
            c
        }
        ;
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = t("../../common/localStorage/LocalStorage")
           ,eD = t("../../common/event/EventDispatch")
          , c = cc._decorator
          , a = c.ccclass
          , s = c.property
          , l = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.label = null,
                e.text = "hello",
                e.type = 0,
                e.pftype = -1,
                e.suonode = null,
                e.xuanznode = null,
                e.ballsp = null,
                e.tuji = null,
                e
            }
            return n(e, t),
            e.prototype.start = function() {}
            ,
            e.prototype.gettheam = function(t) {
                var e = [[89, 211, 229, 255], [225, 225, 225, 255], [242, 244, 55, 255], [245, 129, 241, 255], [232, 152, 38, 255], [68, 206, 235, 255], [225, 225, 225, 255], [231, 220, 43, 255], [66, 243, 195, 255], [243, 224, 66, 255], [241, 116, 193, 255], [66, 216, 229, 255]]
                  , o = [];
                return o[0] = ["theme0", "theme1", "snow1", "theme3", "leaf1", "diamond", "theme5", "flower", "leaf2", "snow2", "spark1", "spark2"][t],
                o[1] = new cc.Color(e[t][0],e[t][1],e[t][2]),
                o
            }
            ,
            e.prototype.onLoad = function(){
                // var kuang = cc.find("suo", this.node);
                // kuang.active = 0;
                console.log(this.node);
            },
            e.prototype.init = function(t) {
                if (this.pftype = t,
                0 == this.type)
                    this.ballsp.spriteFrame = this.tuji.getSpriteFrame("ball" + t);
                else {
                    var e = this.gettheam(this.pftype);
                    this.ballsp.spriteFrame = this.tuji.getSpriteFrame(e[0]),
                    this.ballsp.node.color = e[1]
                }
            }
            ,
            e.prototype.updatestate = function(t, e) {
                this.suonode.active = !t,
                this.xuanznode.active = e
            }
            ,
            e.prototype.callbut = function(t, e) {
                if(((0 == this.type) && (0 == cc.sys.localStorage.getItem("ballopen" + this.pftype))) || ((1 == this.type) && (0 == cc.sys.localStorage.getItem("fgopen" + this.pftype)))){
                    eD.EventDispatch.ins().fire(eD.Event_Name.SHOW_TIPS, "没有获得");
                    //埋点 ！！！！！先检测是否有激励，然后播放激励，播放完回调下面！！！！！！！！！！！！！！
                    var thisObj = this;
                    window.h5api && window.h5api.canPlayAd(function(data){
                        if(data.canPlayAd){
                            if(window.h5api && confirm("是否播放视频,获得相应奖励？")){
                                window.h5api.playAd(function(obj){
                                    console.log('代码:' + obj.code + ',消息:' + obj.message);
                                    if (obj.code === 10000) {
                                        console.log('开始播放');
                                    } else if (obj.code === 10001) {
                                        thisObj.clickCell(t, e);
                                    } else {
                                        console.log('广告异常');
                                    }
                                }.bind(this));
                            }
                        }
                    }.bind(this));
                }else{
                    this.clickCell(t, e);
                }
            }
            ,
            e.prototype.clickCell = function(t, e){
                (console.log(" sele : " + this.pftype),
                0 == this.type) ? 0 == cc.sys.localStorage.getItem("ballopen" + this.pftype) ? (cc.sys.localStorage.setItem("ballopen" + this.pftype, 1),
                r.LocalStorage.ins().setLocal(r.CONST_STORAGE_KEY.KEY_SLEECTQQ, this.pftype)) : r.LocalStorage.ins().setLocal(r.CONST_STORAGE_KEY.KEY_SLEECTQQ, this.pftype) : 0 == cc.sys.localStorage.getItem("fgopen" + this.pftype) ? (cc.sys.localStorage.setItem("fgopen" + this.pftype, 1),
                r.LocalStorage.ins().setLocal(r.CONST_STORAGE_KEY.KEY_SLEECTFG, this.pftype)) : r.LocalStorage.ins().setLocal(r.CONST_STORAGE_KEY.KEY_SLEECTFG, this.pftype)
            },
            i([s(cc.Label)], e.prototype, "label", void 0),
            i([s], e.prototype, "text", void 0),
            i([s], e.prototype, "type", void 0),
            i([s], e.prototype, "pftype", void 0),
            i([s(cc.Node)], e.prototype, "suonode", void 0),
            i([s(cc.Node)], e.prototype, "xuanznode", void 0),
            i([s(cc.Sprite)], e.prototype, "ballsp", void 0),
            i([s(cc.SpriteAtlas)], e.prototype, "tuji", void 0),
            e = i([a], e)
        }(cc.Component);
        o.default = l,
        cc._RF.pop()
    }
    , {
        "../../common/localStorage/LocalStorage": "LocalStorage",
        "../../common/event/EventDispatch":"EventDispatch"
    }],
    linklist: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "bdd09bYpc5GwI0jOASAzWlq", "linklist"),
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var n = function() {
            function t() {
                this._head = this._tail = null,
                this.pool = []
            }
            return t.prototype.spawn_node = function(t, e) {
                var o = this.pool.pop();
                return o ? (o.key = t,
                o.data = e,
                o.next = null) : o = {
                    key: t,
                    data: e,
                    next: null
                },
                o
            }
            ,
            Object.defineProperty(t.prototype, "head", {
                get: function() {
                    return this._head
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "tail", {
                get: function() {
                    return this._tail
                },
                enumerable: !0,
                configurable: !0
            }),
            t.prototype.append = function(t, e) {
                var o = this.spawn_node(t, e);
                return this._tail ? (this._tail.next = o,
                this._tail = o) : this._head = this._tail = o,
                o.key
            }
            ,
            t.prototype.remove = function(t) {
                if (!t)
                    return null;
                if (!this._head)
                    return null;
                for (var e, o = this._head; o && o.key != t; )
                    e = o,
                    o = o.next;
                return o ? (e ? (e.next = o.next,
                o.next || (this._tail = e)) : (this._head = o.next,
                o.next || (this._tail = null)),
                this.pool.push(o),
                o) : null
            }
            ,
            t
        }();
        o.LinkList = n,
        cc._RF.pop()
    }
    , {}],
    loader_mgr: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "ef581f23+RGqbKbSbfR960u", "loader_mgr"),
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var n = function() {
            function t() {}
            return t.get_inst = function() {
                return t.inst || (t.inst = new t),
                t.inst
            }
            ,
            t.prototype.loadExternalAsset = function(t, e, o) {
                var n = cc.loader.getRes(t);
                n ? e.exec(n) : cc.loader.load(o ? {
                    url: t,
                    type: o
                } : t, function(o, n) {
                    o ? cc.warn("loadExternalAsset error", t) : e.exec(n)
                })
            }
            ,
            t.prototype.loadExternalAssets = function(t, e, o) {
                var n = {}
                  , i = [];
                if (t.forEach(function(t) {
                    var e = cc.loader.getRes(t);
                    e ? n[t] = e : i.push(t)
                }),
                0 != i.length) {
                    var r = [];
                    i.forEach(function(t, e) {
                        o ? r.push({
                            url: t,
                            type: o[e]
                        }) : r.push(t)
                    }),
                    cc.loader.load(r, function(t, o) {
                        cc.log("loadExternalAssets from remote url"),
                        t ? cc.warn("loadExternalAssets error", t) : (i.forEach(function(t) {
                            n[t] = o.getContent(t)
                        }),
                        e.exec(n))
                    })
                } else
                    e.exec(n)
            }
            ,
            t.prototype.loadRawAsset = function(t, e) {
                var o = cc.loader.getRes(t);
                o ? e.exec(o) : cc.loader.loadRes(t, function(o, n) {
                    o ? cc.warn("loadRawAsset error", t) : e.exec(n)
                })
            }
            ,
            t.prototype.loadAsset = function(t, e, o) {
                var n = cc.loader.getRes(t, o);
                n ? e.exec(n) : cc.loader.loadRes(t, o, function(o, n) {
                    o ? cc.warn("loadAsset error", t) : e.exec(n)
                })
            }
            ,
            t.prototype.loadResArray = function(t, e) {
                var o = {}
                  , n = [];
                t.forEach(function(t) {
                    var e = cc.loader.getRes(t);
                    e ? o[t] = e : n.push(t)
                }),
                0 != n.length ? cc.loader.loadResArray(n, function(t, i) {
                    t ? cc.warn("loadResArray error", n) : (n.forEach(function(t) {
                        o[t] = cc.loader.getRes(t)
                    }),
                    e.exec(o))
                }) : e.exec(o)
            }
            ,
            t.prototype.loadPrefabObj = function(t, e) {
                var o = cc.loader.getRes(t, cc.Prefab);
                if (o) {
                    var n = cc.instantiate(o);
                    e.exec(n)
                } else
                    cc.loader.loadRes(t, cc.Prefab, function(o, n) {
                        if (o)
                            cc.warn("loadPrefabObj error", t, o);
                        else {
                            var i = cc.instantiate(n);
                            e.exec(i)
                        }
                    })
            }
            ,
            t.prototype.loadPrefabObjArray = function(t, e) {
                var o = {}
                  , n = [];
                t.forEach(function(t) {
                    var e = cc.loader.getRes(t, cc.Prefab);
                    e ? o[t] = cc.instantiate(e) : n.push(t)
                }),
                0 != n.length ? cc.loader.loadResArray(n, cc.Prefab, function(t, i) {
                    t ? cc.warn("loadPrefabObjArray error", n) : (n.forEach(function(t) {
                        o[t] = cc.instantiate(cc.loader.getRes(t, cc.Prefab))
                    }),
                    e.exec(o))
                }) : e.exec(o)
            }
            ,
            t.prototype.loadPrefabDir = function(t, e) {
                var o = {};
                cc.loader.loadResDir(t, cc.Prefab, function(n, i, r) {
                    n ? cc.warn("loadPrefabObjDir error", t) : (r.forEach(function(t) {
                        o[t] = cc.loader.getRes(t, cc.Prefab)
                    }),
                    e.exec(o))
                })
            }
            ,
            t.prototype.loadPrefabObjDir = function(t, e) {
                var o = {};
                cc.loader.loadResDir(t, cc.Prefab, function(n, i, r) {
                    n ? cc.warn("loadPrefabObjDir error", t) : (r.forEach(function(t) {
                        o[t] = cc.instantiate(cc.loader.getRes(t, cc.Prefab))
                    }),
                    e.exec(o))
                })
            }
            ,
            t.prototype.release = function(t) {
                t instanceof cc.Node ? t.destroy() : cc.loader.release(t)
            }
            ,
            t
        }();
        o.loader_mgr = n,
        cc._RF.pop()
    }
    , {}],
    pifu: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "8c99aBVdd1MT4nZmLY7SnJG", "pifu");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }()
          , i = this && this.__decorate || function(t, e, o, n) {
            var i, r = arguments.length, c = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                c = Reflect.decorate(t, e, o, n);
            else
                for (var a = t.length - 1; a >= 0; a--)
                    (i = t[a]) && (c = (r < 3 ? i(c) : r > 3 ? i(e, o, c) : i(e, o)) || c);
            return r > 3 && c && Object.defineProperty(e, o, c),
            c
        }
        ;
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = t("../../common/audio/AudioPlayer")
          , c = t("../../common/ui/pop_mgr")
          , a = t("../../common/ui/pop_ui_base")
          , s = t("../../common/localStorage/LocalStorage")
          , l = cc._decorator
          , u = l.ccclass
          , p = l.property
          , _ = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.label = null,
                e.text = "hello",
                e.scoreqq = null,
                e.parents = null,
                e.nodeqq = null,
                e.nodefgpf = null,
                e.nodeqqlist = [],
                e.scorefg = null,
                e.parentsfg = null,
                e.nodefg = null,
                e.nodeqqlistfg = [],
                e.selecttype = 0,
                e
            }
            return n(e, t),
            e.prototype.start = function() {
                for (var t = s.LocalStorage.ins().getLocal(s.CONST_STORAGE_KEY.KEY_SLEECTQQ, 0), e = 0; e < 6; e++)
                    for (var o = 0; o < 3; o++) {
                        (r = cc.instantiate(this.nodeqq)).x = 186.129 * o - 186.129,
                        r.y = -240 * e - 116.131;
                        var n = 3 * e + o;
                        this.nodeqqlist[n] = r,
                        r.getComponent("cell").init(n),
                        null == (c = cc.sys.localStorage.getItem("ballopen" + n)) || void 0 == c || "" == c ? 0 == n ? (cc.sys.localStorage.setItem("ballopen" + n, 1),
                        c = !0) : (cc.sys.localStorage.setItem("ballopen" + n, 0),
                        c = !1) : c = 1 == c;
                        var i = n == t;
                        r.getComponent("cell").updatestate(c, i),
                        r.parent = this.parents
                    }
                t = s.LocalStorage.ins().getLocal(s.CONST_STORAGE_KEY.KEY_SLEECTFG, 0);
                for (e = 0; e < 4; e++)
                    for (o = 0; o < 3; o++) {
                        var r;
                        (r = cc.instantiate(this.nodefgpf)).x = 186.129 * o - 186.129,
                        r.y = -240 * e - 116.131;
                        var c;
                        n = 3 * e + o;
                        this.nodeqqlistfg[n] = r,
                        r.getComponent("cell").init(n),
                        null == (c = cc.sys.localStorage.getItem("fgopen" + n)) || void 0 == c || "" == c ? 0 == n ? (cc.sys.localStorage.setItem("fgopen" + n, 1),
                        c = !0) : (cc.sys.localStorage.setItem("fgopen" + n, 0),
                        c = !1) : c = 1 == c;
                        i = n == t;
                        r.getComponent("cell").updatestate(c, i),
                        r.parent = this.parentsfg
                    }
                this.schedule(this.updatepifu, 1),
                this.updatenewscore(),
                this.updatepifu()
            }
            ,
            e.prototype.updatenewscore = function() {
                0 == this.selecttype ? (this.nodefg.active = !1,
                this.nodeqq.active = !0) : 1 == this.selecttype && (this.nodefg.active = !0,
                this.nodeqq.active = !1)
            }
            ,
            e.prototype.updatepifu = function() {
                if (0 == this.selecttype)
                    for (var t = s.LocalStorage.ins().getLocal(s.CONST_STORAGE_KEY.KEY_SLEECTQQ, 0), e = 0; e < 6; e++)
                        for (var o = 0; o < 3; o++) {
                            var n = 3 * e + o
                              , i = this.nodeqqlist[n];
                            c = 1 == (c = cc.sys.localStorage.getItem("ballopen" + n));
                            var r = n == t;
                            i.getComponent("cell").updatestate(c, r)
                        }
                else if (1 == this.selecttype)
                    for (t = s.LocalStorage.ins().getLocal(s.CONST_STORAGE_KEY.KEY_SLEECTFG, 0),
                    e = 0; e < 4; e++)
                        for (o = 0; o < 3; o++) {
                            var c;
                            n = 3 * e + o,
                            i = this.nodeqqlistfg[n];
                            c = 1 == (c = cc.sys.localStorage.getItem("fgopen" + n));
                            r = n == t;
                            i.getComponent("cell").updatestate(c, r)
                        }
            }
            ,
            e.prototype.pifubut = function() {
                this.selecttype = 0,
                this.updatenewscore(),
                this.updatepifu()
            }
            ,
            e.prototype.zhuyibut = function() {
                this.selecttype = 1,
                this.updatenewscore(),
                this.updatepifu()
            }
            ,
            e.prototype.close = function() {
                r.AudioPlayer.ins().play_sound(r.AUDIO_CONFIG.Audio_Btn),
                c.pop_mgr.get_inst().hide(c.UI_CONFIG.pifu)
            }
            ,
            i([p(cc.Label)], e.prototype, "label", void 0),
            i([p], e.prototype, "text", void 0),
            i([p(cc.Node)], e.prototype, "scoreqq", void 0),
            i([p(cc.Node)], e.prototype, "parents", void 0),
            i([p(cc.Node)], e.prototype, "nodeqq", void 0),
            i([p(cc.Node)], e.prototype, "nodefgpf", void 0),
            i([p(cc.Node)], e.prototype, "nodeqqlist", void 0),
            i([p(cc.Node)], e.prototype, "scorefg", void 0),
            i([p(cc.Node)], e.prototype, "parentsfg", void 0),
            i([p(cc.Node)], e.prototype, "nodefg", void 0),
            i([p(cc.Node)], e.prototype, "nodeqqlistfg", void 0),
            i([p], e.prototype, "selecttype", void 0),
            e = i([u], e)
        }(a.POP_UI_BASE);
        o.default = _,
        cc._RF.pop()
    }
    , {
        "../../common/audio/AudioPlayer": "AudioPlayer",
        "../../common/localStorage/LocalStorage": "LocalStorage",
        "../../common/ui/pop_mgr": "pop_mgr",
        "../../common/ui/pop_ui_base": "pop_ui_base"
    }],
    "polyglot.min": [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "e26fd9yy65A4q3/JkpVnFYg", "polyglot.min");
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        ;
        (function(t, i) {
            "function" == typeof define && define.amd ? define([], function() {
                return i(t)
            }) : "object" == (void 0 === o ? "undefined" : n(o)) ? e.exports = i(t) : t.Polyglot = i(t)
        }
        )(void 0, function(t) {
            function e(t) {
                t = t || {},
                this.phrases = {},
                this.extend(t.phrases || {}),
                this.currentLocale = t.locale || "en",
                this.allowMissing = !!t.allowMissing,
                this.warn = t.warn || l
            }
            function o(t) {
                var e, o, n, i = {};
                for (e in t)
                    if (t.hasOwnProperty(e))
                        for (n in o = t[e])
                            i[o[n]] = e;
                return i
            }
            function i(t) {
                return t.replace(/^\s+|\s+$/g, "")
            }
            function r(t, e, o) {
                var n, r;
                return null != o && t ? n = i((r = t.split(p))[a(e, o)] || r[0]) : n = t,
                n
            }
            function c(t) {
                var e = o(h);
                return e[t] || e.en
            }
            function a(t, e) {
                return _[c(t)](e)
            }
            function s(t, e) {
                for (var o in e)
                    "_" !== o && e.hasOwnProperty(o) && (t = t.replace(new RegExp("%\\{" + o + "\\}","g"), e[o]));
                return t
            }
            function l(e) {
                t.console && t.console.warn && t.console.warn("WARNING: " + e)
            }
            function u(t) {
                var e = {};
                for (var o in t)
                    e[o] = t[o];
                return e
            }
            e.VERSION = "0.4.3",
            e.prototype.locale = function(t) {
                return t && (this.currentLocale = t),
                this.currentLocale
            }
            ,
            e.prototype.extend = function(t, e) {
                var o;
                for (var i in t)
                    t.hasOwnProperty(i) && (o = t[i],
                    e && (i = e + "." + i),
                    "object" == (void 0 === o ? "undefined" : n(o)) ? this.extend(o, i) : this.phrases[i] = o)
            }
            ,
            e.prototype.clear = function() {
                this.phrases = {}
            }
            ,
            e.prototype.replace = function(t) {
                this.clear(),
                this.extend(t)
            }
            ,
            e.prototype.t = function(t, e) {
                var o, n;
                return "number" == typeof (e = null == e ? {} : e) && (e = {
                    smart_count: e
                }),
                "string" == typeof this.phrases[t] ? o = this.phrases[t] : "string" == typeof e._ ? o = e._ : this.allowMissing ? o = t : (this.warn('Missing translation for key: "' + t + '"'),
                n = t),
                "string" == typeof o && (e = u(e),
                n = s(n = r(o, this.currentLocale, e.smart_count), e)),
                n
            }
            ,
            e.prototype.has = function(t) {
                return t in this.phrases
            }
            ;
            var p = "||||"
              , _ = {
                chinese: function(t) {
                    return 0
                },
                german: function(t) {
                    return 1 !== t ? 1 : 0
                },
                french: function(t) {
                    return t > 1 ? 1 : 0
                },
                russian: function(t) {
                    return t % 10 == 1 && t % 100 != 11 ? 0 : t % 10 >= 2 && t % 10 <= 4 && (t % 100 < 10 || t % 100 >= 20) ? 1 : 2
                },
                czech: function(t) {
                    return 1 === t ? 0 : t >= 2 && t <= 4 ? 1 : 2
                },
                polish: function(t) {
                    return 1 === t ? 0 : t % 10 >= 2 && t % 10 <= 4 && (t % 100 < 10 || t % 100 >= 20) ? 1 : 2
                },
                icelandic: function(t) {
                    return t % 10 != 1 || t % 100 == 11 ? 1 : 0
                }
            }
              , h = {
                chinese: ["fa", "id", "ja", "ko", "lo", "ms", "th", "tr", "zh"],
                german: ["da", "de", "en", "es", "fi", "el", "he", "hu", "it", "nl", "no", "pt", "sv"],
                french: ["fr", "tl", "pt-br"],
                russian: ["hr", "ru"],
                czech: ["cs"],
                polish: ["pl"],
                icelandic: ["is"]
            };
            return e
        }),
        cc._RF.pop()
    }
    , {}],
    pool_mgr: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "29eb514/fREDJnvpZLCUcBZ", "pool_mgr"),
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var n = t("../loader/loader_mgr")
          , i = t("./ui_pool")
          , r = function() {
            function t() {
                this.ui_pool = new i.ui_pool
            }
            return t.get_inst = function() {
                return this._inst || (this._inst = new t),
                this._inst
            }
            ,
            t.prototype.get_ui = function(t, e) {
                var o = this.ui_pool.get(t);
                o ? e.exec(o) : n.loader_mgr.get_inst().loadPrefabObj(t, e)
            }
            ,
            t.prototype.put_ui = function(t, e) {
                e ? this.ui_pool.put(t, e) : cc.warn("pool_mgr:put_ui, invalid node")
            }
            ,
            t.prototype.clear_atpath = function(t) {
                this.ui_pool.clear_atpath(t)
            }
            ,
            t.prototype.clear = function() {
                this.ui_pool.clear()
            }
            ,
            t.prototype.dump = function() {
                this.ui_pool.dump()
            }
            ,
            t
        }();
        o.pool_mgr = r,
        cc._RF.pop()
    }
    , {
        "../loader/loader_mgr": "loader_mgr",
        "./ui_pool": "ui_pool"
    }],
    pop_mgr: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "424697+0GpMebIfgAZGNA0h", "pop_mgr"),
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var n, i = t("../pool/pool_mgr"), r = t("../util"), c = t("./pop_ui_base"), a = t("../timer/timer_mgr"), s = t("../util"), l = t("../tween/Tween"), u = function() {
            function t() {
                this.ui_cache = {},
                this.ui_stack = new Array
            }
            return t.get_inst = function() {
                return this.inst || (this.inst = new t),
                this.inst
            }
            ,
            t.prototype.get_ui = function(t) {
                var e = this.ui_cache[t];
                return e || (this.ui_cache[t] = e = {
                    node: null,
                    is_show: !1
                }),
                e
            }
            ,
            t.prototype.clear = function() {
                for (var t in this.ui_cache)
                    this.hide(t);
                this.ui_cache = {},
                this.ui_stack.length = 0
            }
            ,
            t.prototype.peek = function() {
                return this.ui_stack[this.ui_stack.length - 1]
            }
            ,
            t.prototype.set_handlers = function(t, e) {
                this.ui_show_handler = t,
                this.ui_hide_handler = e
            }
            ,
            t.prototype.is_show = function(t) {
                return null != this.ui_cache[t]
            }
            ,
            t.prototype.show = function(t, e) {
                for (var o = this, n = [], l = 2; l < arguments.length; l++)
                    n[l - 2] = arguments[l];
                var u = this.get_ui(t);
                u.is_show || (u.is_show = !0,
                i.pool_mgr.get_inst().get_ui(t, r.gen_handler(function(r) {
                    u.is_show ? (u.node = r,
                    o.applyTransitionEffect(r, e),
                    cc.director.getScene().getChildByName("Canvas").getChildByName("mid_layer").addChild(r),
                    a.TimerMgr.getInst().once(0, s.gen_handler(function() {
                        if (u.is_show) {
                            var e = r.getComponent(c.POP_UI_BASE);
                            console.log("ui_name : " + t),
                            e.ui_name = t,
                            e.__show__.apply(e, n),
                            o.ui_stack.push(t),
                            o.ui_show_handler && o.ui_show_handler.exec()
                        }
                    }))) : i.pool_mgr.get_inst().put_ui(t, r)
                }, this)))
            }
            ,
            t.prototype.hide = function(t) {
                var e = this.ui_cache[t];
                if (e && (this.ui_cache[t] = null,
                e.is_show = !1,
                e.node)) {
                    i.pool_mgr.get_inst().put_ui(t, e.node),
                    e.node.getComponent(c.POP_UI_BASE).__hide__();
                    var o = this.ui_stack.lastIndexOf(t);
                    -1 != o && this.ui_stack.splice(o, 1),
                    this.ui_hide_handler && this.ui_hide_handler.exec()
                }
            }
            ,
            t.prototype.applyTransitionEffect = function(t, e) {
                if (!e || e.transType != n.None)
                    switch ((e = e || {
                        transType: n.FadeIn,
                        duration: 500
                    }).transType) {
                    case n.FadeIn:
                        l.Tween.removeTweens(t),
                        t.opacity = 0,
                        l.Tween.get(t).to({
                            opacity: 255
                        }, e.duration)
                    }
            }
            ,
            t
        }();
        o.pop_mgr = u,
        o.UI_CONFIG = {
            overlay_bg: "prefab/panels/panel_overlay_bg",
            game: "prefab/view/game",
            upgrade: "prefab/view/upgrade",
            rank: "prefab/view/rank",
            customize: "prefab/view/customize",
            pifu: "prefab/view/pifu",
            result: "prefab/view/result",
            menu: "prefab/view/menu"
        },
        function(t) {
            t[t.None = 1] = "None",
            t[t.FadeIn = 2] = "FadeIn",
            t[t.DropDown = 3] = "DropDown",
            t[t.PopUp = 4] = "PopUp",
            t[t.LeftIn = 5] = "LeftIn",
            t[t.RightIn = 6] = "RightIn"
        }(n = o.UI_TRANSITION_TYPE || (o.UI_TRANSITION_TYPE = {})),
        cc._RF.pop()
    }
    , {
        "../pool/pool_mgr": "pool_mgr",
        "../timer/timer_mgr": "timer_mgr",
        "../tween/Tween": "Tween",
        "../util": "util",
        "./pop_ui_base": "pop_ui_base"
    }],
    pop_ui_base: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "e2e68FLOYBOaqRk0bNgNIyc", "pop_ui_base");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }()
          , i = this && this.__decorate || function(t, e, o, n) {
            var i, r = arguments.length, c = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                c = Reflect.decorate(t, e, o, n);
            else
                for (var a = t.length - 1; a >= 0; a--)
                    (i = t[a]) && (c = (r < 3 ? i(c) : r > 3 ? i(e, o, c) : i(e, o)) || c);
            return r > 3 && c && Object.defineProperty(e, o, c),
            c
        }
        ;
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = t("./pop_mgr")
          , c = t("../pool/pool_mgr")
          , a = t("../util")
          , s = t("../../common/audio/audioplayer")
          , l = cc._decorator
          , u = l.ccclass
          , p = l.property
          , _ = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.btn_close = null,
                e
            }
            return n(e, t),
            Object.defineProperty(e.prototype, "ui_name", {
                set: function(t) {
                    this._ui_name = t
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.__show__ = function() {
                for (var t = this, e = [], o = 0; o < arguments.length; o++)
                    e[o] = arguments[o];
                this.btn_close && this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onCloseBtnTouch, this),
                this.is_show = !0,
                this.on_show.apply(this, e),
                this.node.getChildByName("panel_overlay_bg") || c.pool_mgr.get_inst().get_ui(r.UI_CONFIG.overlay_bg, a.gen_handler(function(e) {
                    t.is_show && !t.node.getChildByName("panel_overlay_bg") ? (e.name = "panel_overlay_bg",
                    t.node.addChild(e),
                    e.setSiblingIndex(0)) : c.pool_mgr.get_inst().put_ui(r.UI_CONFIG.overlay_bg, e)
                }, this))
            }
            ,
            e.prototype.__hide__ = function() {
                cc.log("hide", this._ui_name),
                this.btn_close && this.btn_close.node.off(cc.Node.EventType.TOUCH_END, this.onCloseBtnTouch, this),
                this.is_show = !1,
                this.on_hide()
            }
            ,
            e.prototype.on_show = function() {
                for (var t = [], e = 0; e < arguments.length; e++)
                    t[e] = arguments[e]
            }
            ,
            e.prototype.on_hide = function() {}
            ,
            e.prototype.hide = function() {
                r.pop_mgr.get_inst().hide(this._ui_name)
            }
            ,
            e.prototype.onCloseBtnTouch = function() {
                this.hide(),
                s.AudioPlayer.ins().play_sound(s.AUDIO_CONFIG.Audio_Btn)
            }
            ,
            i([p(cc.Button)], e.prototype, "btn_close", void 0),
            e = i([u], e)
        }(cc.Component);
        o.POP_UI_BASE = _,
        cc._RF.pop()
    }
    , {
        "../../common/audio/audioplayer": "AudioPlayer",
        "../pool/pool_mgr": "pool_mgr",
        "../util": "util",
        "./pop_mgr": "pop_mgr"
    }],
    rank: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "9865e1BacNKt5fsF3kx+PLM", "rank");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }()
          , i = this && this.__decorate || function(t, e, o, n) {
            var i, r = arguments.length, c = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                c = Reflect.decorate(t, e, o, n);
            else
                for (var a = t.length - 1; a >= 0; a--)
                    (i = t[a]) && (c = (r < 3 ? i(c) : r > 3 ? i(e, o, c) : i(e, o)) || c);
            return r > 3 && c && Object.defineProperty(e, o, c),
            c
        }
        ;
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = t("../../common/audio/AudioPlayer")
          , c = t("../../common/ui/pop_mgr")
          , a = t("../../common/ui/pop_ui_base")
          , s = cc._decorator
          , l = s.ccclass
          , u = s.property
          , p = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.label = null,
                e.text = "hello",
                e
            }
            return n(e, t),
            e.prototype.start = function() {}
            ,
            e.prototype.close = function() {
                r.AudioPlayer.ins().play_sound(r.AUDIO_CONFIG.Audio_Btn),
                c.pop_mgr.get_inst().hide(c.UI_CONFIG.rank)
            }
            ,
            i([u(cc.Label)], e.prototype, "label", void 0),
            i([u], e.prototype, "text", void 0),
            e = i([l], e)
        }(a.POP_UI_BASE);
        o.default = p,
        cc._RF.pop()
    }
    , {
        "../../common/audio/AudioPlayer": "AudioPlayer",
        "../../common/ui/pop_mgr": "pop_mgr",
        "../../common/ui/pop_ui_base": "pop_ui_base"
    }],
    timer_mgr: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "55db98KfNxEboJhHMMpseOV", "timer_mgr"),
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var n = t("../linklist")
          , i = function() {
            function t() {
                this.key = 0,
                this.pool = [],
                this.iterList = new n.LinkList,
                this.pendingList = new n.LinkList
            }
            return t.getInst = function() {
                return this.inst || (this.inst = new t),
                this.inst
            }
            ,
            t.prototype.add = function(t, e, o, n, i) {
                void 0 === i && (i = !1);
                var r = this.pool.pop();
                return r ? (r.interval = t,
                r.delay = e,
                r.repeat = o,
                r.elapsed = 0,
                r.times = 0,
                r.is_updater = i,
                r.cb = n) : r = {
                    interval: t,
                    delay: e,
                    repeat: o,
                    elapsed: 0,
                    times: 0,
                    is_updater: i,
                    cb: n
                },
                this.pendingList.append(++this.key, r)
            }
            ,
            t.prototype.remove = function(t) {
                this.removeIter(t) || this.removePending(t)
            }
            ,
            t.prototype.removeIter = function(t) {
                var e = this.iterList.remove(t);
                return !!e && (this.pool.push(e.data),
                !0)
            }
            ,
            t.prototype.removePending = function(t) {
                var e = this.pendingList.remove(t);
                return !!e && (this.pool.push(e.data),
                !0)
            }
            ,
            t.prototype.loop = function(t, e) {
                return this.add(t, 0, 0, e)
            }
            ,
            t.prototype.loopTimes = function(t, e, o) {
                return this.add(t, 0, e, o)
            }
            ,
            t.prototype.frameLoop = function(t) {
                return this.add(1 / 24, 0, 0, t)
            }
            ,
            t.prototype.delayLoop = function(t, e, o) {
                return this.add(t, e, 0, o)
            }
            ,
            t.prototype.once = function(t, e) {
                return this.add(0, t, 1, e)
            }
            ,
            t.prototype.add_updater = function(t) {
                return this.add(0, 0, 0, t, !0)
            }
            ,
            t.prototype.update = function(t) {
                for (var e = this.iterList.head; e; )
                    if (e.data.is_updater) {
                        var o = e.next;
                        e.data.cb.exec(t),
                        e = o
                    } else if (0 != e.data.repeat && e.data.times >= e.data.repeat) {
                        o = e.next;
                        this.removeIter(e.key),
                        e = o
                    } else if (e.data.elapsed >= e.data.delay + e.data.interval) {
                        o = e.next;
                        e.data.times++,
                        e.data.elapsed = e.data.delay,
                        e.data.cb.exec(),
                        e = o
                    } else
                        e.data.elapsed += t,
                        e = e.next;
                for (e = this.pendingList.head; e; ) {
                    var n = e.key
                      , i = e.data;
                    e = e.next,
                    this.pendingList.remove(n),
                    this.iterList.append(n, i)
                }
            }
            ,
            t
        }();
        o.TimerMgr = i,
        cc._RF.pop()
    }
    , {
        "../linklist": "linklist"
    }],
    ui_pool: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "0a950yUsOZNy5HTWZ9gz1hi", "ui_pool"),
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var n = function() {
            function t() {
                this.max_size = 2,
                this.cache = {},
                this.path2time = {},
                this.size = 0
            }
            return t.prototype.get = function(t) {
                var e = this.cache[t];
                return e && e.length > 0 ? (this.size--,
                e.pop()) : null
            }
            ,
            t.prototype.put = function(t, e) {
                if (this.size >= this.max_size) {
                    var o = void 0
                      , n = cc.sys.now();
                    for (var i in this.cache)
                        this.cache[i].length > 0 && this.path2time[i] < n && (n = this.path2time[i],
                        o = i);
                    if (o && "" != o)
                        this.cache[o].pop().destroy(),
                        this.size--
                }
                var r = this.cache[t];
                r || (this.cache[t] = r = []),
                e.removeFromParent(!1),
                r.push(e),
                this.size++,
                this.path2time[t] = cc.sys.now()
            }
            ,
            t.prototype.clear_atpath = function(t) {
                var e = this.cache[t];
                if (e && !(e.length <= 0))
                    for (; e.length > 0; ) {
                        e.pop().destroy(),
                        this.size--
                    }
            }
            ,
            t.prototype.clear = function() {
                for (var t in this.cache)
                    this.clear_atpath(t);
                this.cache = {},
                this.path2time = {},
                0 != this.size && cc.warn("size should be 0, but now is", this.size)
            }
            ,
            t.prototype.dump = function() {
                var t = "********ui_pool dump********";
                for (var e in this.cache)
                    t += "\n" + e + "\n",
                    this.cache[e].forEach(function(e) {
                        t += e.name + ","
                    });
                cc.log(t)
            }
            ,
            t
        }();
        o.ui_pool = n,
        cc._RF.pop()
    }
    , {}],
    upgrade: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "fdee1y6fhJFhLrwwcQkAZLi", "upgrade");
        var n = this && this.__extends || function() {
            var t = function(e, o) {
                return (t = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var o in e)
                        e.hasOwnProperty(o) && (t[o] = e[o])
                }
                )(e, o)
            };
            return function(e, o) {
                function n() {
                    this.constructor = e
                }
                t(e, o),
                e.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype,
                new n)
            }
        }()
          , i = this && this.__decorate || function(t, e, o, n) {
            var i, r = arguments.length, c = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                c = Reflect.decorate(t, e, o, n);
            else
                for (var a = t.length - 1; a >= 0; a--)
                    (i = t[a]) && (c = (r < 3 ? i(c) : r > 3 ? i(e, o, c) : i(e, o)) || c);
            return r > 3 && c && Object.defineProperty(e, o, c),
            c
        }
        ;
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = t("../../common/audio/AudioPlayer")
          , c = t("../../common/ui/pop_mgr")
          , a = t("../../common/localStorage/LocalStorage")
          , s = t("../../common/ui/pop_ui_base")
          , eD = t("../../common/event/EventDispatch")
          , l = cc._decorator
          , u = l.ccclass
          , p = l.property
          , _ = function(t) {
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                return e.qslabel = null,
                e.gslabel = null,
                e.shlabel = null,
                e.qsconstlabel = null,
                e.gsconstlabel = null,
                e.shconstlabel = null,
                e.text = "hello",
                e
            }
            return n(e, t),
            e.prototype.onLoad = function(){
                
                var videoBtn = cc.find("alert_view_back/noed_revive/New Node/New Button copy", this.node);

                //埋点 激励用完隐藏 定时
                this.TimerCheckAd = setInterval(function(){
                    window.h5api && window.h5api.canPlayAd(function(data){
                        videoBtn.active = data.canPlayAd;
                    }.bind(this));
                }, 500);
            },
            e.prototype.start = function() {
                this.updateval(),
                this.schedule(this.updateval, 1)
            },
            e.prototype.onDestroy = function(){
                clearInterval(this.TimerCheckAd);
            }
            ,
            e.prototype.updateval = function() {
                this.qslabel.string = a.LocalStorage.ins().getLocal(a.CONST_STORAGE_KEY.KEY_QIULV, 5),
                this.gslabel.string = a.LocalStorage.ins().getLocal(a.CONST_STORAGE_KEY.KEY_HSLV, 1),
                this.shlabel.string = a.LocalStorage.ins().getLocal(a.CONST_STORAGE_KEY.KEY_HLLV, 1),
                this.qsconstlabel.string = 10 * a.LocalStorage.ins().getLocal(a.CONST_STORAGE_KEY.KEY_QIULV, 5),
                this.gsconstlabel.string = 12 * a.LocalStorage.ins().getLocal(a.CONST_STORAGE_KEY.KEY_HSLV, 1) + 40,
                this.shconstlabel.string = 15 * a.LocalStorage.ins().getLocal(a.CONST_STORAGE_KEY.KEY_HLLV, 1) + 40
            }
            ,
            e.prototype.close = function() {
                r.AudioPlayer.ins().play_sound(r.AUDIO_CONFIG.Audio_Btn),
                c.pop_mgr.get_inst().hide(c.UI_CONFIG.upgrade)
            }
            ,
            e.prototype.adxingxing = function(event) {
                var t = a.LocalStorage.ins().getLocal(a.CONST_STORAGE_KEY.KEY_XING, 0);
                a.LocalStorage.ins().setLocal(a.CONST_STORAGE_KEY.KEY_XING, t + 20)
            }
            ,
            e.prototype.shengji = function(t, e) {
                r.AudioPlayer.ins().play_sound(r.AUDIO_CONFIG.Audio_Btn);
                var n, i;
                var o = a.LocalStorage.ins().getLocal(a.CONST_STORAGE_KEY.KEY_XING, 0);
                if ("1" == e && o >= (i = 10 * (n = a.LocalStorage.ins().getLocal(a.CONST_STORAGE_KEY.KEY_QIULV, 5)))){
                    (a.LocalStorage.ins().setLocal(a.CONST_STORAGE_KEY.KEY_QIULV, n + 1),
                    a.LocalStorage.ins().setLocal(a.CONST_STORAGE_KEY.KEY_XING, o - i))
                }
                else if (("2" == e) && (o >= (i = 12 * (n = a.LocalStorage.ins().getLocal(a.CONST_STORAGE_KEY.KEY_HSLV, 1)) + 40))) {
                     (a.LocalStorage.ins().setLocal(a.CONST_STORAGE_KEY.KEY_HSLV, n + 1),
                    a.LocalStorage.ins().setLocal(a.CONST_STORAGE_KEY.KEY_XING, o - i))
                } else if (("3" == e) && (o >= (i = 15 * (n = a.LocalStorage.ins().getLocal(a.CONST_STORAGE_KEY.KEY_HLLV, 1)) + 40))) {
                    (a.LocalStorage.ins().setLocal(a.CONST_STORAGE_KEY.KEY_HLLV, n + 1),
                    a.LocalStorage.ins().setLocal(a.CONST_STORAGE_KEY.KEY_XING, o - i))
                }else{
                    eD.EventDispatch.ins().fire(eD.Event_Name.SHOW_TIPS, "星星不足");
                }
            }
            ,
            i([p(cc.Label)], e.prototype, "qslabel", void 0),
            i([p(cc.Label)], e.prototype, "gslabel", void 0),
            i([p(cc.Label)], e.prototype, "shlabel", void 0),
            i([p(cc.Label)], e.prototype, "qsconstlabel", void 0),
            i([p(cc.Label)], e.prototype, "gsconstlabel", void 0),
            i([p(cc.Label)], e.prototype, "shconstlabel", void 0),
            i([p], e.prototype, "text", void 0),
            e = i([u], e)
        }(s.POP_UI_BASE);
        o.default = _,
        cc._RF.pop()
    }
    , {
        "../../common/audio/AudioPlayer": "AudioPlayer",
        "../../common/localStorage/LocalStorage": "LocalStorage",
        "../../common/ui/pop_mgr": "pop_mgr",
        "../../common/ui/pop_ui_base": "pop_ui_base",
        "../../common/event/EventDispatch":"EventDispatch"
    }],
    util: [function(t, e, o) {
        "use strict";
        cc._RF.push(e, "5e6fdXDEbdM/owIk62/j/0P", "util"),
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var n = t("../common/loader/loader_mgr")
          , i = []
          , r = function() {
            function t() {}
            return t.prototype.init = function(t, e) {
                void 0 === e && (e = null);
                for (var o = [], n = 2; n < arguments.length; n++)
                    o[n - 2] = arguments[n];
                this.cb = t,
                this.host = e,
                this.args = o
            }
            ,
            t.prototype.exec = function() {
                for (var t = [], e = 0; e < arguments.length; e++)
                    t[e] = arguments[e];
                this.cb.apply(this.host, this.args.concat(t))
            }
            ,
            t
        }();
        function c(t, e) {
            void 0 === e && (e = null);
            for (var o = [], n = 2; n < arguments.length; n++)
                o[n - 2] = arguments[n];
            var c = i.length < 0 ? i.pop() : new r;
            return c.init.apply(c, [t, e].concat(o)),
            c
        }
        o.handler = r,
        o.gen_handler = c,
        o.load_img = function(t, e) {
            n.loader_mgr.get_inst().loadAsset(e, c(function(e) {
                t.spriteFrame = e
            }), cc.SpriteFrame)
        }
        ,
        o.load_plist_img = function(t, e, o) {
            n.loader_mgr.get_inst().loadAsset(e, c(function(n) {
                var i = n.getSpriteFrame(o);
                i ? t.spriteFrame = i : cc.warn("path error (" + e + " " + o + ")")
            }), cc.SpriteAtlas)
        }
        ;
        var a = {};
        o.load_external_img = function(t, e, o) {
            a[e] ? t.spriteFrame = a[e] : (t.node.active = !1,
            n.loader_mgr.get_inst().loadExternalAsset(e, c(function(o) {
                a[e] = new cc.SpriteFrame(o),
                t.node && (t.node.active = !0,
                t.spriteFrame = a[e])
            }), o))
        }
        ,
        o.strfmt = function(t) {
            for (var e = [], o = 1; o < arguments.length; o++)
                e[o - 1] = arguments[o];
            return t.replace(/\{(\d+)\}/g, function(t, o) {
                return e[o] || t
            })
        }
        ,
        o.extend = function(t) {
            for (var e = [], o = 1; o < arguments.length; o++)
                e[o - 1] = arguments[o];
            for (var n = 0; n < e.length; n += 1) {
                var i = e[n];
                for (var r in i)
                    i.hasOwnProperty(r) && (t[r] = i[r])
            }
            return t
        }
        ,
        o.createBreathAction = function(t) {
            var e = cc.repeatForever(cc.sequence(cc.scaleTo(.6, 1.1), cc.scaleTo(.6, .9)));
            t.runAction(e)
        }
        ,
        o.destroyBreathAction = function(t) {
            t.stopAllActions()
        }
        ,
        cc._RF.pop()
    }
    , {
        "../common/loader/loader_mgr": "loader_mgr"
    }]
}, {}, ["LanguageData", "LocalizedLabel", "LocalizedSprite", "SpriteFrameSet", "polyglot.min", "AudioPlayer", "SingletonClass", "EventDispatch", "linklist", "loader_mgr", "LocalStorage", "pool_mgr", "ui_pool", "RandomUtil", "timer_mgr", "Tween", "pop_mgr", "pop_ui_base", "util", "GameConst", "Main", "CommonLabelScroll", "BallItem", "BrickItem", "GameModel", "GameView", "MenuView", "ResultView", "cell", "pifu", "rank", "upgrade"]);
