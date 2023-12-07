let adStudioTemplateName = 'hvr_story_001';
innity_protocol = (location.protocol == 'https:') ? 'https:' : 'http:';
innity_domain = "";
// Campaign ID
var campaignid_177002 = "11612";
// Cache buster
var cb_177002   = ''; //new Date().getTime();
var auth_177002 = Math.random().toString(36).substring(7) + "-" + cb_177002;

innity_pub = "something";
zone_177002 = "something";
pcu_177002 = "something";

// Main file source
ad_177002 = {};
ad_177002.holder = top.document.getElementById('innity-adslot-177002');
ad_177002.base = innity_domain;
ad_177002.src = ad_177002.base + `assets/${adStudioTemplateName}/index.html?pub=` + innity_pub + "&zone=" + zone_177002 + "&pcu=" + pcu_177002 + "&auth=" + auth_177002;

ad_177002.frame = document.createElement('iframe');
ad_177002.frame.id = 'INNITYFrame_177002';
ad_177002.frame.src = ad_177002.src;

function c177002_classReadyCallback() {
  console.log('%cClass is ready', 'background:lightgreen;');
}
function c177002_adReadyCallback(adMsg) {
  // adReady --> when ad is loaded & ready.
  // pubError --> Cannot find innity-in-post element.
  console.log('%cAd is ready (' + adMsg.adMessage + ')', 'color:white; background:darkblue;');
}
function c177002_adClosedCallback() {
  console.log('%cAd is CLOSED!', 'color:white; background:red;');
}
function c177002_bannerAdExpandedCallback() {
  console.log('%cBanner ad is expanded!', 'color:white; background:green;');
}
function c177002_bannerAdShrinkedCallback() {
  console.log('%cBanner ad is CLOSED!', 'color:white; background:black;');
}
function c177002_versionDifferentCallback(proxyVersion, adVersion) {
  console.warn('Proxy and ad version is different! Proxy v' + proxyVersion + ' vs %cAd v' + adVersion, 'background:red;color:white;');
}

var c177002_innityAppsOpts = {
  iframeEl: ad_177002.frame,
  placementEl: ad_177002.holder,
//  country: 'TW', // default is MY (string).
  // isCloseVersion: true, // default will be false (boolean).
  // isLiteVersion: true, // default will be false (boolean).
  adClosedCallback: c177002_adClosedCallback,
  adReadinessCallback: c177002_adReadyCallback,
  bannerAdExpandedCallback: c177002_bannerAdExpandedCallback,
  classReadyCallback: c177002_classReadyCallback,
  versionWarning: c177002_versionDifferentCallback,
//  tagGuarantee: true, // default will be true (boolean).
//  tagGuaranteeCallback: function() { console.log('tagGuaranteeCallback') }, // default will be null.
  accessibleWindow: top.window,
  accessibleDocument: top.document,
};

if (top.location.href.indexOf('tribunnews.com') > -1) {
  c177002_innityAppsOpts.tribunnews = true;
} else if (top.location.href.indexOf('thestar.com.my') > -1) {
  c177002_innityAppsOpts.thestar = true;
}

var c177002_innityAppsMobileAdObj = new c177002_InnityAppsHvrStoryAd(c177002_innityAppsOpts);

