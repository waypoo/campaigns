Track = {
	click1: function(){
		triggerClickTag("clickTAG");
	}
}

//------------------------ DEVELOPER SIDE -------------------------//

var timerTrackingID = null;
function triggerClickTag(clickTag) {
	InnityHTMLAd.click({clickTAG: clickTag});
};

function triggerTrack(track) {
	InnityHTMLAd.track(track);
}

function triggerTimerStart(id) {
	if(timerTrackingID === id) {
		return;
	}
	triggerTimerStop();
	InnityHTMLAd.startTimer(id);
	timerTrackingID = id;
};

function triggerTimerStop() {
	if(timerTrackingID !== null) {
		InnityHTMLAd.stopTimer(timerTrackingID);
	}
};

function trackingReset() {
	triggerTimerStop();
	timerTrackingID = null;
};