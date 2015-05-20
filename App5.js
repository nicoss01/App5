(function($) {
    $.fn.test = {
        isOffline: false,
        isOnline: true,
        isMobile: function () {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        isFullscreen: false
    };
    $.fn.db = {
        "open": function (name, description,version,size) {
            if (!size) {
                size = 5;
            }
            var cnx = openDatabase(name, version, description, size * 1024 * 1024);
            return cnx;
        },
        "onError": function (tx, e) {
            console.log("Error query - '" + e.message + "'");
        },
        "onSuccess": function (tx, r) {
            console.log("Success query");
        },
        "query": function (sql, cnx,success) {
            console.log("Execute db query '" + sql + "'");
            cnx.transaction(function (tx) {
                tx.executeSql(sql, [], success, $.fn.db.onError);
            });
            return this;
        }
    };
    $.fn.media = {
        "video": {
            "play": function (selector) {
                this.play();
            },
            "pause": function (selector) {
               this.pause();
            },
            "duration": function (selector) {
                return this.seekable.end();
            },
            "current": function (selector) {
                return this.currentTime;
            },
            "played": function (selector) {
                return this.played.end();
            },
            "volume": function (selector, volume) {
                this.volume = volume;
            }
        },
        "audio": {
            "play": function (selector) {
                this.play();
            },
            "pause": function (selector) {
                this.pause();
            },
            "duration": function (selector) {
                return this.seekable.end();
            },
            "current": function (selector) {
                return this.currentTime;
            },
            "played": function (selector) {
                return this.played.end();
            },
            "volume": function (selector, volume) {
                this.volume = volume;
            }
        },

    };
    $.fn.geo = {
        "ID": null,
        "options": {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
        },
        "start": function (callback) {
            console.log("Start Geo position tracking.");
            $.fn.Geo.ID = navigator.geolocation.watchPosition(function (position) {
                console.log("Geo position updated.");
                callback(position.coords.latitude, position.coords.longitude);
            }, function () {
                console.log("Error, no position available.");
            },  $.fn.Geo.options);
        },
        "stop": function () {
            console.log("Stop Geo position tracking.");
            navigator.geolocation.clearWatch($.fn.Geo.ID);
        },
        "position": function (callback) {
            console.log("Get current Geo position.");
            navigator.geolocation.getCurrentPosition(function (position) {
                callback(position.coords.latitude, position.coords.longitude);
            });
        }
    };
    $.fn.history = {
        "add": function (title, uri) {
            window.history.pushState({
                "title": title,
                "uri": uri
            }, title, uri);
            return this;
        },
        "replace": function (title, uri) {
            window.history.pushState({
                "title": title,
                "uri": uri
            }, title, uri);
            return this;
        },
        "current": function () {
            return history.state;
        },
        "next": function () {
            window.history.forward();
            return this;
        },
        "prev": function () {
            window.history.back();
            return this;
        },
        "goto": function (index) {
            window.history.go(index);
        },
        "size": function (index) {
            return window.history.length;
        }
    };
    $.fn.view = {
        "fullscreen": {
            "open": function () {
                if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                    if (document.documentElement.requestFullscreen) {
                        $.fn.test.isFullscreen = true;
                        document.documentElement.requestFullscreen();
                    } else if (document.documentElement.msRequestFullscreen) {
                        $.fn.test.isFullscreen = true;
                        document.documentElement.msRequestFullscreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                        $.fn.test.isFullscreen = true;
                        document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullscreen) {
                        $.fn.test.isFullscreen = true;
                        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                }
            },
            "close": function () {
                if (document.exitFullscreen) {
                    $.fn.test.isFullscreen = false;
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    $.fn.test.isFullscreen = false;
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    $.fn.test.isFullscreen = false;
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    $.fn.test.isFullscreen = false;
                    document.webkitExitFullscreen();
                }
            }

        },
        "print": function () {
            var tmp = this.innerHTML;
            var wd = window.open();
            wd.document.write("<html><head><title>" + document.title + "</head><body>" + tmp + "</body></html>");
            wd.print();
            wd.close();
        }
    };
    $.fn.storage = {
        "local": {
            "set": function (name, value) {
                console.log("Set localStorage var '" + name + "'");
                localStorage.setItem(name, value);
            },
            "get": function (name) {
                console.log("Get localStorage var '" + name + "'");
                return localStorage.getItem(name);
            }
        },
        "session": {
            "set": function (name, value) {
                console.log("Set sessionStorage var '" + name + "'");
                sessionStorage.setItem(name, value);
            },
            "get": function (name) {
                console.log("Get sessionStorage var '" + name + "'");
                return sessionStorage.getItem(name);
            },
            "remove": function (name) {
                console.log("Remove sessionStorage var '" + name + "'");
                sessionStorage.removeItem(name);
            }
        },
        "cookie": {
            "set": function (name, value) {
                console.log("Set cookie '" + name + "'");
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
                document.cookie = name + "=" + value + expires + "; path=/";
            },
            "get": function (name) {
                console.log("Get cookie '" + name + "'");
                var c_name, c_end;
                if (document.cookie.length > 0) {
                    var c_start = document.cookie.indexOf(c_name + "=");
                    if (c_start != -1) {
                        var c_start = c_start + c_name.length + 1;
                        var c_end = document.cookie.indexOf(";", c_start);
                        if (c_end == -1) {
                            var c_end = document.cookie.length;
                        }
                        return unescape(document.cookie.substring(c_start, c_end));
                    }
                }
                return "";
            },
            "delete": function (name) {
                console.log("Delete cookie '" + name + "'");
                document.cookie = name + "=;-1; path=/";
            }
        }
    },
    $.fn.mobile = {
        "test": function (api) {
            var t = window.navigator[api] || window.navigator["webkit" + phone.ucfirst(api)] || window.navigator["moz" + phone.ucfirst(api)] || window.navigator["ms" + phone.ucfirst(api)];
            return typeof t == "undefined" ? false : true;
        },
        "ucfirst": function (s) {
            return s.replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
                return $1.toUpperCase();
            });
        },
        "orientation": function () {
            var o = null;
            switch (window.orientation) {
            case -90:
            case 90:
                o = 'landscape';
                break;
            default:
                o = 'portrait';
                break;
            }
            return o;
        },
        "sms": function (number, content) {
            window.open("sms:" + number + "?body=" + content);
            return this;
        },
        "call": function (number) {
            window.open("tel:" + number);
            return this;
        },
        "vibrate": function (params) {
            if (this.mobile.test("vibrate")) {
                var vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || window.navigator.msVibrate;
                if (params) {
                    vibrate.vibrate(params);
                } else {
                    vibrate.vibrate(1000);
                }
            } else {
                console.log("Vibrate API does not supported");
            }
        },
        "battery": function () {
            if (this.mobile.test("battery")) {
                var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;
                return battery;
            } else {
                console.log("Battery API does not supported");
            }
        },
        "telephony": function () {
            return this.mobile.test("telephony") ? window.navigator.telephony : null;
        },
        "connection": function () {
            return this.mobile.test("connection") ? window.navigator.connection : null;
        },
        "notification": function (title, msg) {
            if (this.mobile.test("Notification")) {
                var notification = new Notification(title, {
                    body: msg
                });
            } else {
                console.log("Notification API does not supported");
            }
            return this;
        }
    };
})(jQuery);