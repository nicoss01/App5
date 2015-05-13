(function () {
    "use strict";
    var App5 = function (params) {
        var selector = document.querySelectorAll(params);
        this.length = selector.length;
        this.version = '1.0.1';
        this.message = [];
        for (var a=0; a < this.length; a++) {
            this[a] = selector[a];
        }
        return this;        
    };
    var A5 = function (params) {
        return new App5(params);
    };
    A5.fn = App5.prototype = {
        "ready": function (callback) {
            this.debug.log("** App5 initialisation v "+this.version+"**");
            this.event.listen(document, "DOMContentLoaded", function () {
                this.debug.log("* Page loaded *");
                callback();
            });
        },
        "html": {
            "append": function (content) {
                this.debug.log("Add HTML element to '" + selector + "'");
                this.innerHTML += content;
                return this;
            },
            "css": function (prop, value) {
                this.style[prop] = value;
                return this;
            },
            "value" : function(selector,value){
                if(typeof value=="undefined"){
                    if(this.nodeName=="select"){
                        return this.options[selector.selectedIndex].value;
                    }else{
                        return this.value;
                    }
                }else{
                    if(this.nodeName=="select"){
                        return true;
                    }else{
                        return this.value = value;
                    }
                }
            }
        },
        "debug": {
            "log": function (msg) {
                var e = new Date();
                this.message.push(e.toGMTString() + " : " + msg);
                console.log(e.toGMTString() + " : " + msg);
            },
            "display": function () {
                var i;
                for (i in this.debug.message) {
                    console.table(this.debug.message[i]);
                }
            }
        },
        "test": {
            isOffline: false,
            isOnline: true,
            isMobile: function () {
                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            },
            isFullscreen: false
        },
        "event": {
            "listen": function (ev, cb) {
                this.debug.log("Event '" + ev + "' attached");
                if (this.addEventListener) {
                    this.addEventListener(ev, cb, false);
                } else if (el.attachEvent) {
                    this.attachEvent('on' + ev, cb);
                }
                return this;
            },
            "create": function (name) {
                document.createEvent(name);
            },
            "fire": function (name) {
                this.debug.log("Event trigger for '" + name + "'");
                if (document.createEvent) {
                    this.dispatchEvent(name);
                } else {
                    this.fireEvent("on" + name, event);
                }
                return this;
                //el.dispatchEvent(event);
            }
        },
        "history": {
            "add": function (title, uri) {
                window.history.pushState({
                    "title": title,
                    "uri": uri
                }, title, uri);
            },
            "replace": function (title, uri) {
                window.history.pushState({
                    "title": title,
                    "uri": uri
                }, title, uri);
            },
            "current": function () {
                return history.state;
            },
            "next": function () {
                window.history.forward();
            },
            "prev": function () {
                window.history.back();
            },
            "goto": function (index) {
                window.history.go(index);
            },
            "size": function (index) {
                return window.history.length;
            }
        },
        "cache": {
            "init": function () {
                this.debug.log("App cache init");
                this.event.add(window, "offline", function (e) {
                    this.debug.log("App is offline");
                    this.test.isOffline = true;
                    this.test.isOnline = false;
                }, false);
                this.event.add(window, "online", function (e) {
                    this.debug.log("App is online");
                    this.test.isOffline = true;
                    this.test.isOnline = false;
                }, false);
            }
        },
        "db": {
            "connexion": null,
            "open": function (name, description,version,size) {
                if (!size) {
                    size = 5;
                }
                this.debug.log("Open DB connexion db '" + name + "'");
                this.db.connexion = openDatabase(name, version, description, size * 1024 * 1024);
                return this;
            },
            "onError": function (tx, e) {
                this.debug.log("Error query - '" + e.message + "'");
            },
            "onSuccess": function (tx, r) {
                this.debug.log("Success query");
            },
            "query": function (sql, success) {
                this.debug.log("Execute db query '" + sql + "'");
                this.db.connexion.transaction(function (tx) {
                    tx.executeSql(sql, [], success, this.db.onError);
                });
                return this;
            },
            "autorefresh":function(){
                var autorefresh = A5("*[data-refresh]");
                if(autorefresh.length>0){
                    for(var z=0;z<autorefresh.length;z++){
                        var bloc = autorefresh[z];
                        setInterval(function(){
                            bloc.innerHTML="Refreshing...";
                            App5.db.query(bloc.getAttribute("data-sql"),function(tx,results){
                                var c = "<table class='table table-bordered table-striped'><thead>";
                                var row = results.rows.item(0);
                                c+="<tr>";
                                for(var d in row){
                                    c+="<th>"+d+"</th>";
                                }
                                c+="</tr></thead><tbody>";
                                for (var b=0; b<results.rows.length; b++) {
                                    var row = results.rows.item(b);
                                    c+="<tr>";
                                    for(var d in row){
                                        c+="<td>"+row[d]+"</td>";   
                                    }
                                    c+="</tr>";
                                }
                                c+="</tbody><table>";
                                bloc.innerHTML = c;
                            });
                        },bloc.getAttribute("data-refresh"));  
                    }
                }
                return this;
            },
            "exist": function (name){

            }
        },
        "storage": {
            "local": {
                "set": function (name, value) {
                    this.debug.log("Set localStorage var '" + name + "'");
                    localStorage.setItem(name, value);
                },
                "get": function (name) {
                    this.debug.log("Get localStorage var '" + name + "'");
                    return localStorage.getItem(name);
                }
            },
            "session": {
                "set": function (name, value) {
                    App5.debug.log("Set sessionStorage var '" + name + "'");
                    sessionStorage.setItem(name, value);
                },
                "get": function (name) {
                    this.debug.log("Get sessionStorage var '" + name + "'");
                    return sessionStorage.getItem(name);
                },
                "remove": function (name) {
                    this.debug.log("Remove sessionStorage var '" + name + "'");
                    sessionStorage.removeItem(name);
                }
            },
            "cookie": {
                "set": function (name, value) {
                    App5.debug.log("Set cookie '" + name + "'");
                    var date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    var expires = "; expires=" + date.toGMTString();
                    document.cookie = name + "=" + value + expires + "; path=/";
                },
                "get": function (name) {
                    App5.debug.log("Get cookie '" + name + "'");
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
                    App5.debug.log("Delete cookie '" + name + "'");
                    document.cookie = name + "=;-1; path=/";
                }
            }
        },
        "mobile": {
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
                    this.debug.log("Vibrate API does not supported");
                }
            },
            "battery": function () {
                if (this.mobile.test("battery")) {
                    var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;
                    return battery;
                } else {
                    this.debug.log("Battery API does not supported");
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
                    this.debug.log("Notification API does not supported");
                }
                return this;
            }
        },
        "geo": {
            "ID": null,
            "options": {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            },
            "start": function (callback) {
                this.debug.log("Start Geo position tracking.");
                this.Geo.ID = navigator.geolocation.watchPosition(function (position) {
                    this.debug.log("Geo position updated.");
                    callback(position.coords.latitude, position.coords.longitude);
                }, function () {
                    this.debug.log("Error, no position available.");
                }, this.Geo.options);
            },
            "stop": function () {
                App5.debug.log("Stop Geo position tracking.");
                navigator.geolocation.clearWatch(App5.Geo.ID);
            },
            "position": function (callback) {
                App5.debug.log("Get current Geo position.");
                navigator.geolocation.getCurrentPosition(function (position) {
                    cb(position.coords.latitude, position.coords.longitude);
                });
            }
        },
        "media": {
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

        },
        "ajax": function(url,params,callback){
            this.debug.log("Add HTML element to '" + selector + "'");    
            var xhr; 
            try {  xhr = new ActiveXObject('Msxml2.XMLHTTP');   }
            catch (e) {
                try {   xhr = new ActiveXObject('Microsoft.XMLHTTP'); }
                catch (e2) {
                   try {  xhr = new XMLHttpRequest();  }
                   catch (e3) {  xhr = false;   }
                 }
            }
            xhr.onreadystatechange  = function() { 
               if(xhr.readyState  == 4)
               {
                if(xhr.status  == 200) 
                    callback(xhr.responseText,xhr); 
                else
                    document.ajax.dyn="Error code " + xhr.status;
                }
            }; 
           xhr.open( params.method,url,  true); 
           xhr.send(params.data);     
        },
        "view": {
            "fullscreen": {
                "open": function () {
                    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                        if (document.documentElement.requestFullscreen) {
                            this.test.isFullscreen = true;
                            document.documentElement.requestFullscreen();
                        } else if (document.documentElement.msRequestFullscreen) {
                            this.test.isFullscreen = true;
                            document.documentElement.msRequestFullscreen();
                        } else if (document.documentElement.mozRequestFullScreen) {
                            this.test.isFullscreen = true;
                            document.documentElement.mozRequestFullScreen();
                        } else if (document.documentElement.webkitRequestFullscreen) {
                            this.test.isFullscreen = true;
                            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                        }
                    }
                },
                "close": function () {
                    if (document.exitFullscreen) {
                        this.test.isFullscreen = false;
                        document.exitFullscreen();
                    } else if (document.msExitFullscreen) {
                        this.test.isFullscreen = false;
                        document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        this.test.isFullscreen = false;
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        this.test.isFullscreen = false;
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
        },
        "utils": {
            "json": {
                "encode": function (str) {
                    return JSON.stringify(str);
                },
                "decode": function (str) {
                    return JSON.parse(str);
                }
            },
            "base64": {
                "encode": function (str) {
                    return window.btoa(unescape(encodeURIComponent(str)));
                },
                "decode": function (str) {
                    return decodeURIComponent(escape(window.atob(str)));
                }
            }
        },
        "file"  : {
            "choose" :function(){
                this.html.append(document.body,"<input type='file' name='app5-file' id='app5-file' style='position:absolute;top:-100px' />");
                this.event.fire("click",App5("#app5-file"));
            }
        },
        "export": {
            "pdf": {

            },
            "txt":{

            }
        }
    }
    
    if(!window.A5) {
        window.A5 = A5;
    }
})();