function chatClass() {
    this.start = startChat;

    var questions = [
        'How are you giving gifts to this Christmas?', //0
        'What do you consider in buying gifts?', //1
        'How do you describe his/her personality', //2
        'How do you describe his/her personality x 2', //3
    ];

    var answersText = [
        {name:'Parents', trackid:'an01'}, //0
        {name:'Partner', trackid:'an02'}, //1
        {name:'Friend', trackid:'an03'}, //2

        {name:'Value For Money', trackid:'an04'}, //3
        {name:'Functionality', trackid:'an05'}, //4
        {name:'Necessity', trackid:'an06'}, //5
        {name:'Packaging', trackid:'an07'}, //6

        {type:'image', name:'Calming Vibe', trackid:'an08'}, //7
        {name:'Romantic Vibe', trackid:'an09'}, //8
        {name:'Refreshing Vibe', trackid:'an10'}, //9
        {name:'Lavender Vanilla', trackid:'an11'}, //10
        {name:'Sakura & Waterlily', trackid:'an12'}, //11
        {name:'Ocean Escape', trackid:'an13'}, //12

        {name:'calmingvibe.png', clicktag:'clickTAG', trackid:'an14'}, //13
        {name:'romanticvibe.png', clicktag:'clickTAG1', trackid:'an15'}, //14
        {name:'refreshingvibe.png', clicktag:'clickTAG2', trackid:'an15'}, //15
        {name:'lavendarvanilla.png', clicktag:'clickTAG3', trackid:'an16'}, //16
        {name:'sakurawaterlily.png', clicktag:'clickTAG4', trackid:'an17'}, //17
        {name:'oceaneascape.png', clicktag:'clickTAG5', trackid:'an18'}, //18
    ];

    const daChatViewport_ = document.getElementById('chatViewport'), daChat = document.getElementById('chatContent');
    var ansId = 0, resultsText = [];
        curAnswerIndex = 0,
        userAnswers = [],
        scrollInterval = null;
    var trackPartly = [];
    // var trackPartly = ['lc01']; // location01, ...

    var _perChat = function() {
        var q = this.question.inner;
        var qtype = (typeof this.question.type !== 'undefined') ? this.question.type : '';
        var ans = this.answers;
        var container = daChat;
        var render = '';
        var delay = 0.4, rate = 0.2;
        var ansEls = [];

        if(qtype == 'image') {
            render = '<div class="question"><div class="answer-wrapper"><img class="answerImage" src="' + q + '" /></div></div><br>';
        } else {
            render = '<div class="question">' + q + '</div><br/>';
        }
        ans.forEach(function(el,i){
            var an = el.inner.name;
            var tid = el.inner.trackid;
            var type = (typeof el.type !== 'undefined') ? el.type : '';
            var to = el.to;
            var cssdelay = '-webkit-animation-delay:'+ (delay + (rate*i)) +'s;animation-delay:'+ (delay + (rate*i)) +'s';

            ansId++;
            var index = ansId;

            if(type == 'image') {
                render += '<div id="ans_' + index +'" class="answer" style="' + cssdelay +'"><img class="answerImage" src="' + an + '" /></div>';
            } else {
                render += '<div id="ans_' +  index +'" class="answer" style="' + cssdelay +'">' + an + '</div>';
            }
            
            ansEls.push({ind:index, value:to, tid:tid, msg:an});
        });
        container.insertAdjacentHTML('beforeend', render);

        ansEls.forEach(function(el,i){
            var siblings = [];
            for(var j=ansId;j>ansId-ans.length;j--) {
                if(j == el.ind) {continue;}
                siblings.push(j);
            };
            document.getElementById('ans_' + el.ind).addEventListener('click', handleAnswerSelection.bind({selected:el.ind,fn:el.value, siblings:siblings, tid:el.tid, msg:el.msg}), false);
        });
    };

    var _perResults = function() {
        var answer = this.clicktag.name;
        var imageSource = this.img.source;
        var container = daChat;
        var render = '';

        ansId++;
        var index = ansId;

        // render += '<div class="last-question">';
        // render += 'Yes! Yoodo\'s customisable mobile plans sound just right for you!</div><br>';
        render += '<div id="ans_' + index +'" class="last-answer">';
        // render += '<span>Opt for our hottest promo of <b>20GB for only RM20!</b></span>';
        render += '<img style="display:block;position:relative;" src="' + imageSource + '" />';
        // render += '<div id="link_' + index +'" class="link">Order your free SIM now!</div>';
        render += '</div>';

        container.insertAdjacentHTML('beforeend', render);
        document.getElementById('ans_' + index).addEventListener('click', handleResultSelection.bind({answer:answer}), false);
    };
    
    var initScrollY_ = 0;

    function startChat() {
        clearChat();
        presentQuestion(readyChats);
        bindTouchEvent();
    }

    function bindTouchEvent() {
        document.body.addEventListener('touchmove', (event)=>{
            event.stopPropagation();
            window.cancelAnimationFrame(scrollInterval);
        }, false);
        daChatViewport_.addEventListener('touchmove', (event)=>{
            event.stopPropagation();
            window.cancelAnimationFrame(scrollInterval);
            
            var userTouch_ = event.changedTouches ? event.changedTouches[0] : event;
            if(userTouch_.clientY < userTouch_.clientX || daChat.offsetHeight == daChatViewport_.offsetHeight) {
                event.preventDefault();
            }
        }, false);
    }
    
    function clearChat()
    {
        daChat.innerHTML = '';
	    ansId = 0;
        curAnswerIndex = 0;
        userAnswers = [];
        resultsText = [];
    }

    function presentQuestion(fn)
    {
        var typingDiv = document.createElement('div');
        typingDiv.id  = 'typing';
    
        var typingAnim = document.createElement('img');
        typingAnim.id = 'typing-anim';
        typingAnim.src = 'typing.svg';
    
        typingDiv.appendChild(typingAnim);
        daChat.appendChild(typingDiv);
        window.cancelAnimationFrame(scrollInterval);
        scrollToBottom(500);

        setTimeout(
            function() {
                daChat.removeChild(document.getElementById('typing'));
                if(typeof fn === 'function') {
                    fn();
                }
                scrollToBottom(500);
            }, 1000
        );
    }

    function readyChats() {
        var showresult = function(answer_) {
            return _perResults.bind({
                clicktag: {
                    name: answer_.clicktag || 'clickTAG'
                },
                img: {
                    source: answer_.name
                },
            });
        };

        /** Start from last question to first question */
        // Question 3
        var q1, q2, q3, q4;

        q4 = _perChat.bind({
            question:{inner:questions[3]}, 
            answers:[
                {inner:answersText[7], to: showresult(answersText[13])},
                {inner:answersText[8], to: showresult(answersText[14])},
                {inner:answersText[9], to: showresult(answersText[15])},
            ]
        });

        q3 = _perChat.bind({
            question:{inner:questions[2]}, 
            answers:[
                {inner:answersText[7], to: showresult(answersText[13])},
                {inner:answersText[8], to: showresult(answersText[14])},
                {inner:answersText[9], to: showresult(answersText[15])},
                {inner:answersText[10], to: showresult(answersText[16])},
                {inner:answersText[11], to: showresult(answersText[17])},
                {inner:answersText[12], to: showresult(answersText[18])},
            ]
        });

        q2 = _perChat.bind({
            question:{inner:questions[1]}, 
            answers:[
                {inner:answersText[3], to: q3},
                {inner:answersText[4], to: q3},
                {inner:answersText[5], to: q3},
                {inner:answersText[6], to: q3},
            ]
        });

        q1 = _perChat.bind({
            question:{inner:questions[0]}, 
            answers:[
                {inner:answersText[0], to: q2},
                {inner:answersText[1], to: q2},
                {inner:answersText[2], to: q2},
            ]
        });

        q1();
    }

    function handleAnswerSelection(evt) {
        evt.stopPropagation();

        var selectedAnswer = this.selected;
        var redirectFn = this.fn;
        var selectedSiblings = this.siblings;
        var trackingId = this.tid;
        var selectedMessage = this.msg;
        var selectTarget = document.getElementById('ans_' + selectedAnswer);

        resultsText[resultsText.length] = selectedMessage;
        
        for(var i=0; i<selectedSiblings.length; i++)
        {
            document.getElementById('ans_' + selectedSiblings[i]).removeEventListener('click', handleAnswerSelection, false);
            document.getElementById('ans_' + selectedSiblings[i]).style.display = 'none';
        }
        
        if(trackPartly.length > 0) {
            if(trackPartly.indexOf(trackingId) > -1) {
                trackedAnswer(trackingId);
            }
        } else {
            trackedAnswer(trackingId);
        }

        userAnswers[curAnswerIndex++] = trackingId;

        var classlists = selectTarget.className.split(' ');
        if(classlists.indexOf('answer') > -1) {
            selectTarget.className = 'selectedAnswer';
        };
        
        presentQuestion(redirectFn);
    }

    function handleResultSelection(evt) {
        evt.stopPropagation();

        var selectedAnswer= this.answer;

        InnityHTMLAd.click({clickTAG:selectedAnswer});
    }

    function scrollToBottom(scrollDuration) {
        const   scrollHeight = daChatViewport_.scrollTop,
                scrollStep = Math.PI / ( scrollDuration / 15 ),
                cosParameter = daChatViewport_.scrollHeight / 2;
        var     scrollCount = 0, scrollMargin, currentScrollTop = 0;
        var     maxScrollTopDescrepency = -2; /** To ensure detected max scroll top is not more than actual reach end scroll top */

        var     doScrollToBottom = function(){
                    if ( Math.ceil(daChatViewport_.scrollTop) >= daChatViewport_.scrollHeight - daChatViewport_.offsetHeight + maxScrollTopDescrepency) { 
                        window.cancelAnimationFrame(scrollInterval);
                        return;
                    } 
                    scrollCount += 1;  
                    scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep );
                    daChatViewport_.scrollTop = daChatViewport_.scrollTop + scrollMargin;
                    currentScrollTop = daChatViewport_.scrollTop + scrollMargin;
                    scrollInterval = window.requestAnimationFrame(doScrollToBottom);
                }
        
        window.cancelAnimationFrame(scrollInterval);    
        scrollInterval = window.requestAnimationFrame(doScrollToBottom);
    }

    function trackedAnswer(id) {
        // Create User Journey Track
        //var previousTrack = (userAnswers.length == 1) ? userAnswers[0] + '_' : '' + userAnswers.join('_');
        //if(userAnswers.length > 1) {previousTrack += '_';}
        //InnityHTMLAd.track(previousTrack + id);

        InnityHTMLAd.track(id);
    };

    function arrangeUserResults(arr) {
        if(arr.length < questions.length) {
            return '' + arr[1] + ',' + arr[0];
        }
        return arr[1] + ' ' + arr[2] + ', ' + arr[0];
    };
}

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;


