// Staging
InnityAd = function(id, host, level) {
	console.log("Ad " + id + " registered to host: " + host);
}
InnityAd.prototype.log = function(event, status) {
	this.trace(event + ": " + status);
}
InnityAd.prototype.trace = function(msg) {
	try {
		console.log(msg);
	}catch(e) {}
}
InnityVideo = function(eid, video, logger) {
	this.pauseTracker = function(){
		this.video.isTracking = false;
	};
	this.resumeTracker = function(){
		this.video.isTracking = true;
	};
	this.isTracking = true;
	this.video = video;
	this.video.eid = eid;
	this.video.view = false;
	this.video.started = false;
	this.video.playing = false;
	this.video.finished= false;
	this.video.played_00 = false;
	this.video.played_25 = false;
	this.video.played_50 = false;
	this.video.played_75 = false;
	this.video.logger = logger;
	this.video.mute = this.video.defaultMuted;
	this.video.addEventListener("play", this.videoHandler, false);
	this.video.addEventListener("pause", this.videoHandler, false);
	this.video.addEventListener("ended", this.videoHandler, false);
	this.video.addEventListener("timeupdate", this.onTimeupdate, false);
	this.video.addEventListener("volumechange", this.onVolumechange, false);
	this.video.addEventListener('fullscreenchange', this.onFullscreenChange, false);
	this.video.addEventListener('webkitfullscreenchange', this.onFullscreenChange, false);
	document.addEventListener('mozfullscreenchange', this.onFullscreenChange, false);
	document.addEventListener('MSFullscreenChange', this.onFullscreenChange, false);
	this.video.pm = function(msg, target) {
		try {
			parent.postMessage(msg, target);
		}catch(e) {}
	}
	try {
		console.log("Video obj:" + video.id + ", id:" + eid + ", registered to logger: " + logger);
	}catch(e) {}
	
}
InnityVideo.prototype.videoHandler = function(e) {
	if (this.isTracking === false) {
		return;
	}
	if(this.started && e.type == "pause" && this.currentTime < this.duration) {
		this.logger.log(this.eid, "p");
		this.logger.log(this.eid + "_Pause", "c");
		this.logger.log(this.eid + "_Audio", "p");
		this.pm("interaction|" + this.eid + ",p", "*");
		this.pm("interaction|" + this.eid + "_Pause,c", "*");
		this.pm("interaction|" + this.eid + "_Audio,p", "*");
		this.playing = false;
	}
	if(this.started && e.type == "play") {
		this.logger.log(this.eid, "r");
		this.logger.log(this.eid + "_Play", "c");
		this.pm("interaction|" + this.eid + ",r", "*");
		this.pm("interaction|" + this.eid + "_Play,c", "*");
		if(this.volume > 0 && !this.mute) {
			this.logger.log(this.eid + "_Audio", "s");
			this.pm("interaction|" + this.eid + "_Audio,s", "*");
		}
		this.playing = true;
	}
	if(e.type == "play") {
		if(this.finished) {
			this.logger.log(this.eid + "_Replay", "c");
			this.pm("interaction|" + this.eid + "_Replay,c", "*");
			this.finished = false;
		}
	}
	if(e.type == "ended") {
		this.logger.log(this.eid, "f");
		this.pm("interaction|" + this.eid + ",f", "*");
		if(this.volume > 0 && !this.mute) {
			this.logger.log(this.eid + "_Audio", "f");
			this.pm("interaction|" + this.eid + "_Audio,f", "*");
		}
		this.started = false;
		this.playing = false;
		this.finished= true;
		this.played_25 = false;
		this.played_50 = false;
		this.played_75 = false;
		this.pm(InnityHTMLAd.trackingId + "_videoEnded", "*");
		this.pm("interaction|" + this.eid + "_100,c", "*");
	}
}
InnityVideo.prototype.onTimeupdate = function() {
	if(this.isTracking === false) {
		return;
	}
	if(this.currentTime >= 0 && !this.played_00) {
		this.played_00 = true;
		this.pm("interaction|" + this.eid + "_00,c", "*");
	}
	if(this.currentTime > 0 && !this.started) {
		if(this.volume > 0 && !this.mute) {
			this.logger.log(this.eid + "_Audio", "s");
			this.pm("interaction|" + this.eid + "_Audio,s", "*");
		}
		this.started = true;
		this.playing = true;
		this.logger.log(this.eid, "s");
		this.pm("interaction|" + this.eid + ",s", "*");
	}
	if(this.currentTime > (this.duration * 0.25) && !this.played_25) {
		this.played_25 = true;
		this.logger.log(this.eid + "_25", "c");
		this.pm("interaction|" + this.eid + "_25,c", "*");
	}
	if(this.currentTime > (this.duration * 0.5) && !this.played_50) {
		this.played_50 = true;
		this.logger.log(this.eid + "_50", "c");
		this.pm("interaction|" + this.eid + "_50,c", "*");
	}
	if(this.currentTime > (this.duration * 0.75) && !this.played_75) {
		this.played_75 = true;
		this.logger.log(this.eid + "_75", "c");
		this.pm("interaction|" + this.eid + "_75,c", "*");
	}
	this.pm(InnityHTMLAd.id + "_current_time|" + Math.ceil(this.currentTime), "*");
	this.pm(InnityHTMLAd.id + "_" + InnityHTMLAd.cb + "_current_time|" + Math.ceil(this.currentTime), "*");
}
InnityVideo.prototype.onVolumechange = function() {
	if(this.muted) {
		this.mute = true;
		this.logger.log(this.eid + "_Mute", "c");
		this.pm("interaction|" + this.eid + "_Mute,c", "*");
		if(this.playing) {
			this.logger.log(this.eid + "_Audio", "p");
			this.pm("interaction|" + this.eid + "_Audio,p", "*");
		}
	}
	if(this.mute && !this.muted && this.volume > 0) {
		this.mute = false;
		this.logger.log(this.eid + "_Unmute", "c");
		this.pm("interaction|" + this.eid + "_Unmute,c", "*");
		if(this.playing) {
			this.logger.log(this.eid + "_Audio", "s");
			this.pm("interaction|" + this.eid + "_Audio,s", "*");
		}
	}
}
InnityVideo.prototype.onFullscreenChange = function() {
	InnityHTMLAd.pm(InnityHTMLAd.id + "_fullscreenChange", "*");
	InnityHTMLAd.pm(InnityHTMLAd.id + "_" + InnityHTMLAd.cb + "_fullscreenChange", "*");
}

