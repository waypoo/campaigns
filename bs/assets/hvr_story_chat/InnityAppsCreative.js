function InnityAppsMobilePlatform() {
  this.debug = debug;
  this.getBrowserName = getBrowserName;
  this.getBrowserVersion = getBrowserVersion;
  this.getOS = getOS;
  this.getOSVersion = getOSVersion;
  this.getVersion = getVersion;
  /**
   * @deprecated This function is not valid due to we support mobile SDK which will return true same condition.
   */
  this.isIosSkype = isIosSkype;
  this.isIosWeChat = isIosWeChat;
  this.isSamsungBrowser = isSamsungBrowser;

  /**
   * Consist of <b>chrome</b>, <b>safari</b>, <b>samsungbrowser</b>,
   * <b>facebook</b>, <b>wechat</b>, <b>crios</b>, <b>line</b>,
   * <b>other</b>
   * @type String
   */
  var browserName_ = 'other';
  var browsersVersion_ = {
    'chrome': '0',
    'samsungbrowser': '0',
    'safari': '0',
    'crios': '0' // ios Chrome
  };
  /**
   * Consist of <b>ios</b>, <b>android</b> & <b>other</b>
   * @type String
   */
  var os_ = 'other';
  var osVersion_ = '0';
  var ua_ = null;
  /**
   * A checking to determine is the library latest.
   * @type String
   */
  var version_ = '5.0.0';

  initClass();

  // Public Function Section =================================================

  /**
   * For debug purpose.
   * @returns {String}
   */
  function debug() {
    var stringValue = '';
    if (os_ === 'ios') {
      stringValue = os_ + ' Version ' + osVersion_.join('.') + ' with ' + browserName_;
    } else {
      stringValue = os_ + ' Version ' + osVersion_ + ' with ' + browserName_;
    }
    return stringValue;
  }

  function getBrowserName() {
    return browserName_;
  }

  function getBrowserVersion() {
    return browsersVersion_;
  }

  function getOS() {
    return os_;
  }

  function getOSVersion() {
    return osVersion_;
  }

  function getVersion() {
    return version_;
  }

  /**
   * @deprecated This function is not valid due to we support mobile SDK which will return true same condition.
   * Please remove this function after 10 April 2021.
   * @returns {Boolean} always FALSE.
   */
  function isIosSkype() {
    return false;
  }

  /**
   * Detect iOS WeChat in app browser.
   * @returns {Boolean} TRUE if is iOS WeChat in app browser, else FALSE.
   */
  function isIosWeChat() {
    return os_ === 'ios' && browserName_ === 'wechat';
  }

  function isSamsungBrowser() {
    return browsersVersion_.samsungbrowser > 0;
  }

  // Proctected Function Section =============================================

  // Private Function Section ================================================

  function androidBrowserDetection_() {
    if (!!window.chrome && ua_.toLowerCase().indexOf('chrome') > -1) {
      browserName_ = 'chrome';
      androidChromeVersionDetection_();
    }

    if (ua_.toLowerCase().indexOf('samsungbrowser') > -1) {
      browserName_ = 'samsung';
      samsungBrowserVersionDetection_();
    }

    if (ua_.toLowerCase().indexOf('firefox') > -1) {
      browserName_ = 'firefox';
    }
  }

  function androidChromeVersionDetection_() {
    var analysis = ua_.match(/(chrome(?=\/))\/?\s*(\d+)/i) || [];
    if (analysis[1].toLowerCase() === 'chrome') {
      browsersVersion_['chrome'] = analysis[2];
    }
  }

  function browserDetection_() {
    if (os_ === 'ios') {
      iosBrowserDetection_();
    } else if (os_ === 'android') {
      androidBrowserDetection_();
    }
  }

  function iosBrowserDetection_() {
    var standalone = window.navigator.standalone;
    var isSafariKeyExist = /safari/i.test(ua_);
    var isChrome = /CriOS/i.test(ua_);

    if (!standalone && isSafariKeyExist === true) {
      if (isChrome === true) {
        browserName_ = 'chrome';
        iosChromeVersionDetection_();
        return;
      }

      var isLine = /Line/i.test(ua_);
      if (isLine === true) {
        browserName_ = 'line';
        return;
      }

      browserName_ = 'safari';
      browsersVersion_['safari'] = osVersion_.join('.');
    } else if (standalone && isSafariKeyExist === false) {
      // Standalone, homepage icon page
    } else {
      // In app browser
      if (/\bFB[\w_]+\//i.test(ua_) === true) {
        browserName_ = 'facebook';
      } else if (/\bMicroMessenger\//i.test(ua_) === true) {
        browserName_ = 'wechat';
      } else if (/\bInstagram\b/i.test(ua_) === true) {
        browserName_ = 'instagram';
      } else {
        // So far Skype don't have any key to detect.
        browserName_ = 'other';
      }
    }
  }

  function iosChromeVersionDetection_() {
    var analysis = ua_.match(/(crios(?=\/))\/?\s*(\d+)/i) || [];
    if (analysis[1].toLowerCase() === 'crios') {
      browsersVersion_['crios'] = analysis[2];
    }
  }

  function initClass() {
    ua_ = window.navigator.userAgent;

    osDetection_();
    browserDetection_();
  }

  function osDetection_() {
    if (/(iPhone|iPod|iPad)/i.test(ua_)) {
      os_ = 'ios';
      var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      osVersion_ = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    } else if (ua_.toLowerCase().indexOf('android') > -1) {
      os_ = 'android';
      var v = ua_.match(/Android (\d+(?:\.\d+){0,2})/i);
      if (v !== null) {
        osVersion_ = v[v.length - 1];
      }
    }
  }

  function samsungBrowserVersionDetection_() {
    var analysis = ua_.match(/(samsungbrowser(?=\/))\/?\s*(\d+)/i) || [];
    if (analysis[1].toLowerCase() === 'samsungbrowser') {
      browsersVersion_['samsungbrowser'] = analysis[2];
    }
  }

}

