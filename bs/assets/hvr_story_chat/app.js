let innityAppsCountry = 'MY';
let innityAppsHvrStory = null;
let isVideoInit = false;
let multipleVideo = {};

let bsInvitation, bot, chatStarted = false;

function bannerAnimationStart() {
  bsInvitation = document.getElementById('innity-apps-invitation-container');

  if (innityAppsHvrStory === null) {
    innityAppsHvrStory =  new InnityAppsHvrStory({
      isFirstElementVideo: innityAppsIsFirstElemementVideo,
      callbackWhenVideoPlay: whenVideoPlay,
      callbackWhenClassReady: whenClassReady,
    });
  }

  //hide story ui //zaim
  document.querySelector('#prev-button').style.display = 'none';
  document.querySelector('#next-button').style.display = 'none';
  document.querySelector('#timeline-table-container').style.display = 'none';

  if (innityAppsPlatform.getOS() !== 'ios' && innityAppsPlatform.getOS() !== 'android') {
    document.getElementById('innity-apps-ad').classList.add('within-desktop');
  }
}

function onAdBackToDefault() {
  innityAppsHvrStory.onAdBackToDefault();

  bsInvitation.classList.add('shrinked');

  innityAppsTriggerTimerStop();
}

function onAdExpand() {
  let heavyContainer = document.getElementById('innity-apps-heavy-ad-container');
  let loadingContainer = document.getElementById('innity-apps-creative-loading-container');
  let overlayContainer = document.getElementById('compressed-video-overlay');
  let storyContainer = document.getElementsByClassName('innity-apps-story-container')[0];
  let videoEl = document.getElementById('video-compressed');

  bsInvitation.classList.remove('shrinked');
  
  if(!chatStarted) {
    bot = new chatClass();
    bot.start();
    chatStarted = true;
  }

  //videoInit();
  innityAppsHvrStory.onAdExpand();

  if (heavyContainer.classList.contains('d-none') === true) {
    return;
  }

  loadingContainer.classList.remove('d-none');
  overlayContainer.classList.remove('d-none');

  if (storyContainer.classList.contains('type-image') === true) {
    onElementLoad(true);
  } else {
    videoEl.pause();
  }
}

function onAdKeydown(data) {
  innityAppsHvrStory.onAdKeydown(data);
}

function onAdShrink() {
  innityAppsHvrStory.onAdShrink();

  bsInvitation.classList.remove('shrinked');
}

function videoInit() {
  if (isVideoInit === true) {
    return;
  }

  isVideoInit = true;

  for (let i = 0; i < innityAppsMaterials.length; i++) {
    if (innityAppsMaterials[i].cssClass !== undefined &&
        innityAppsMaterials[i].cssClass[1] === 'type-video') {
        multipleVideo[i] = new videoLibraryWrapper(
            innityAppsMaterials[i].childs[0].id,
            innityAppsMaterials[i].attrs['data-video-name'],
            innityAppsMaterials[i].attrs['data-clicktag'],
            innityAppsMaterials[i].attrs['data-poster-name'],
            innityAppsIsFirstElemementVideo === true ? onElementLoad : ''
        );

        innityAppsIsFirstElemementVideo = false;
    }
  }

  visibilityBinding();
}

function onElementLoad(isImage = false) {
  let heavyContainer = document.getElementById('innity-apps-heavy-ad-container');
  let loadingContainer = document.getElementById('innity-apps-creative-loading-container');

  if (isImage === false) {
    multipleVideo[1].play();
  }

  setTimeout(() => {
    heavyContainer.classList.add('d-none');
    loadingContainer.classList.add('d-none');
    innityAppsHvrStory.onElementLoad();
  }, 1000);
}

let visibilityHidden = 'hidden';
function visibilityBinding() {
  let visibilityChangeEvent = 'visibilitychange';
  if (typeof (document.msHidden) !== 'undefined') {
    visibilityHidden = 'msHidden';
    visibilityChangeEvent = 'msvisibilitychange';
  } else if (typeof (document.webkitHidden) !== 'undefined') {
    visibilityHidden = 'webkitHidden';
    visibilityChangeEvent = 'webkitvisibilitychange';
  }

  document.addEventListener(visibilityChangeEvent, visibilityChange, false);
}
function visibilityChange() {
  if (document[visibilityHidden] === true) {
    // When browser is hidden or in background.
    for (let key in multipleVideo) {
      multipleVideo[key].pause();
    }
    innityAppsHvrStory.pause();
  } else {
    // When browser is active or focus.
    innityAppsHvrStory.playNext();

  }
}

function whenVideoPlay(index) {
  multipleVideo[index].play();
}

function whenClassReady() {
  innityAppsPostReadyToProxy();
}

function videoLibraryWrapper(elID, videoName, clicktag, poster, onVideoLoaded = null, countryParam = 'MY', fullscreenParam = false) {
  this.pause = pause;
  this.play = play;

  let videoPlayer_ = null;

  initClass_();

  function initClass_() {
    initVideo_();
  }

  // Public function ===========================================================

  function pause() {
    if (videoPlayer_ === null) {
      return;
    }

    videoPlayer_.pauseVideo();
  }

  function play() {
    if (videoPlayer_ === null) {
      return;
    }

    videoPlayer_.playVideo();
  }

  // Private function ==========================================================

  function initVideo_() {
    videoPlayer_ = new InnityAppsMobileAutoPlayVideo(
        elID,
        videoName,
        {
          webm: `${videoName}.webm`,
          mp4: `${videoName}.mp4`,
          poster: poster,
          autoplay: true,
          loop: true,
          cpm: false,
          country: countryParam,
          // For fallback player.
          fullscreen: fullscreenParam,
          midctatext: 'Learn More',
          playstatectatext: 'Learn More',
          urls: clicktag,
          onLoad: onVideoLoaded
        },
    );
  }

}
