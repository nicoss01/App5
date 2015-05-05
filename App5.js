var App = {
	init			: function(config){
		
	},
	debug 			: {
		message		: [],
		log			: function(msg){
			var e = new Date();
			App.debug.message.push(e.toGMTString()+" : "+msg);
		},
		display		: function(){
			console.log(App.debug.message);	
		}
	},
	test			: {
		isOffline	: false,
		isOnline	: true,
		isMobile 	: function(){
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		}	
	},
	cache			: {
		init		: function(){
			App.debug.log("App cache init");
			window.addEventListener("offline", function(e) {
				App.debug.log("App is offline");
				App.test.isOffline 	= true;
				App.test.isOnline	= false;
			}, false);
			window.addEventListener("online", function(e) {
				App.debug.log("App is online");
				App.test.isOffline 	= true;
				App.test.isOnline	= false;
			}, false);	
		}
	},
	db				: {
		connexion	: null,
		version 	: "1.0",
		open		: function(name,description){
			App.debug.log("Open DB connexion table '"+name+"'");
 			App.db.connexion = openDatabase(name, "1", description, 5 * 1024 * 1024);	
		},
		onError 	: function(tx, e) {
			App.debug.log("Error connexion - '"+e.message+"'");
  			alert("There has been an error: " + e.message);
		},
		onSuccess 	: function(tx, r) {
			App.debug.log("Success connexion");
		},
		query 		: function(sql,success) {
			App.debug.log("Execute db query '"+sql+"'");
			App.db.connexion.transaction(function(tx) {
				tx.executeSql(sql, [], success,
				App.db.onError);
			});
		}
	},
	storage			: {
		local		: {
			set			: function(name,value){
				App.debug.log("Set localStorage var '"+name+"'");
				localStorage[name] = value;
			},
			get			: function(name){
				App.debug.log("Get localStorage var '"+name+"'");
				return localStorage[name];
			}
		},
		cookie		: {
			set			: function(name,value){
				App.debug.log("Set cookie '"+name+"'");
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
				document.cookie = name+"="+value+expires+"; path=/";
			},
			get			: function(name){
				App.debug.log("Get cookie '"+name+"'");
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
				App.debug.log("Delete cookie '"+name+"'");
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
		event 	: function(el,ev,cb){
			if(el.addEventListener) { // DOM standard
				el.addEventListener(ev, cb, false)
			} else if(el.attachEvent) { // IE
				el.attachEvent('on'+ev, cb)
			}
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
			if(App.mobile.test("vibrate")){
				var vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate ||  window.navigator.msVibrate;	
				if(params){
					vibrate.vibrate(params);	
				}else{
					vibrate.vibrate(1000);	
				}
			}else{
				console.log("Vibrate API does not supported");	
			}
		},
		battery : function(){
			if(App.mobile.test("battery")){
				var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;	
				return battery;
			}else{
				App.debug.log("Battery API does not supported");	
			}
		},
		telephony : function(){
			return App.mobile.test("telephony")?window.navigator.telephony:null; 	
		},
		connection : function(){
			return App.mobile.test("connection")?window.navigator.connection:null; 	
		},
		notification : function(title,msg){
			if(phone.test("Notification")){
				var notification = new Notification(title, {
					body: msg
				});
			}else{
				App.debug.log("Notification API does not supported");	
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
			App.debug.log("Start Geo position tracking.");	
			App.Geo.ID = navigator.geolocation.watchPosition(function(position) {
				App.debug.log("Geo position updated.");
				cb(position.coords.latitude, position.coords.longitude);
			},function(){
				App.debug.log("Error, no position available.");	
			},App.Geo.options);
		},
		stop	: function(){
			App.debug.log("Stop Geo position tracking.");	
			navigator.geolocation.clearWatch(App.Geo.ID);	
		},
		position: function(cb){
			App.debug.log("Get current Geo position.");	
			navigator.geolocation.getCurrentPosition(function(position) {
			  cb(position.coords.latitude, position.coords.longitude);
			});	
		}
	},
	media	: {
		
	},
	HTML	: {
		select : function(selector){
			return document.querySelectorAll(selector);
		}
	}
};