let innityAppsTimerTrackingID = null;
/**
 * For reference purpose only.
 * @type String
 */
let innityAppsTrackerVersion = '5.0.0';
let innityAppsIsTriggerClickTagEnable = true;

function innityAppsTrackerReset() {
  innityAppsTriggerTimerStop();
  innityAppsTrackerPauseVideo();
}

function innityAppsTriggerClickTag(clickTag) {
    if(innityAppsIsTriggerClickTagEnable === false) {
        return;
    }
    innityAppsTrackerPauseVideo();
    InnityHTMLAd.click({clickTAG: clickTag});
}

function innityAppsTriggerUrl(urlToLand) {
    if(innityAppsIsTriggerClickTagEnable === false) {
        return;
    }
    innityAppsTrackerPauseVideo();
    InnityHTMLAd.click({url: urlToLand});
}

function innityAppsTriggerTimerStart(id) {
  if (innityAppsTimerTrackingID === id) {
    return;
  }

  innityAppsTriggerTimerStop();
  InnityHTMLAd.startTimer(id);
  innityAppsTimerTrackingID = id;
}

function innityAppsTriggerTimerStop() {
  if (innityAppsTimerTrackingID !== null) {
    InnityHTMLAd.stopTimer(innityAppsTimerTrackingID);
    innityAppsTimerTrackingID = null;
  }
}

function innityAppsTriggerTrack(track) {
  InnityHTMLAd.track(track);
}

function innityAppsTrackerPauseVideo() {
  if (typeof innityAppsPauseAllVideo === 'function') {
    // Helper function to pause all video.
    innityAppsPauseAllVideo();
  }
}

function innityAppsResponsiveTriggerTimerStart(id) {
  innityAppsTriggerTimerStart(innityAppsGetResponsiveID(id));
}

function innityAppsResponsiveTriggerTrack(track) {
  innityAppsTriggerTrack(innityAppsGetResponsiveID(track));
}

function innityAppsGetResponsiveID(id) {
  if (innityAppsPlatform === undefined || innityAppsPlatform === null) {
    console.error('Missing innityAppsPlatform library! Please include InnityAppsMobilePlatform class');
    return;
  }

  let responsiveID = '';
  switch (innityAppsPlatform.getOS()) {
    case 'android':
    case 'ios':
      responsiveID = 'mobile_' + id;
      break;
    default:
      responsiveID = 'nonmobile_' + id;
      break;
  }

  return responsiveID;
}

let innityAppsMaterialGeneratorVersion = '6.0.0';
let innityAppsTotalImage = 0;