var InnityHTMLAd = {
  	"id" : "test",
	"host" : "http://",
	"urls" : [],
	"clickTrackings" : [],
	"vids" : [],
	"InnityVideos" : [],
	"dco" : "",
	get cb() {
		if(typeof this.getParam === 'function') {
		return this.getParam('cb');
		}
		if(typeof innityAd_getURLParameterData === 'function') {
		return innityAd_getURLParameterData('cb');
		}
		return '';
	},
	"init" : function(initOnLoad) {
    this.initOnLoad = initOnLoad;
		if(this.initOnLoad) {
			this.InnityAd = new InnityAd(this.id, this.host, {
				"pid" : "ad-staging",
				"autostart" : this.autostart,
				"intervalTracking" : InnityHTMLAd.intervalTracking
			});
		}
		var self = this;
		self.isReady = false;
		self.isLoaded = false;
		function _setAdReady() {
			if(!self.isReady) {
				self.setAdReady();
				self.isReady = true;
			}
		}
		function _setAdLoaded() {
			if(!self.isLoaded) {
				self.setAdLoaded();
				self.resizeHandler();
				self.isLoaded = true;
			}
		}
		try {
			window.addEventListener("DOMContentLoaded", _setAdReady, false);
			window.addEventListener("load", _setAdReady, false);
			window.addEventListener("load", _setAdLoaded, false);
		}catch(e) {}
		window.addEventListener("message", this.messageHandler, false);
		window.addEventListener("resize", this.resizeHandler, false);
	},
	"track" : function(event) {
		this.InnityAd.log(event, "c");
		this.pm("interaction|" + event + ",c", "*");
		this.pm(this.id + "_" + this.cb + "_track", "*");
	},
	"startTimer" : function(event) {
		this.InnityAd.log(event, "s");
		this.pm("interaction|" + event + ",s", "*");
		this.pm(this.id + "_" + this.cb + "_startTimer", "*");
	},
	"stopTimer" : function(event) {
		this.InnityAd.log(event, "p");
		this.pm("interaction|" + event + ",p", "*");
		this.pm(this.id + "_" + this.cb + "_stopTimer", "*");
	},
	"resumeTimer" : function(event) {
		this.InnityAd.log(event, "r");
		this.pm("interaction|" + event + ",r", "*");
		this.pm(this.id + "_" + this.cb + "_resumeTimer", "*");
	},
	"attachVideo" : function(obj) {
		this.vids.push(obj);
		this.InnityVideo = new InnityVideo("_Video" + this.vids.length, obj, this.InnityAd);
		this.InnityVideos.push(this.InnityVideo);
	},
	"endVideo" : function(event) {
		this.InnityAd.log(event, "f");
		this.pm("interaction|" + event + ",f", "*");
		this.pm(this.id + "_videoEnded", "*");
		this.pm(this.id + "_" + this.cb + "_videoEnded", "*");
	},
	"impact" : function() {
		this.pm(this.id + "_impact", "*");
		this.pm(this.id + "_" + this.cb + "_impact", "*");
	},
	"engage" : function() {
		this.pm(this.id + "_" + this.cb + "_engage", "*");
	},
	"engaged" : function() {
		this.pm(this.id + "_" + this.cb + "_engaged", "*");
	},
	"expand" : function() {
		this.pm(this.id + "_expand", "*");
		this.pm(this.id + "_" + this.cb + "_expand", "*");
	},
	"expanded" : function() {
		if(!this.initOnLoad) {
			this.InnityAd = new InnityAd(this.trackingId, this.host, {
				"pid" : auth_322386,
				"autostart" : true,
				"intervalTracking" : InnityHTMLAd.intervalTracking
			});
		}
		this.pm(this.id + "_expanded", "*");
		this.pm(this.id + "_" + this.cb + "_expanded", "*");
		if(InnityHTMLAd.adFormat == 57){ //Mobile Pull Up
			InnityHTMLAd.moatApi.dispatch(
				InnityHTMLAd.isTeaser,
				false,
				InnityHTMLAd.moatApi.fullTrackableElement
			);
		}
	},
	"subExpand" : function() {
		this.pm(this.id + "_subExpand", "*");
		this.pm(this.id + "_" + this.cb + "_subExpand", "*");
	},
	"subExpanded" : function() {
		this.pm(this.id + "_subExpanded", "*");
		this.pm(this.id + "_" + this.cb + "_subExpanded", "*");
	},
	"subShrink" : function() {
		this.pm(this.id + "_subShrink", "*");
		this.pm(this.id + "_" + this.cb + "_subShrink", "*");
	},
	"subShrinked" : function() {
		this.pm(this.id + "_subShrinked", "*");
		this.pm(this.id + "_" + this.cb + "_subShrinked", "*");
	},
	"shrink" : function() {
		this.pm(this.id + "_shrink", "*");
		this.pm(this.id + "_" + this.cb + "_shrink", "*");
	},
	"shrinked" : function() {
		this.pm(this.id + "_shrinked", "*");
		this.pm(this.id + "_" + this.cb + "_shrinked", "*");
	},
	"clearRM" : function() {
	},
	"close" : function() {
		this.pm(this.id + "_close", "*");
		this.pm(this.id + "_" + this.cb + "_close", "*");
	},
	"closed" : function() {
		this.pm(this.id + "_closed", "*");
		this.pm(this.id + "_" + this.cb + "_closed", "*");
	},
	"pauseTracker" : function() {
		for (let i = 0; i < this.InnityVideos.length; i++) {
			this.InnityVideos[i].pauseTracker();
		}
	},
	"resumeTracker" : function() {
		for (let i = 0; i < this.InnityVideos.length; i++) {
			this.InnityVideos[i].resumeTracker();
		}
	},
	"click" : function(options) {
        // Customize for staging.
        if (typeof(DesignerClickTag[options.clickTAG+this.creative]) !== 'undefined') {
            this.trace(options);
            window.open(DesignerClickTag[options.clickTAG+this.creative]);
        }else if(typeof options.url == "string") {
            this.trace(options);
            window.open(options.url);
		    }
        else {
            console.log("ClickTAG Not Found: " + options.clickTAG + this.creative);
        }

//		if(typeof options == "object") {
//			if(typeof options.clickTAG != "undefined" && typeof this.urls[options.clickTAG] != "undefined") {
//				var lnk = this.dco != "" ? this.urls[options.clickTAG] + "&type=" + this.dco : this.urls[options.clickTAG];
//			} else if(typeof options.url == "string") {
//				var lnk = options.url;
//			}
//		}else if(typeof options == "string") {
//			if(typeof this.urls[options] != "undefined") {
//				var lnk = this.dco != "" ? this.urls[options] + "&type=" + this.dco : this.urls[options];
//			}
//		}
//		if(typeof lnk != "undefined" && lnk != "") {
//			window.open(lnk);
//		} else {
//			this.trace(options);
//		}
	},
	"resize" : function(width, height){
		InnityHTMLAd.pm(InnityHTMLAd.id + "_resized["+ width + "x" + height +"]", "*");
		InnityHTMLAd.pm(InnityHTMLAd.id + "_" + InnityHTMLAd.cb + "_resized["+ width + "x" + height +"]", "*");
	},
	"setAdReady" : function() {
		this.pm(this.id + "_adReady", "*");
		this.pm(this.id + "_" + this.cb + "_adReady", "*");
	},
	"setAdLoaded" : function() {
		this.pm(this.id + "_adLoaded", "*");
		this.pm(this.id + "_" + this.cb + "_adLoaded", "*");
	},
	"setDCO" : function(dco) {
		this.dco = dco;
		var data = this.host + "/dco/?c=" + this.id.split("c")[1] + "&d=" + dco + "&cb=" + this.cb;
		this.dispatch(data);
	},
	"getParam" : function(param) {
		return decodeURIComponent((new RegExp("[?|&]" + param + "=" + "([^&;]+?)(&|#|;|$)").exec(self.location.href)||[,""])[1].replace(/\+/g, "%20"))||"";
	},
	"dispatch" : function(data) {
		if(data instanceof Array){
			for (var i = 0; i < data.length; i++) {
				(new Image()).src = data[i];
			}
		}else{
			(new Image()).src = data;
		}
	},
	"trace" : function(msg) {
		try {
			console.log(msg);
		}catch(e) {}
	},
	"pm" : function(msg, target) {
		try {
			parent.postMessage(msg, target);
		}catch(e) {}
	},
	"messageHandler" : function(event) {
		if(event.data == InnityHTMLAd.id+"_expandAd") {
			if(!InnityHTMLAd.initOnLoad) {
				InnityHTMLAd.InnityAd = new InnityAd(InnityHTMLAd.trackingId, InnityHTMLAd.host, {
					"pid" : "",
					"autostart" : true,
					"intervalTracking" : InnityHTMLAd.intervalTracking
				});
			}
			if(!InnityHTMLAd.autostart) {
				InnityHTMLAd.startTimer("_ad_display");
			}
		}else if(event.data == InnityHTMLAd.id+"_closeAd") {
			// Clear ad body to mute all audio
			document.getElementsByTagName("body")[0].innerHTML = "";
			setTimeout(function(){
				// Clear Rich Media queue
				InnityHTMLAd.clearRM();
			}, 50);
		}
	},
	"resizeHandler" : function(event) {
		height = Math.max(document.body.scrollHeight,document.body.offsetHeight);
		width = Math.max(document.body.scrollWidth,document.body.offsetWidth);
		InnityHTMLAd.pm(InnityHTMLAd.id + "_resized["+ width + "x" + height +"]", "*");
		InnityHTMLAd.pm(InnityHTMLAd.id + "_" + InnityHTMLAd.cb + "_resized["+ width + "x" + height +"]", "*");
	}
}

