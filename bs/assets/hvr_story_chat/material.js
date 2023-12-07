let innityAppsMaterials = [
  {id: 'innity-apps-heavy-ad-container', childs: [
    // {id: 'video-compressed', elType: 'video', attrs: {preload: 'metadata', playsinline: '', autoplay: '', loop: 'true', muted: 'true'}, childs: [
    //   {elType: 'source', attrs: {src: 'video1-compressed.mp4'}}
    // ]},
    {id: 'compressed-video-overlay', cssClass: ['compressed-video-overlay', 'd-none']},
  ]},

  {id: 'innity-apps-invitation-container', cssClass:['bs-invitation-container','shrinked'], childs:[
    {elType:'img', cssClass:['small-background'], attrs:{src:'banner_1.png','width':156,'height':277}},
    {cssClass:['ring-profile-icon']},
    {cssClass:['small-profile-icon'], childs:[
      {elType:'img', attrs:{src:'inviicon.png'}}
    ]},
    {cssClass:['notification-icon'], childs:[
      {cssClass:['dots'], childs:[
        {cssClass:['dot']},{cssClass:['dot']},{cssClass:['dot']}
      ]}
    ]},
    {cssClass:['cta-chatnow'], innerHTML:'Chat Now'},
  ]},

  {id: 'innity-apps-creative-loading-container', cssClass: ['innity-apps-creative-loading-container', 'd-none'], childs: [
    {elType: 'img', attrs: {src: 'loading.png'}}
  ]},
  // {cssClass: ['innity-apps-story-container', 'type-video'], attrs: {'data-time-track': 'frame1', 'data-video-name': 'video1', 'data-poster-name': 'video1.png', 'data-clicktag': 'clickTAG'}, childs: [
  //   {id: 'video-container-1', cssClass: ['video-container-wrapper'], clickTag: 'clickTAG'}
  // ]},
  {cssClass: ['innity-apps-story-container', 'type-image'], attrs: {'data-time-track': 'frame1'}, childs: [
    {cssClass:['innity-apps-story-content'], childs:[
      {elType: 'img', cssClass:['background'], attrs: {src:'exp_bg.jpg'}, clickTag: 'clickTAG'},
      {id:'chatViewport', cssClass:['chat-viewport'], childs:[
        {id:'chatContent'}
      ]}
    ]}
  ]},

  {id: 'timeline-table-container', cssClass: ['timeline-table-container', 'd-none'], childs: [
    {elType: 'div', childs: [
      {elType: 'span', cssClass: ['timeline-cell'], childs: [
        {elType: 'b', cssStyle: {'animationDuration': '20s'}}
      ]},
    ]}
  ]},

  {id: 'innity-apps-drag-container', cssClass: ['innity-apps-drag-container']}
];

let innityAppsIsFirstElemementVideo = false; // default is true. Change to false if the first element is an image

/* 
Temporary docs for HVR Story.
--------------------------------------
If the element inside innity-apps-story-container is an image, please use ['type-image'].
If the element inside innity-apps-story-container is a video, please use ['type-video'].

Remember to change the {'animationDuration': '5s'} if you change the element from video to image.
By default, the image will show for 5 seconds, if you wish to change this, customization is required on JS.
--------------------------------------
*/
