var version = "0.0.4"; // Updated on 02/10/2018

window.addEventListener('load', bannerAnimationStart);

function bannerAnimationStart(){
	//registercClickTagEvent();
    
    basictimeline = anime.timeline({autoplay:true});
	basictimeline
	.add({targets: '#bg1', scale:['1.1','1'], opacity:1, easing:'easeInOutQuad', duration: 600})
	.add({targets: '#bg2', scale:['1.1','1'], opacity:1, easing:'easeInOutQuad', duration: 600},'+=1500')
    .add({targets: '#cta1', opacity:0, duration: 500},'-=500')
	.add({targets: '#bg3', scale:['1.1','1'], opacity:1, easing:'easeInOutQuad', duration: 600},'+=1500')
	.add({targets: '#bg4', scale:['1.1','1'], opacity:1, easing:'easeInOutQuad', duration: 600},'+=1500')
	.add({targets: '#bg5', scale:['1.1','1'], opacity:1, easing:'easeInOutQuad', duration: 600},'+=1500')
	.add({targets: '#bg6', scale:['1.1','1'], opacity:1, easing:'easeInOutQuad', duration: 600},'+=1500')
	.add({targets: '#btn_replay', opacity:1, duration: 500, easing:'easeOutElastic'},'-=200')

    registerReplayEvent();
	
}


function restartTimeline(e) {
//	e.stopPropagation();
//	if(typeof tl === 'undefined') { return; }
//	tl.restart();
};


function registerReplayEvent() {
	/** Fix Replay Button too fast to disappear */
	var tlRestarted = false;
	var maintimelineEnded = function(tl) {
		tlRestarted = false;
		if(typeof basictimelineEnded === 'function') {
			basictimelineEnded(tl);
		}
	};
	var maintimelineRestart = function(e) {
		e.stopPropagation();
		if(tlRestarted) { return; }
		if(typeof restartTimeline === 'function') {
			setTimeout(restartTimeline,500);
		}
		tlRestarted = true;
	};
	/** Fix Replay Button too fast to disappear */
	if(typeof anime === 'function') {
		basictimeline.complete = maintimelineEnded;
	}
	document.getElementById('btn_replay').addEventListener('click', maintimelineRestart, false);
	document.getElementById('btn_replay').addEventListener('touchend', maintimelineRestart, false);
};

function restartTimeline(e) {
	if(typeof basictimeline === 'undefined') { return; }
	basictimeline.restart();
};

function basictimelineEnded() {};

/* ==== CSS Replay Event Function === */

var id = "page1", animClass = "start"; 
var timelineregistry = {};

function replayAnimationStart(event) {
		var el = document.getElementById(id);
		var className = timelineregistry[id];
		if(className == animClass) {
			 className && el.classList.remove(className);
			 timelineregistry = {};
		} else {
    	el.classList.add(animClass);
			timelineregistry[id] = animClass;
		}
};

/* ==== Redirect Element Function === */

function getElem(el){
	var _type = el.slice(0,1);
	var _name = el.slice(1, el.length);
	var _this;

	switch(_type){
		case '#':
			_this = document.getElementById(_name);	
		break;

		case '.':
			_this = document.getElementsByClassName(_name);
		break;

		default:
			_this = document.getElementsByTagName(el);
		break;
	}
	return _this;
};