function innityAppsGenerateMainContent(container, waitForImageLoad = false) {
  for (let i = 0; i < innityAppsMaterials.length; i++) {
    innityAppsMaterialGenerator(innityAppsMaterials[i], container, waitForImageLoad);
  }

  if (waitForImageLoad === false || innityAppsTotalImage === 0) {
    innityAppsMaterialsLoadedCompleted();
  }
}

function innityAppsGifToMp4(elementData) {
    if (elementData.elType !== 'img') {
        return;
    }

    if (typeof elementData.isGifConverted !== 'boolean') {
        return;
    }

    if (elementData.isGifConverted === false) {
        return;
    }
    
    let imgSrc = elementData.attrs.src;
    if (elementData.attrs['data-src'] !== undefined) {
        // Some template is using data-src to load image source before user engaged.
        imgSrc = elementData.attrs['data-src'];
    }

    if (imgSrc === undefined) {
        return;
    }

    if (imgSrc.toLowerCase().indexOf('.gif') === -1) {
        return;
    }

    elementData.elType = 'video';
    elementData.attrs.src = imgSrc.toLowerCase().replace('.gif', '.mp4');
    if (elementData.attrs['data-src'] !== undefined) {
        // Some template is using data-src to load image source before user engaged.
        elementData.attrs.src = '';
        elementData.attrs['data-src'] = imgSrc.toLowerCase().replace('.gif', '.mp4');
    }
    elementData.attrs.preload = 'metadata';
    elementData.attrs.autoplay = '';
    elementData.attrs.muted = '';
    elementData.attrs.loop = '';
    elementData.attrs.playsinline = '';

    if (elementData.cssClass === undefined) {
        elementData.cssClass= [];
    }
    elementData.cssClass.push('innity-apps-animated-gif-video');
}

function innityAppsGetWebpParentEl(elementData, materialEl) {
    if (typeof elementData.isWebp !== 'boolean') {
      return null;
    }
  
    if (elementData.isWebp === false) {
      return null;
    }
  
    if (elementData.elType !== 'img') {
      return null;
    }
  
    if (typeof elementData.attrs === 'undefined' || typeof elementData.attrs !== 'object') {
      return null;
    }
  
    let childEl = materialEl;
    let parentEl = document.createElement('picture');
  
    if (typeof elementData.cssClass === 'object' && typeof elementData.cssClass.length === 'number') {
      for (let i = 0; i < elementData.cssClass.length; i++) {
        parentEl.classList.add(elementData.cssClass[i]);
      }
    }
  
    let fileSrc = elementData.attrs.src;
    fileSrc = fileSrc.substr(0, fileSrc.lastIndexOf(".")) + ".webp";
    let attrChildData = innityAppsImagePreviewCacheBuster(fileSrc, 'src');
  
    let sourceEl = document.createElement('source');
    sourceEl.setAttribute('srcset', attrChildData);
    sourceEl.setAttribute('type', 'image/webp');
  
    parentEl.appendChild(sourceEl);
    parentEl.appendChild(childEl);
  
    return parentEl;
}

function innityAppsImagePreviewCacheBuster(attrData, attrName) {
    let attrChildData = attrData;

    if (typeof(innityAppsIsPreview) === "undefined") {
        return attrChildData;
    }

    if (attrName === 'src' || attrName === 'data-src') {
        attrChildData += '?t=' + new Date().getTime();
    }

    return attrChildData;
}

/**
 * Generate HTML element based on elementData attribute. <br />
 * elementData.elType => type of created element <br/>
 * elementData.id => id of created element <br/>
 * elementData.cssClass => CSS classes of created element, is an array of string <br/>
 * elementData.innerHTML => direct content of created element <br/>
 * elementData.clickFunc => function called when created element is clicked, must be function name <br/>
 * elementData.clickTag => clickTag trigger by created element <br/>
 * elementData.cssStyle => inline CSS style of created element, object of cssStyleAttributeName => value <br/> eg:{'backgroundColor': 'rgba(255, 0, 148, 1)} <br/>
 * elementData.attrs => Attributes of created element, object of attributeName => value <br/> eg:{src: 'my_image.png'} <br/>
 * elementData.childs => children inside created element, array of elementData object <br/>
 * @param {object} elementData
 * @param {element} container
 * @param {boolean} waitForImageLoad Default is FALSE, set TRUE will wait for image loaded before call innityAppsBannerLoaded.
 */