// For Staging Purposes Only

function innityAd_getURLParameterData(name) {
	if(location.href.indexOf("?")>1){
		var elem = {};
		var params = location.href.split("?")[1].split("&");

		for ( i in params)
			elem[params[i].split("=")[0]] = params[i].split("=")[1];
			
		if(name in elem) 
			return elem[name];
	}
};

InnityHTMLAd.id = (typeof innityAd_getURLParameterData("adid") == "undefined") ? "ad-staging" : innityAd_getURLParameterData("adid");
if (typeof innityAd_getURLParameterData("init") !== "undefined") {InnityHTMLAd.init(innityAd_getURLParameterData("init"));}else{InnityHTMLAd.init(true);}

InnityHTMLAd.socialhub = false;
InnityHTMLAd.creative = innityAd_getURLParameterData("creative") || '';

DesignerClickTag = {
	clickTAG: "https://www.innity.com/ad-gallery",
    clickTAG1: "https://www.innity.com/ad-gallery",
    clickTAG2: "https://www.innity.com/ad-gallery",
    clickTAG3: "https://www.innity.com/ad-gallery",
    clickTAG4: "https://www.innity.com/ad-gallery",
    clickTAG5: "https://www.innity.com/ad-gallery",
    clickTAG6: "https://www.innity.com/ad-gallery",
};

window.onload = function(e)
{
	if(document.getElementById('banner-close'))
	{
		try {
			document.getElementById('banner-close').style.display = 'none';
		} catch(e) {}
	}
}