function c177002_InnityAppsHvrStoryAd(options) {
  this.cleanDebugMessage = cleanDebugMessage;
  this.getDebugMessage = getDebugMessage;
  this.getVersion = getVersion;

  let STATUS_DEFAULT = 0;
  let STATUS_EXPAND = 1;
  let STATUS_SHRINK = -1;

  // ========== Order dependency variable ==========
  let curDoc_ = document;
  let curWin_ = window;
  let debugMessage_ = '';
  let extraOptions_ = mergeObject_({
    iframeEl: null,
    isCloseVersion: false,
    isLiteVersion: false,
    placementEl: null,
    country: 'MY',
    // Events callback.
    adClosedCallback: null,
    adReadinessCallback: null,
    bannerAdExpandedCallback: null,
    classReadyCallback: null,
    versionWarning: null,
    // Events callback.
    // Publisher custom handler
    tribunnews: false,
    thestar: false,
    // Publisher custom handler
    tagGuarantee: false,
    tagGuaranteeCallback: null,
    accessibleWindow: null,
    accessibleDocument: null,
    enableDebug: true,
    // Custom position
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
  }, options, 'extraOptions');
  let timeForDebug_ = new Date();
  let version_ = '4.6.42';
  // ========== Order dependency variable ==========

  new InnityAppsIframeBreaker();

  let currentPosition_ = 'bottom-left';
  let currentStatus_ = STATUS_DEFAULT;
  let closeBtnContainer_ = null;
  let closeVersionBtnContainer_ = null;
  let dragContainer_ = null;
  let iframeEl_ = null;
  let loadingContainer_ = null;
  let moveContainer_ = null;
  let placementEl_ = null;
  let playBtnContainer_ = null;
  let shrinkBtnContainer_ = null;
  let dragHandler_ = null;

  let customPub_ = new InnityAppsCustomPubs_();
  let platform_ = new InnityAppsMobilePlatform();

  if (curDoc_.readyState !== 'loading') {
    initClass_();

    log_('DOM is ready, direct execute the class.');
  } else {
    curDoc_.addEventListener('DOMContentLoaded', initClass_, false);

    log_('DOM isn\'t ready, listen to DOMContentLoaded event.');
  }

  function initClass_() {
    if (extraOptions_.tagGuarantee === true) {
      if (typeof extraOptions_.tagGuaranteeCallback === 'function') {
        extraOptions_.tagGuaranteeCallback();
        return;
      }
    }

    if (extraOptions_.placementEl === undefined || extraOptions_.placementEl === null) {
      throw 'Missing placementEl!';
    }

    if (extraOptions_.iframeEl === undefined || extraOptions_.iframeEl === null) {
      throw 'Missing iframeEl!';
    }

    placementEl_ = extraOptions_.placementEl;
    iframeEl_ = extraOptions_.iframeEl;

    setupIframeProperties_();
    setupCssClasses_();
    setupStyle_();
    setupCloseBtnContainer_();
    setupMoveContainer_();
    setupDragContainer_();
    setupCloseVersionContainer_();
    setupPlayBtn_();
    setupLoadingContainer_();
    bindEvents_();
    onResize_();

    if (getPlatform_() === 'mobile') {
      placementEl_.classList.add('mobile');
    }

    if (typeof extraOptions_.classReadyCallback === 'function') {
      extraOptions_.classReadyCallback();
    }
  }

  // Public function section ===================================================

  function cleanDebugMessage() {
    debugMessage_ = '';
  }

  function getDebugMessage() {
    return debugMessage_;
  }

  function getVersion() {
    return version_;
  }

  // Private function section ==================================================

  function backToDefault_() {
    closeBtnContainer_.classList.add('d-none');
    placementEl_.classList.remove('expanded');
    dragContainer_.classList.remove('d-none');

    currentStatus_ = STATUS_DEFAULT;

    setPositions_();
    postMsgToIframe_('default');

    if (extraOptions_.isCloseVersion === true) {
      closeVersionBtnContainer_.classList.remove('d-none');
      return;
    }

    shrinkBtnContainer_.classList.remove('d-none');
  }

  function bindEvents_() {
    curDoc_.addEventListener('keydown', onKeyDown_);
    curWin_.addEventListener('resize', onResize_);
    curWin_.addEventListener('message', onMessageReceived_);
    window.addEventListener('message', onMessageReceived_);

  }

  function bindEventsAfterAdReady_() {
    placementEl_.addEventListener('click', onPlacementClick_);

    dragHandler_ = new DragHandler_();
  }

  function expand_() {
    closeBtnContainer_.classList.remove('d-none');
    placementEl_.classList.add('expanded');
    placementEl_.classList.remove('shrink');
    playBtnContainer_.classList.add('d-none');
    dragContainer_.classList.add('d-none');

    currentStatus_ = STATUS_EXPAND;

    placementEl_.removeAttribute('style');

    if (typeof extraOptions_.bannerAdExpandedCallback === 'function') {
      extraOptions_.bannerAdExpandedCallback();
    }

    if (extraOptions_.isCloseVersion === true) {
      closeVersionBtnContainer_.classList.add('d-none');
      return;
    }

    shrinkBtnContainer_.classList.add('d-none');
  }

  function getPlatform_() {
    if (platform_.getOS() === 'ios' || platform_.getOS() === 'android') {
      return 'mobile';
    }

    return 'other';
  }

  function log_(msg) {
    if (extraOptions_.enableDebug === true) {
      debugMessage_ += 'v' + version_ + ' [' + timeForDebug_.toGMTString() + '] ' + msg + '\n';
    }
  }

  function mergeObject_(defaultObj, overrideObject, reference) {
    for (let attributeKey_ in overrideObject) {
      if (defaultObj.hasOwnProperty(attributeKey_)) {
        defaultObj[attributeKey_] = overrideObject[attributeKey_];
      } else {
        console.warn('Key [' + attributeKey_ + '] not found in object merging process.', reference);
      }
    }

    return defaultObj;
  }

  function onCloseBtnClick_(e) {
    e.stopPropagation();
    backToDefault_();
  }

  function onCloseVersionBtnClick_(e) {
    e.stopPropagation();
    placementEl_.remove();
    
    if (typeof extraOptions_.adClosedCallback === 'function') {
      extraOptions_.adClosedCallback();
    }
  }

  function onKeyDown_(e) {
    if (currentStatus_ !== STATUS_EXPAND) {
      return;
    }

    switch (e.keyCode) {
      case 39:
        e.preventDefault();
        postMsgToIframe_('keydown', {keyCode: e.keyCode});
        break;
      case 37:
        e.preventDefault();
        postMsgToIframe_('keydown', {keyCode: e.keyCode});
        break;
      default:
        break;
    }
  }

  function onMessageReceived_(event) {
    let supportedMsg = event.data;
    if (typeof (supportedMsg.owner) === 'undefined' || supportedMsg.owner !== 'Innity' || typeof (supportedMsg.adType) === 'undefined') {
      return;
    }

    if (supportedMsg.version !== version_) {
      if (typeof extraOptions_.versionWarning === 'function') {
        extraOptions_.versionWarning(version_, supportedMsg.version);
      }

      log_('Proxy and ad version is different! v' + supportedMsg.version);
    }

    switch (supportedMsg.action) {
      case 'adReady':
        bindEventsAfterAdReady_();
        loadingContainer_.classList.add('d-none');

        if (supportedMsg.data.isShrinkVersion !== undefined && supportedMsg.data.isShrinkVersion === false) {
          extraOptions_.isCloseVersion = true;
          setupCloseVersionContainer_();
        }

        setupShrinkBtnContainer_();

        if (typeof extraOptions_.adReadinessCallback === 'function') {
          extraOptions_.adReadinessCallback({adMessage: supportedMsg.action});
        }
        break;
      case 'adExpand':
        onPlacementClick_();
        break;
      case 'dragStart':
        dragHandler_.dragStart(supportedMsg.data.x, supportedMsg.data.y);
        break;
      case 'dragMove':
        dragHandler_.dragMove(supportedMsg.data.x, supportedMsg.data.y);
        break;
      case 'dragEnd':
        dragHandler_.dragStop();
        break;
      default:
        break;
    }
  }

  function onPlacementClick_() {
    if (extraOptions_.isLiteVersion === true) {
      postMsgToIframe_('click');
      return;
    }

    if (currentStatus_ === STATUS_EXPAND) {
      backToDefault_();
      postMsgToIframe_('default');
    } else {
      expand_();
      postMsgToIframe_('expand');
    }
  }

  function onResize_() {
    setPositions_();

    if (getPlatform_() !== 'mobile') {
      return;
    }

    // curWin_ height bigger than moveContainer_, just set correct height for moveContainer_.
    // moveContainer_ height is bigger than curWin_, set height to 100%.
    let height = screen.width / 9 * 16;
    if (curWin_.innerHeight > height) {
      moveContainer_.style.height = (16 / 9 * curWin_.innerWidth) + 'px';
    } else {
      moveContainer_.style.height = '100%';
    }
  }

  function onShrinkBtnClick_(e) {
    e.stopPropagation();

    shrinkBtnContainer_.classList.add('d-none');
    placementEl_.classList.add('shrink');

    if (extraOptions_.isLiteVersion === false) {
      playBtnContainer_.classList.remove('d-none');
    }

    currentStatus_ = STATUS_SHRINK;

    postMsgToIframe_('shrink');
    setPositions_();

    
    if (extraOptions_.isLiteVersion === false) {
      return;
    }
    
    dragContainer_.classList.add('d-none');
  }

  function postMsgToIframe_(actionToPost, dataToPost = {}) {
    if (iframeEl_ === null || iframeEl_.contentWindow === null) {
      return;
    }

    iframeEl_.contentWindow.postMessage({owner: 'Innity', adType: 'innity-apps-mrec', action: actionToPost, data: dataToPost, version: version_}, '*');
  }

  function setPositions_() {
    if (currentStatus_ === STATUS_EXPAND) {
      return;
    }
    
    let containerHeight = (currentStatus_ === STATUS_SHRINK) ? 50 : 277;
    let containerWidth = (currentStatus_ === STATUS_SHRINK) ? 50 : 156;
    
    if (getPlatform_() === 'mobile') {
      containerHeight = (currentStatus_ === STATUS_SHRINK) ? 50 : 213;
      containerWidth = (currentStatus_ === STATUS_SHRINK) ? 50 : 120;
    }

    switch (currentPosition_) {
      case 'top-left':
        placementEl_.style.left = extraOptions_.left + 'px';
        placementEl_.style.bottom = (curWin_.innerHeight - containerHeight - extraOptions_.top) + 'px';
        break;
      case 'bottom-left':
        placementEl_.style.left = extraOptions_.left + 'px';
        placementEl_.style.bottom = extraOptions_.bottom + 'px';
        break;
      case 'top-right':
        placementEl_.style.left = (curWin_.innerWidth - containerWidth - extraOptions_.right) + 'px';
        placementEl_.style.bottom = (curWin_.innerHeight - containerHeight - extraOptions_.top) + 'px';
        break;
      case 'bottom-right':
        placementEl_.style.left = (curWin_.innerWidth - containerWidth - extraOptions_.right) + 'px';
        placementEl_.style.bottom = extraOptions_.bottom + 'px';
        break;
    }
  }

  function setupCloseBtnContainer_() {
    closeBtnContainer_ = curDoc_.createElement('div');
    closeBtnContainer_.classList.add('innity-apps-close-container');
    closeBtnContainer_.classList.add('top-right');
    closeBtnContainer_.classList.add('d-none');

    let closeImg = curDoc_.createElement('img');
    closeImg.classList.add('close-btn');
    closeImg.setAttribute('src', 'data:image/png;base64,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');
    closeImg.setAttribute('alt', 'Close Button');

    closeImg.addEventListener('click', onCloseBtnClick_);

    closeBtnContainer_.appendChild(closeImg);
  }

  function setupCloseVersionContainer_() {
    if (extraOptions_.isCloseVersion === false) {
      return;
    }

    closeVersionBtnContainer_ = curDoc_.createElement('div');
    closeVersionBtnContainer_.classList.add('innity-apps-close-version-container');
    closeVersionBtnContainer_.classList.add('top-right');

    let closeImg = curDoc_.createElement('img');
    closeImg.classList.add('close-btn');
    closeImg.setAttribute('src', 'data:image/png;base64,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');
    closeImg.setAttribute('alt', 'Close Button');

    closeImg.addEventListener('click', onCloseVersionBtnClick_);

    closeVersionBtnContainer_.appendChild(closeImg);
    placementEl_.appendChild(closeVersionBtnContainer_);
  }

  function setupShrinkBtnContainer_() {
    if (extraOptions_.isCloseVersion === true) {
      return;
    }

    if (shrinkBtnContainer_ !== null) {
      return;
    }

    shrinkBtnContainer_ = curDoc_.createElement('div');
    shrinkBtnContainer_.classList.add('innity-apps-shrink-container');
    shrinkBtnContainer_.classList.add('top-right');

    let shrinkImg = curDoc_.createElement('img');
    shrinkImg.classList.add('shrink-btn');
    shrinkImg.setAttribute('src', 'data:image/png;base64,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');
    shrinkImg.setAttribute('alt', 'Shrink Button');

    shrinkImg.addEventListener('click', onShrinkBtnClick_);

    shrinkBtnContainer_.appendChild(shrinkImg);
    placementEl_.appendChild(shrinkBtnContainer_);
  }

  function setupCssClasses_() {
    placementEl_.classList.add('innity-apps-reset');
    placementEl_.classList.add('innity-apps-hvr-container');
    placementEl_.classList.add('with-transition');

    iframeEl_.classList.add('innity-apps-reset');
    iframeEl_.classList.add('innity-apps-hvr-iframe');
    iframeEl_.classList.add('with-transition');
  }

  function setupDragContainer_() {
    dragContainer_ = curDoc_.createElement('div');
    dragContainer_.classList.add('innity-apps-drag-container');

    placementEl_.appendChild(dragContainer_);
  }

  function setupIframeProperties_() {
    iframeEl_.setAttribute('allowfullscreen', 'true');
    iframeEl_.setAttribute('mozallowfullscreen', 'true');
    iframeEl_.setAttribute('webkitallowfullscreen', 'true');
    iframeEl_.setAttribute('scrolling', 'no');
  }

  function setupLoadingContainer_() {
    loadingContainer_ = curDoc_.createElement('div');
    loadingContainer_.classList.add('innity-apps-loading-container');

    let loadingImg = curDoc_.createElement('img');
    loadingImg.setAttribute('src', 'data:image/png;base64,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');
    loadingImg.setAttribute('alt', 'Loading');

    loadingContainer_.appendChild(loadingImg);
    moveContainer_.appendChild(loadingContainer_);
  }

  function setupMoveContainer_() {
    moveContainer_ = curDoc_.createElement('div');
    moveContainer_.classList.add('innity-apps-move-container');

    moveContainer_.appendChild(iframeEl_);
    moveContainer_.appendChild(closeBtnContainer_);
    placementEl_.appendChild(moveContainer_);
  }

  function setupPlayBtn_() {
    playBtnContainer_ = curDoc_.createElement('div');
    playBtnContainer_.classList.add('innity-apps-play-button-container');
    playBtnContainer_.classList.add('d-none');

    playBtnContainer_.addEventListener('click', onPlacementClick_);

    let playBtn = curDoc_.createElement('img');
    playBtn.setAttribute('src', 'data:image/png;base64,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');
    playBtn.setAttribute('alt', 'Play Button');

    playBtnContainer_.appendChild(playBtn);
    placementEl_.appendChild(playBtnContainer_);
  }

  function setupStyle_() {
    let styleElement = curDoc_.createElement('style');
    styleElement.setAttribute('data-owner', 'Innity');
    styleElement.innerHTML = '.innity-apps-reset{border:none;margin:0;padding:0}.innity-apps-hvr-container,.innity-apps-move-container{height:277px;width:156px}.innity-apps-hvr-container{background-color:rgba(100, 100, 100, .3);box-shadow:-3px 9px 9px rgba(0, 0, 0, .3);-webkit-box-shadow:-3px 9px 9px rgba(0,0,0,.3);border-radius:10px;bottom:10px;display:flex;left:10px;overflow:hidden;position:fixed;z-index:2147483645}.innity-apps-hvr-container.expanded{background-color:rgba(0,0,0,.8);box-shadow:none}.innity-apps-hvr-container.mobile{height:213px;width:120px}.innity-apps-hvr-container.mobile.expanded{overflow:auto}.innity-apps-hvr-container.expanded{border-radius:0;bottom:0;height:100%;left:0;width:100%}.innity-apps-hvr-container.shrink{border-radius:50px;bottom:81.5px;height:50px;left:35px;width:50px}.innity-apps-hvr-container.with-transition{transition:border-radius .5s ease, left .5s ease, bottom .5s ease, width .5s ease, height .5s ease}.innity-apps-loading-container{height:100%;width:100%}.innity-apps-loading-container img{left:36px;position:absolute;top:100px;width:50%;animation:rotation 1s infinite linear}.mobile .innity-apps-loading-container img{left:30;top:78px}@keyframes rotation{from{transform:rotate(0)}to{transform:rotate(359deg)}}.innity-apps-move-container{margin:auto;transition:height .5s ease, width .5s ease;position:relative}.innity-apps-hvr-iframe{height:100%;width:100%}.expanded .innity-apps-move-container{height:calc(640px + 13px);width:460px}.expanded.mobile .innity-apps-move-container{width:100%}.innity-apps-drag-container{background:rgba(0, 0, 0, .3);background:linear-gradient(180deg, rgba(0, 0, 0, .7) 0, rgba(0, 0, 0, .5) 20%, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0) 100%);cursor:move;height:40px;left:0;position:absolute;top:0;width:100%}.shrink .innity-apps-drag-container{height:25px}.mobile .innity-apps-drag-container{display:none}.innity-apps-close-container,.innity-apps-close-version-container,.innity-apps-shrink-container{cursor:pointer;position:absolute;width:30px}.innity-apps-close-container.top-left{left:52px;top:3px}.innity-apps-close-container.top-right{right:52px;top:3px}.innity-apps-close-version-container.top-right{right:2px;top:2px}.innity-apps-shrink-container.top-left{left:2px;top:2px}.innity-apps-shrink-container.top-right{right:2px;top:2px}.mobile .innity-apps-close-container.top-right{right:2px;top:2px}.innity-apps-close-container img, .innity-apps-close-version-container img, .innity-apps-shrink-container img{opacity: .7;user-select:none;-webkit-user-select:none;width:100%}.innity-apps-close-container:hover img, .innity-apps-close-version-container:hover img, .innity-apps-shrink-container:hover img{opacity:1}.innity-apps-play-button-container{height:100%;left:0;pointer-events:none;position:absolute;bottom:0;width:100%}.innity-apps-play-button-container img{user-drag:none;-webkit-user-drag:none;width:100%}.innity-apps-close-container,.innity-apps-close-version-container,.innity-apps-play-button-container,.innity-apps-shrink-container{z-index:2147483647}.d-none{display:none}';

    curDoc_.getElementsByTagName('body')[0].appendChild(styleElement);
    
    customPub_.injectStyle();

    log_('style element creation completed.');
  }

  // Private class section =====================================================

  function DragHandler_() {
    this.dragMove = dragMove;
    this.dragStart = dragStart;
    this.dragStop = dragStop;

    let currentX__ = 0;
    let currentY__ = 0;
    let initialX__ = 0;
    let initialY__ = 0;
    let isDragging__ = false;
    let platformDragHandler__ = null;

    initClass__();

    function initClass__() {
      if (getPlatform_() === 'other') {
        platformDragHandler__ = new DesktopDragHandler__();
      } else {
        platformDragHandler__ = new DummyDragHandler__();
      }
    }

    // Public function =========================================================

    function dragMove(x, y) {
      dragMove__(x, y);
    }

    function dragStart(x, y) {

      dragStart__(x, y);
    }

    function dragStop() {
      dragStop__();
    }

    // Private function ========================================================

    function dragStart__(x, y) {
      currentX__ = placementEl_.getBoundingClientRect().x;
      currentY__ = placementEl_.getBoundingClientRect().y;

      initialX__ = x;
      initialY__ = y;

      isDragging__ = true;
      placementEl_.classList.remove('with-transition');
    }

    function dragMove__(x, y) {
      if (isDragging__ === true) {
        currentX__ += x - initialX__;
        currentY__ += y - initialY__;

        platformDragHandler__.updateInitialCoordinate(x, y);

        placementEl_.style.left = currentX__ + 'px';
        placementEl_.style.bottom = (curWin_.innerHeight - currentY__ - placementEl_.offsetHeight) + 'px';

        if (x > curWin_.innerWidth || x < 0 || y > curWin_.innerHeight || y < 0) {
          dragStop__();
        }
      }
    }

    function dragStop__() {
      isDragging__ = false;

      let leftMidpoint = placementEl_.offsetLeft + (placementEl_.offsetWidth / 2);
      let topMidpoint = placementEl_.offsetTop + (placementEl_.offsetHeight / 2);

      if (leftMidpoint < curWin_.innerWidth / 2 && topMidpoint < curWin_.innerHeight / 2) {
        currentPosition_ = 'top-left';
      } else if (leftMidpoint > curWin_.innerWidth / 2 && topMidpoint < curWin_.innerHeight / 2) {
        currentPosition_ = 'top-right';
      } else if (leftMidpoint > curWin_.innerWidth / 2 && topMidpoint > curWin_.innerHeight / 2) {
        currentPosition_ = 'bottom-right';
      } else {
        currentPosition_ = 'bottom-left';
      }

      placementEl_.classList.add('with-transition');
      setPositions_();
    }

    function DesktopDragHandler__() {
      this.updateInitialCoordinate = updateInitialCoordinate;

      initClass___();

      function initClass___() {
        bindEvents___();
      }

      // Public function =======================================================

      function updateInitialCoordinate(x, y) {
        initialX__ = x;
        initialY__ = y;
      }

      // Private function ======================================================

      function bindEvents___() {
        dragContainer_.addEventListener('mousedown', onMouseDown___);
        curDoc_.addEventListener('mousemove', onMouseMove___);
        dragContainer_.addEventListener('mouseup', onMouseUp___);
        dragContainer_.addEventListener('click', onClick___);
      }

      function onClick___(e) {
        e.stopPropagation();
      }

      function onMouseDown___(e) {
        dragStart__(e.clientX, e.clientY);
      }

      function onMouseMove___(e) {
        e.preventDefault();

        dragMove__(e.clientX, e.clientY);
      }

      function onMouseUp___() {
        dragStop__();
      }
    }

    function DummyDragHandler__() {
      this.updateInitialCoordinate = updateInitialCoordinate;

      initClass___();

      function initClass___() {}

      // Public function =======================================================

      function updateInitialCoordinate(x, y) {}

      // Private function ======================================================

    }

  }

  function InnityAppsCustomPubs_() {
    this.injectStyle = injectStyle;

    initClass__();

    function initClass__() {
      customBehaviour__();
      customSetting__();
    }

    // Public Function Section =================================================

    function injectStyle() {
      customStyle__();
    }

    // Private Function Section ================================================

    function customBehaviour__() {}

    function customSetting__() {
      if (extraOptions_.tribunnews === true) {
        tribunnewsSetting___();
      }

      if (extraOptions_.thestar === true) {
        thestarStyle___();
      }

      function tribunnewsSetting___() {
        extraOptions_.bottom = 110;
      }

      function thestarStyle___() {
        extraOptions_.bottom = 60;
      }
    }

    function customStyle__() {}

  }

  function InnityAppsIframeBreaker() {
    initClass_();

    function initClass_() {
      if (extraOptions_.accessibleWindow !== null && extraOptions_.accessibleDocument !== null) {
        curWin_ = extraOptions_.accessibleWindow;
        curDoc_ = extraOptions_.accessibleDocument;
        log_('Window & Document were pass in by Proxy.');
      } else {
        throw 'accessibleWindow or accessibleDocument is null.';
      }
    }

    // Public function =========================================================

    // Private function ========================================================

  }

  // [MobileSupportOverrideStart]
  function InnityAppsMobilePlatform() {
    this.debug = debug;
    this.getBrowserName = getBrowserName;
    this.getBrowserVersion = getBrowserVersion;
    this.getOS = getOS;
    this.getOSVersion = getOSVersion;
    this.getVersion = getVersion;
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

    // Public function =========================================================

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
     * Detect iOS Skype in app browser.
     * @returns {Boolean} TRUE if is iOS Skype in app browser, else FALSE.
     */
    function isIosSkype() {
      return os_ === 'ios' && browserName_ === 'other';
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

    // Private function ========================================================

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
        var v = (navigator.userAgent).match(/OS (\d+)_(\d+)_?(\d+)?/);
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
  // [MobileSupportOverrideEnd]

}