function innityAppsMaterialGenerator(elementData, container, waitForImageLoad = false) {
    //innityAppsGifToMp4(elementData);
  
    let elementType = (typeof elementData.elType === 'undefined') ? 'div' : elementData.elType;
    let materialEl = document.createElement(elementType);
    let parentEl = innityAppsGetWebpParentEl(elementData, materialEl);
  
    innityAppsWaitForImageHandler(waitForImageLoad, materialEl, elementType);
  
    if (elementType === 'svg' || elementType === 'path') {
      materialEl = document.createElementNS('http://www.w3.org/2000/svg', elementType);
    }
  
    if (typeof elementData.id !== 'undefined') {
      materialEl.setAttribute('id', elementData.id);
    }
  
    if (typeof elementData.cssClass === 'object' && typeof elementData.cssClass.length === 'number') {
      for (let i = 0; i < elementData.cssClass.length; i++) {
        materialEl.classList.add(elementData.cssClass[i]);
      }
    }
  
    if (typeof elementData.innerHTML !== 'undefined') {
      materialEl.innerHTML = elementData.innerHTML;
    }
  
    if (typeof elementData.impressionTag !== 'undefined' && typeof elementData.impressionTag === 'object') {
      if (typeof innityAppsAddImpressionTag !== 'function') {
        console.error('impressionTag exist but innityAppsAddImpressionTag function doesnt exist');
        return;
      }
  
      innityAppsAddImpressionTag(elementData.impressionTag);
    }
  
    if (typeof elementData.clickFunc === 'function') {
      materialEl.addEventListener('click', function(e) {
        e.stopPropagation();
        elementData.clickFunc(materialEl);
      }, false);
    }
  
    if (typeof elementData.clickTag !== 'undefined') {
      materialEl.addEventListener('click', function(e) {
        e.stopPropagation();
        innityAppsTriggerClickTag(elementData.clickTag);
      }, false);
    }
  
    if (typeof elementData.cssStyle !== 'undefined' && typeof elementData.cssStyle === 'object') {
      for (let cssKey in elementData.cssStyle) {
        materialEl.style[cssKey] = elementData.cssStyle[cssKey];
      }
    }
  
    if (typeof elementData.androidAR !== 'undefined' && typeof elementData.androidAR === 'string') {
      let currentUrl = window.location.href;
      let curArFilePath = currentUrl.substr(0, currentUrl.lastIndexOf('/') + 1) + elementData.androidAR;
      let curArPath = `intent://arvr.google.com/scene-viewer/1.0?file=${curArFilePath}&mode=ar_only#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`;
      materialEl.setAttribute('rel', 'ar');
      materialEl.setAttribute('href', curArPath);
    }
  
    if (typeof elementData.iosAR !== 'undefined' && typeof elementData.iosAR === 'string') {
      materialEl.setAttribute('rel', 'ar');
      materialEl.setAttribute('href', elementData.iosAR);
    }
  
    if (typeof elementData.attrs !== 'undefined' && typeof elementData.attrs === 'object') {
      for (let attrName in elementData.attrs) {
        if (elementType === 'svg' || elementType === 'path') {
          materialEl.setAttributeNS(null, attrName, elementData.attrs[attrName]);
        }
        else {
          let attrChildData = innityAppsImagePreviewCacheBuster(elementData.attrs[attrName], attrName);
          materialEl.setAttribute(attrName, attrChildData);
        }
      }
    }
  
    if (typeof elementData.childs !== 'undefined' && typeof elementData.childs === 'object') {
      for (let i = 0; i < elementData.childs.length; i++) {
        innityAppsMaterialGenerator(elementData.childs[i], materialEl, waitForImageLoad);
      }
    }
    
    if (parentEl !== null) {
      materialEl = parentEl;
    }
  
    container.appendChild(materialEl);
}

function innityAppsPlayGifVideo() {
  let gifVideos = document.getElementsByClassName('innity-apps-animated-gif-video');
  [...gifVideos].forEach(gifVid => {
    gifVid.muted = true;
    gifVid.play().catch((e) => {});;
  });
}

