var App5 = {
	init			: function(config){
		App5.debug.log("** App5 initialisation **");
		App5.HTML.append("body","<div id='App5-Page-Loader'>&nbsp;</div>");
		App5.event.add(document,"DOMContentLoaded",function(){
			App5.debug.log("* Page loaded *");
			App5.HTML.css("#App5-Page-Loader","display","none");
			App5.debug.display();
		});
	},
	debug 			: {
		message		: [],
		log			: function(msg){
			var e = new Date();
			App5.debug.message.push(e.toGMTString()+" : "+msg);
		},
		display		: function(){
			for(i in App5.debug.message){
				console.table(App5.debug.message[i]);
			}
		}
	},
	test			: {
		isOffline	: false,
		isOnline	: true,
		isMobile 	: function(){
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		},
		isFullscreen: false,	
	},
	event			: {
		add			:  function(el,ev,cb){
			App5.debug.log("Event '"+ev+"' attached");
			if(el.addEventListener) {
				el.addEventListener(ev, cb, false)
			} else if(el.attachEvent) {
				el.attachEvent('on'+ev, cb)
			}
		},
		remove		: function(name){
			
		}
	},
	history			: {
		add			: function(title,uri){
			window.history.pushState({"title":title,"uri":uri},title, uri);			
		},
		replace		: function(title,uri){
			window.history.pushState({"title":title,"uri":uri},title, uri);			
		},
		current		: function(){
			return history.state;
		},
		next		: function(){
			window.history.forward();			
		},
		prev		: function(){
			window.history.back();			
		},
		goto		: function(index){
			window.history.go(index);
		},
		size		: function(index){
			return window.history.length;
		},
	},
	cache			: {
		init		: function(){
			App5.debug.log("App cache init");
			App5.event.add(window,"offline", function(e) {
				App5.debug.log("App is offline");
				App5.test.isOffline 	= true;
				App5.test.isOnline	= false;
			}, false);
			App5.event.add(window,"online", function(e) {
				App5.debug.log("App is online");
				App5.test.isOffline 	= true;
				App5.test.isOnline	= false;
			}, false);	
		}
	},
	db				: {
		connexion	: null,
		version 	: "1.0",
		open		: function(name,description){
			App5.debug.log("Open DB connexion table '"+name+"'");
 			App5.db.connexion = openDatabase(name, "1", description, 5 * 1024 * 1024);	
		},
		onError 	: function(tx, e) {
			App5.debug.log("Error connexion - '"+e.message+"'");
		},
		onSuccess 	: function(tx, r) {
			App5.debug.log("Success connexion");
		},
		query 		: function(sql,success) {
			App5.debug.log("Execute db query '"+sql+"'");
			App5.db.connexion.transaction(function(tx) {
				tx.executeSql(sql, [], success,
				App5.db.onError);
			});
		}
	},
	storage			: {
		local		: {
			set			: function(name,value){
				App5.debug.log("Set localStorage var '"+name+"'");
				localStorage[name] = value;
			},
			get			: function(name){
				App5.debug.log("Get localStorage var '"+name+"'");
				return localStorage[name];
			}
		},
		cookie		: {
			set			: function(name,value){
				App5.debug.log("Set cookie '"+name+"'");
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
				document.cookie = name+"="+value+expires+"; path=/";
			},
			get			: function(name){
				App5.debug.log("Get cookie '"+name+"'");
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
			delete		: function(name){
				App5.debug.log("Delete cookie '"+name+"'");
				document.cookie = name+"=;-1; path=/";
			}
		}
	},
	mobile		: {
		test 	: function(api){
			var t = window.navigator[api] ||  window.navigator["webkit"+phone.ucfirst(api)] || window. navigator["moz"+phone.ucfirst(api)] ||  window.navigator["ms"+phone.ucfirst(api)];
			return typeof t=="undefined"?false:true;
		},
		ucfirst : function(s){
			return s.replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1){ return $1.toUpperCase(); })	
		},
		orientation : function(){
			var o = null;
			switch(window.orientation){  
			  case -90:
			  case 90:
				o='landscape';
				break; 
			  default:
				o='portrait';
				break; 
			}	
			return o;
		},
		sms 	: function(number,content){
			window.open("sms:"+number+"?body="+content);
			return this	
		},
		call 	: function(number){
			window.open("tel:"+number);
			return this	
		},
		vibrate : function(params){
			if(App5.mobile.test("vibrate")){
				var vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate ||  window.navigator.msVibrate;	
				if(params){
					vibrate.vibrate(params);	
				}else{
					vibrate.vibrate(1000);	
				}
			}else{
				App5.debug.log("Vibrate API does not supported");	
			}
		},
		battery : function(){
			if(App5.mobile.test("battery")){
				var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;	
				return battery;
			}else{
				App5.debug.log("Battery API does not supported");	
			}
		},
		telephony : function(){
			return App5.mobile.test("telephony")?window.navigator.telephony:null; 	
		},
		connection : function(){
			return App5.mobile.test("connection")?window.navigator.connection:null; 	
		},
		notification : function(title,msg){
			if(App5.mobile.test("Notification")){
				var notification = new Notification(title, {
					body: msg
				});
			}else{
				App5.debug.log("Notification API does not supported");	
			}
			return this;
		}	
	},
	Geo		: {
		ID		: null,
		options : {
			enableHighAccuracy: true, 
  			maximumAge        : 30000, 
  			timeout           : 27000
		},
		start	: function(cb){
			App5.debug.log("Start Geo position tracking.");	
			App5.Geo.ID = navigator.geolocation.watchPosition(function(position) {
				App5.debug.log("Geo position updated.");
				cb(position.coords.latitude, position.coords.longitude);
			},function(){
				App5.debug.log("Error, no position available.");	
			},App5.Geo.options);
		},
		stop	: function(){
			App5.debug.log("Stop Geo position tracking.");	
			navigator.geolocation.clearWatch(App5.Geo.ID);	
		},
		position: function(cb){
			App5.debug.log("Get current Geo position.");	
			navigator.geolocation.getCurrentPosition(function(position) {
			  cb(position.coords.latitude, position.coords.longitude);
			});	
		}
	},
	media	: {
		video	:	{
			play	: function(selector){
				App5.HTML.one(selector).play();	
			},
			pause	: function(selector){
				App5.HTML.one(selector).pause();	
			},
			duration: function(selector){
				return App5.HTML.one(selector).seekable.end(); 
			},
			current	: function(selector){
				return App5.HTML.one(selector).currentTime; 
			},
			played	: function(selector){
				return App5.HTML.one(selector).played.end(); 
			},
			volume	: function(selector,volume){
				App5.HTML.one(selector).volume = volume;	
			}
		},
		audio	:	{
			play	: function(selector){
				App5.HTML.one(selector).play();	
			},
			pause	: function(selector){
				App5.HTML.one(selector).pause();	
			},
			duration: function(selector){
				return App5.HTML.one(selector).seekable.end(); 
			},
			current	: function(selector){
				return App5.HTML.one(selector).currentTime; 
			},
			played	: function(selector){
				return App5.HTML.one(selector).played.end(); 
			},
			volume	: function(selector,volume){
				App5.HTML.one(selector).volume = volume;	
			}
		},
		
	},
	HTML	: {
		select : function(selector){
			return document.querySelectorAll(selector);
		},
		one	 	: function(selector){
			return document.querySelector(selector);
		},
		append 	: function(selector,content){
			App5.debug.log("Add HTML element to '"+selector+"'");
			App5.HTML.one(selector).innerHTML += content;
			return this;
		},
		css		: function(selector,prop,value){
			App5.HTML.one(selector).style[prop] = value;
			return this;	
		}
	},
	view	: {
		fullscreen : {
			open	: function(){
				if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
					if (document.documentElement.requestFullscreen) {
						App5.test.isFullscreen = true;
						document.documentElement.requestFullscreen();
					} else if (document.documentElement.msRequestFullscreen) {
						App5.test.isFullscreen = true;
						document.documentElement.msRequestFullscreen();
					} else if (document.documentElement.mozRequestFullScreen) {
						App5.test.isFullscreen = true;
						document.documentElement.mozRequestFullScreen();
					} else if (document.documentElement.webkitRequestFullscreen) {
						App5.test.isFullscreen = true;
						document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
					}
				} 	
			},
			close	: function(){
				if (document.exitFullscreen) {
					App5.test.isFullscreen = false;
					document.exitFullscreen();
				} else if (document.msExitFullscreen) {
					App5.test.isFullscreen = false;
					document.msExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					App5.test.isFullscreen = false;
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					App5.test.isFullscreen = false;
					document.webkitExitFullscreen();
				}				
			}
			
		}
	}
};
App5.init(null);