function innityAppsWaitForImageHandler(waitForImageLoad, element, elementType) {
  if (waitForImageLoad === false) {
    return;
  }

  if (elementType.toLowerCase() !== 'img') {
    return;
  }

  innityAppsTotalImage++;

  element.addEventListener('load', imageLoaded_);
  element.addEventListener('error', imageError_);

  function imageError_() {
    imageCompleted_();
  }

  function imageLoaded_() {
    imageCompleted_();
  }

  function imageCompleted_() {
    innityAppsTotalImage--;

    if (innityAppsTotalImage === 0) {
      innityAppsMaterialsLoadedCompleted();
    }
  }

}

function innityAppsMaterialsLoadedCompleted() {
  if (typeof bannerAnimationStart === 'function') {
    setTimeout(bannerAnimationStart, 100);
  }

  if (typeof innityAppsBannerLoaded === 'function') {
    setTimeout(innityAppsBannerLoaded, 100);
  }

  setInterval(innityAppsPlayGifVideo, 1000);
}

function InnityAppsHvrStory(opts) {
  this.getCurrentIndex = getCurrentIndex;
  this.onAdBackToDefault = onAdBackToDefault;
  this.onAdExpand = onAdExpand;
  this.onAdKeydown = onAdKeydown;
  this.onAdShrink = onAdShrink;
  this.onElementLoad = onElementLoad;
  this.pause = pause;
  this.playNext = playNext;

  let STATUS_DEFAULT = 0;
  let STATUS_EXPAND = 1;
  let STATUS_SHRINK = -1;

  let extraOptions = mergeObject({
    isFirstElementVideo: true,
    callbackWhenVideoPlay: null,
    callbackWhenClassReady: null,
  }, opts, 'extraOptions');
  let curStoryIndex = 0;
  let currentStatus = STATUS_DEFAULT;
  let dragHandler_ = null;
  let imageTimeout = null;
  let mainContainer = null;
  let nextBtn = null;
  let prevBtn = null;
  let stories = [];
  let storyContainer = null;
  let timelineContainer = null;
  let timelines = [];
  let isVideoLoaded = false;

  let storyTracking = {
    "next":function(){innityAppsTriggerTrack("btn_next");},
    "prev":function(){innityAppsTriggerTrack("btn_prev");},
  }

  initClass();

  function initClass() {
    if (innityAppsPlatform === null) {
      throw 'innityAppsPlatform is NULL!';
    }

    mainContainer = document.getElementById('innity-apps-ad');
    nextBtn = document.getElementById('next-button');
    prevBtn = document.getElementById('prev-button');
    stories = document.getElementsByClassName('innity-apps-story-container');
    timelines = document.getElementsByClassName('timeline-cell');
    timelineContainer = document.getElementById('timeline-table-container');
    storyContainer = document.getElementsByClassName('innity-apps-story-container');

    if (innityAppsPlatform.getOS() === 'ios' || innityAppsPlatform.getOS() === 'android') {
      mainContainer.classList.add('mobile');
    }

    dragHandler_ = new DragHandler_();

    bindEvents_();
    if (opts.isFirstElementVideo === true) {
      handleTempVideo_();
    }

    if (typeof (extraOptions.callbackWhenClassReady) === 'function') {
      extraOptions.callbackWhenClassReady();
    }
  }

  // Public function ===========================================================

  function getCurrentIndex() {
    return curStoryIndex + 1;
  }

  function onAdBackToDefault() {
    timelineContainer.classList.add('d-none');
    prevBtn.classList.add('d-none');
    nextBtn.classList.add('d-none');

    dragHandler_.show();

    currentStatus = STATUS_DEFAULT;

    muteVideo_();
    removeImageStyle_();
  }

  function onAdExpand() {
    timelineContainer.classList.remove('d-none');
    prevBtn.classList.remove('d-none');
    nextBtn.classList.remove('d-none');

    dragHandler_.hide();

    currentStatus = STATUS_EXPAND;
    if (isVideoLoaded === false) {
      return;
    }

    startStory_();
    startTimeline_();
  }

  function onAdKeydown(data) {
    if (data.keyCode === 39) {
      startNext_();
    } else {
      startFromPrev_();
    }
  }

  function onAdShrink() {
    currentStatus = STATUS_SHRINK;
    innityAppsTriggerTimerStop();
  }

  function onElementLoad() {
    if (isVideoLoaded === false) {
      updateAnimationDuration_();
    }

    startStory_();
    startTimeline_();
    isVideoLoaded = true;
  }

  function pause() {
    if (storyContainer[curStoryIndex].classList.contains('type-video')) {
      return;
    }

    clearTimeout(imageTimeout);
  }

  function playNext() {
    startNext_();
  }

  // Private function ===========================================================

  function bindEvents_() {
    window.addEventListener('resize', onResize_);
    mainContainer.addEventListener('touchmove', onTouchMove_);
    nextBtn.addEventListener('click', onNextBtnClick_);
    prevBtn.addEventListener('click', onPrevBtnClick_);
  }

  function centerImage_() {
    if (currentStatus === STATUS_SHRINK || currentStatus === STATUS_DEFAULT) {
      return;
    }

    if (stories[curStoryIndex].classList.contains('type-image') === true) {
      let imageEl = stories[curStoryIndex].querySelector('img');
      if (imageEl.offsetHeight > window.innerHeight) {
        imageEl.style.marginTop = -((imageEl.offsetHeight - window.innerHeight) / 2) + 'px';
      } else {
        imageEl.style.marginTop = '0px';
      }
    }
  }

  function curVideoPlayEnded_() {
    let curStory = stories[curStoryIndex];
    if (curStory.querySelector('video') !== null) {
      if (curStory.querySelector('video').tagName.toLowerCase() === 'video') {
        curStory.querySelector('video').removeEventListener('ended', curVideoPlayEnded_);
      }
    }

    startNext_();
  }

  function handleTempVideo_() {
    if (storyContainer[0].classList.contains('type-image') === true) {
      return;
    }

    let tempVideo = document.getElementById('video-compressed');

    tempVideo.muted = true;
    tempVideo.play();
    tempVideo.muted = true;
  }

  function mergeObject(defaultObj, overrideObject, reference) {
    for (let attributeKey in overrideObject) {
      if (defaultObj.hasOwnProperty(attributeKey)) {
        defaultObj[attributeKey] = overrideObject[attributeKey];
      } else {
        console.warn('[Version ' + version + '] Key [' + attributeKey + '] not found in object merging process.', reference);
      }
    }

    return defaultObj;
  }

  function muteVideo_() {
    let currentStory = stories[curStoryIndex];
    if (currentStory.classList.contains('type-video') === true) {
      let videoEl = currentStory.querySelector('video');
      videoEl.muted = true;
    }
  }

  function onNextBtnClick_(e) {
    e.stopPropagation();
    startNext_();

    storyTracking.next();
  }

  function onPrevBtnClick_(e) {
    e.stopPropagation();
    startFromPrev_();

    storyTracking.prev();
  }

  function onResize_() {
    centerImage_();
  }

  function onTouchMove_(e) {
    e.preventDefault();
  }

  function removeImageStyle_() {
    let imageEl = stories[curStoryIndex].querySelector('img');
    imageEl.removeAttribute('style');

  }

  function resetTimeline_() {
    for (let i = 0; i < timelines.length; i++) {
      let curTimeline = timelines[i];
      curTimeline.classList.remove('seen');
      curTimeline.classList.remove('active');
    }
  }

  function startFromPrev_() {
    let storyToHide = stories[curStoryIndex];
    storyToHide.classList.add('d-none');
    if (storyToHide.classList.contains('type-video') === true) {
      storyToHide.querySelector('video').pause();
    }
    let curTimeline = timelines[curStoryIndex];
    curTimeline.classList.remove('active');

    if (imageTimeout !== null) {
      clearTimeout(imageTimeout);
      imageTimeout = null;
    }

    if (curStoryIndex <= 0) {
      curStoryIndex = stories.length - 1;
      for (let i = 0; i < timelines.length - 1; i++) {
        let curTimeline = timelines[i];
        curTimeline.classList.add('seen');
        curTimeline.classList.remove('active');
      }
    } else {
      curStoryIndex--;
    }

    let storyToShow = stories[curStoryIndex];
    storyToShow.classList.remove('d-none');
    onAdExpand();
  }

  function startNext_() {
    if (currentStatus === STATUS_SHRINK || currentStatus === STATUS_DEFAULT) {
      startPlayVideo_();
      return;
    }

    let storyToHide = stories[curStoryIndex];
    storyToHide.classList.add('d-none');
    if (storyToHide.classList.contains('type-video') === true) {
      storyToHide.querySelector('video').pause();
    }
    let curTimeline = timelines[curStoryIndex];
    curTimeline.classList.remove('active');
    curTimeline.classList.add('seen');

    if (imageTimeout !== null) {
      clearTimeout(imageTimeout);
      imageTimeout = null;
    }

    if (curStoryIndex >= (stories.length - 1)) {
      curStoryIndex = 0;
      resetTimeline_();
    } else {
      curStoryIndex++;
    }

    let storyToShow = stories[curStoryIndex];
    storyToShow.classList.remove('d-none');
    onAdExpand();
  }

  function startStory_() {
    let curStory = stories[curStoryIndex];
    innityAppsTriggerTimerStart(storyContainer[curStoryIndex].getAttribute('data-time-track'));

    if (curStory.classList.contains('type-video') === true) {
      startPlayVideo_();
    } else {
      startPlayImage_();
    }
  }

  function startPlayImage_() {
    centerImage_();
    imageTimeout = setTimeout(curImageTimeout_, 5000);
  }

  function curImageTimeout_() {
    startNext_();
  }

  function startPlayVideo_() {
    let curStory = stories[curStoryIndex];
    let videoEl = curStory.querySelector('video');

    if (videoEl === null) {
      return;
    }

    if (currentStatus === STATUS_EXPAND) {
      videoEl.muted = false;
    }

    videoEl.currentTime = 0;
    videoEl.addEventListener('ended', curVideoPlayEnded_);

    if (typeof (extraOptions.callbackWhenVideoPlay) === 'function') {
      extraOptions.callbackWhenVideoPlay(curStoryIndex + 2);
    }
  }

  function startTimeline_() {
    let curTimeline = timelines[curStoryIndex];
    curTimeline.classList.remove('seen');
    curTimeline.classList.add('active');
  }

  function resetTimeline_() {
    for (let i = 0; i < timelines.length; i++) {
      let curTimeline = timelines[i];
      curTimeline.classList.remove('seen');
      curTimeline.classList.remove('active');
    }
  }

  function updateAnimationDuration_() {
    let storyEl = document.getElementsByClassName('innity-apps-story-container');
    let timeline = document.getElementsByClassName('timeline-cell');
    for (let i = 0; i < storyEl.length; i++) {
      if (storyEl[i].classList.contains('type-video')) {
        let videoEl = storyEl[i].getElementsByTagName('video')[0];
        timeline[i].childNodes[0].style.animationDuration = videoEl.duration + 's';
      }
    }
  }

  // Private Class Section =====================================================

  /**
   * Drag handler to handle drag event and fire the event to proxy.
   * @return {DragHandler_}
   */
  function DragHandler_() {
    this.hide = hide;
    this.show = show;

    let container__ = null;

    initClass__();

    function initClass__() {
      container__ = document.getElementById('innity-apps-drag-container');
      if (container__ === null) {
        throw 'Container with ID "innity-apps-drag-containaer" is missing!';
      }

      if (innityAppsPlatform.getOS() === 'ios' || innityAppsPlatform.getOS() === 'android') {
        new MobileDragHandler__();
      } else {
        new DesktopDragHandler__();
      }
    }

    // Public function section =================================================

    function hide() {
      container__.style.display = 'none';
    }

    function show() {
      container__.style.display = 'block';
    }

    // Private function section ================================================

    function clicked__() {
      postMessageToProxy__('adExpand');
    }

    function dragMove__(coorX, coorY) {
      postMessageToProxy__('dragMove', {x: coorX, y: coorY});
    }

    function dragStart__(coorX, coorY) {
      postMessageToProxy__('dragStart', {x: coorX, y: coorY});
    }

    function dragStop__() {
      postMessageToProxy__('dragEnd');
    }

    function postMessageToProxy__(actionToPost, dataToPost = {}) {
      parent.postMessage({owner: 'Innity', adType: 'innity-apps-hvr-story', adID: InnityHTMLAd.id, cb: InnityHTMLAd.cb, action: actionToPost, data: dataToPost, version: innityAppsVersion}, '*');
    }

    // Private class section ===================================================

    function DesktopDragHandler__() {
      initClass___();

      function initClass___() {
        bindEvents___();
      }

      // Public function section ===============================================

      // Private function section ==============================================

      function bindEvents___() {
        container__.addEventListener('click', clicked__);
      }
    }

    function MobileDragHandler__() {
      initClass___();

      function initClass___() {
        bindEvents___();
      }

      // Public function section ===============================================

      // Private function section ==============================================

      function bindEvents___() {
        container__.addEventListener('touchstart', onTouchStart___, {passive: true});
        container__.addEventListener('touchmove', onTouchMove___, {passive: false});
        container__.addEventListener('touchend', dragStop__);
        container__.addEventListener('click', clicked__);
      }

      function onTouchStart___(e) {
        dragStart__(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }

      function onTouchMove___(e) {
        dragMove__(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }

    }

  }

}

/**
 * Only set to TRUE if required orientation.
 * @type Boolean
 */
let innityAppsIosWorkAroundEl = null;
let innityAppsIosWorkAroundCounter = 0;
let innityAppsIsBannerLoad = false;
let innityAppsPlatform = null;
let innityAppsWarningReported = false;
let innityAppsVersion = '4.6.42';

window.addEventListener('load', innityAppsInitCreative, false);

function innityAppsAdDefault() {
  document.getElementById('innity-apps-ad').classList.remove('expand');

  if (typeof onAdBackToDefault !== 'function') {
    return;
  }

  onAdBackToDefault();
}

function innityAppsAdExpand() {
  document.getElementById('innity-apps-ad').classList.add('expand');
  document.getElementById('innity-apps-ad').classList.remove('shrink');

  if (typeof onAdExpand !== 'function') {
    return;
  }

  onAdExpand();
}

function innityAppsAdKeydown(data) {
  onAdKeydown(data);
}

function innityAppsAdShrink() {
  document.getElementById('innity-apps-ad').classList.remove('expand');
  document.getElementById('innity-apps-ad').classList.add('shrink');

  if (typeof onAdShrink !== 'function') {
    return;
  }

  onAdShrink();
}

function innityAppsInitCreative() {
  innityAppsPlatform = new InnityAppsMobilePlatform();

  window.addEventListener('message', innityAppsMessageHandler, false);

  innityAppsSetupCreative();
  innityAppsSetIOSWorkaround();
}

function innityAppsIosAppendText() {
  innityAppsIosWorkAroundEl.innerHTML += '.';
  innityAppsIosWorkAroundCounter++;

  if (innityAppsIosWorkAroundCounter >= 100) {
    innityAppsIosWorkAroundCounter = 0;
    innityAppsIosWorkAroundEl.innerHTML = '';
  }
}

function innityAppsMessageHandler(event) {
  let innityAppsSupportedMsg = event.data;
  if (typeof (innityAppsSupportedMsg.owner) === 'undefined' || innityAppsSupportedMsg.owner !== 'Innity' || typeof (innityAppsSupportedMsg.adType) === 'undefined') {
    return;
  }

  if (innityAppsSupportedMsg.version != innityAppsVersion) {
    if (innityAppsWarningReported === false) {
      console.warn('Proxy and ad version is different! Proxy v' + innityAppsSupportedMsg.version + ' vs Ad v' + innityAppsVersion);
    }
    innityAppsWarningReported = true;
  }

  switch (innityAppsSupportedMsg.action) {
    case 'default':
      innityAppsAdDefault();
      break;
    case 'expand':
      innityAppsAdExpand();
      break;
    case 'keydown':
      innityAppsAdKeydown(innityAppsSupportedMsg.data);
      break;
    case 'shrink':
      innityAppsAdShrink();
      break;
    default:
      break;
  }
}

function innityAppsPostReadyToProxy() {
  parent.postMessage({owner: 'Innity', adType: 'innity-apps-hvr-story', adID: InnityHTMLAd.id, cb: InnityHTMLAd.cb, action: 'adReady', data: {}, version: innityAppsVersion}, '*');
}

/**
 * This is a workaround to enable iOS Safari touch events after user scroll the page.
 */
function innityAppsSetIOSWorkaround() {
  if (innityAppsPlatform.getOS() === 'ios') {
    innityAppsIosWorkAroundEl = document.getElementById('innity-apps-ios-workaround');
    setInterval(innityAppsIosAppendText, 500);
  }
}

function innityAppsSetupCreative() {
  if (innityAppsIsBannerLoad === true) {
    return;
  }

  innityAppsGenerateMainContent(document.getElementById('innity-apps-ad'));
  innityAppsIsBannerLoad = true;
}
