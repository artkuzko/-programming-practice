/**
 * Created by akuzko on 10/9/2015.
 */
function echo(anyData) {
    return console.log(anyData);
}

window.onload = function() {
    var lapsList = document.createElement('ul'); //create UL for inserting and displaying Laps you've ran
    var sessionList = document.createElement('ul');//-- create UL tag for displaying the running sessions within it
    var yourSessionsArchive = document.getElementById('yourSessionsArchive');
    var lapView = document.getElementById('lapView');
    var sessionsView = document.getElementById('sampleSessions');
    var popUpBlock = document.getElementById('popHover');
    var startBtn = document.getElementById('starter');
    var timeDisplay = document.getElementById('timer');
    var toolTip = document.getElementById('tooltip');
    var saveLapsBtn = document.getElementById('saveLap');
    var resetBtn = document.getElementById('reset');
    var saveSessionBtn = document.getElementById('saveSession');
    var loadSessionBtn = document.getElementById('loadSession');
    //var savedSessions = localStorage.getItem('sessions');
    var startingTime = '00:00:00:00';
    var lapsArray = [];
    var isTimerRunning;
    var startingPoint;
    var timer = {
        hours: 0,
        min: 0,
        sec: 0,
        ms: 0,
        setValue: function (h, m, s, ms) {
            this.hours = h;
            this.min = m;
            this.sec = s;
            this.ms = ms;
        },
        displayCurrValue: function () {
            var h = this.hours, m = this.min, s = this.sec, ms = this.ms;
            if(h < 10) {
                h = '0' + h;
            }
            if(m < 10) {
                m = '0' + m;
            }
            if(s < 10) {
                s = '0' + s;
            }
            if(ms < 10) {
                ms = '0' + ms;
            }
            timeDisplay.textContent = h + ':' + m + ':' + s + ':' + ms;
        },
        start: function () {
            var that = this;
            isTimerRunning = true;
            startingPoint = setInterval(function() {
                that.ms++;
                if(that.ms > 99) {
                    that.ms = 0;
                    that.sec++;
                }
                if(that.sec >= 60) {
                    that.sec = 0;
                    that.min++;
                }
                if(that.min >= 60) {
                    that.min = 0;
                    that.hours++;
                }
                that.displayCurrValue();
            }, 10);
        },
        pause: function () {
            clearInterval(startingPoint);
            isTimerRunning = false;
        },
        reset: function () {
            this.pause();
            clearLapsList();
            timer.setValue(0, 0, 0, 0);
            timer.displayCurrValue();
        },
        toggleIsRunning: function () {
            if(!isTimerRunning) {
                this.start();
            }
            else {
                this.pause();
            }
            checkButtonsCondition();
        }

    };

    var sessions = (function () {
        var saved = localStorage.getItem('sessions');
        var sessionStorage = (saved !== null) ? JSON.parse(saved) : [];
        return {
            saved: saved,
            sessionStorage: sessionStorage,
            showAll: function () {
                sessionList.innerHTML = '';
                for(var sessionId = 0; sessionId < this.sessionStorage.length; sessionId++) {
                    var runningSessionListItem = document.createElement('li');
                    runningSessionListItem.innerHTML = '<a href="#" class="sessionLink" data-session-index-="' + sessionId + '">' + 'show session-' + (sessionId + 1) +'</a><ul class="sessionBlock" id="sessionBlock-' + sessionId+ '"></ul>';
                    sessionList.appendChild(runningSessionListItem);
                }
                sessionsView.appendChild(sessionList);
            },

            showTarget: function (targetSession) {
                clearLapsList();
                for(var lapsId = 0; lapsId < this.sessionStorage[targetSession].length; lapsId++) {
                    addLap(this.sessionStorage[targetSession][lapsId], lapsId);
                    lapsArray.push(this.sessionStorage[targetSession][lapsId]);
                }
            },

            save: function() {
                /**
                 * Here we create a copy of lapsArray
                 * than we create a loop to check if the last Lap
                 * of the target session is unique. If it is not we return
                 * from the function.
                 * otherwise we just push a newLapsArray with the newly
                 * created lap in the end of the sessionsArray
                 */
                var newLapsArray = lapsArray.slice();
                for(var sessionAnchor = 0, sessionAmount = this.sessionStorage.length; sessionAnchor < sessionAmount; sessionAnchor++) {
                    for(var lapsAnchor = 0, lapsAmount = this.sessionStorage[sessionAnchor].length; lapsAnchor < lapsAmount; lapsAnchor++) {
                        if(this.sessionStorage[sessionAnchor][lapsAnchor] === newLapsArray[newLapsArray.length - 1]) {
                            return;
                        }
                    }
                }
                this.sessionStorage.push(newLapsArray);
                localStorage.setItem('sessions', JSON.stringify(this.sessionStorage));
                checkButtonsCondition();
            }
        }
    })();

    function checkButtonsCondition (){
        resetBtn.disabled = true;
        saveLapsBtn.disabled = true;
        saveSessionBtn.disabled = true;
        if(!isTimerRunning) {
            startBtn.textContent = 'Start';
            if(timeDisplay.textContent !== startingTime) {
                resetBtn.disabled = false;
                if(lapsArray[lapsArray.length -1] !== timeDisplay.textContent) {
                    saveLapsBtn.disabled = false;
                }
            }
        } else {
            startBtn.textContent = 'Pause';
            resetBtn.disabled = false;
            saveLapsBtn.disabled = false;
        }
        if(lapsArray.length > 0) {
            var saveSessionActive = true;
            for(var sessionAnchor = 0, sessionAmount = sessions.sessionStorage.length; sessionAnchor < sessionAmount; sessionAnchor++) {
                for(var lapsAnchor = 0, lapsAmount = sessions.sessionStorage[sessionAnchor].length; lapsAnchor < lapsAmount; lapsAnchor++) {
                    if(sessions.sessionStorage[sessionAnchor][lapsAnchor] === lapsArray[lapsArray.length - 1]) {
                        return saveSessionActive = false;
                    }
                }
            }
            if(!saveSessionActive) {
                saveSessionBtn.disabled = true;
            }
            saveSessionBtn.disabled = false;
        }
    }

    function togglePopUp (actionParam) {
        if(actionParam === 'hide') {
            toolTip.style.visibility = 'hidden';
            popUpBlock.style.visibility = 'hidden';
        } else {
            popUpBlock.style.visibility = 'visible';
            if (localStorage.getItem('sessions') === null) {
                toolTip.style.visibility = 'visible';
            }
        }
    }

    function clearLapsList () {
        lapsArray = [];
        lapsList.innerHTML = '';
    }

    function addLap (lapContent, lapId) {
        var lapsListItem = document.createElement('li');
        lapsListItem.innerHTML = '<p class="list-lap" data-lap-num="' + (lapId +1) + '"><span><strong>'+ 'lap #'+ (lapId +1) + ': ' + '</strong></span>' + lapContent + '</p>';
        lapsList.appendChild(lapsListItem);
        lapView.appendChild(lapsList);
    }

    startBtn.onclick = function () {
        timer.toggleIsRunning();
    };

    resetBtn.onclick = function () {
        timer.reset();
        checkButtonsCondition();
    };

    saveLapsBtn.onclick = function () {
        lapsArray.push(timeDisplay.innerText);
        addLap(lapsArray[lapsArray.length -1], lapsArray.length-1 );
        checkButtonsCondition();
    };

    saveSessionBtn.onclick = function () {
        sessions.save();
    };

    loadSessionBtn.onclick = function () {
        togglePopUp('show');
        sessions.showAll();
        checkButtonsCondition();
        timer.pause();
    };

    sessionsView.onclick = function(e) {
        if(e.target.getAttribute('class') === 'close' ) {
            if(startBtn.innerText === 'Pause') {
                timer.start();
            }
        } else if(e.target.getAttribute('class') === 'sessionLink'){
            var sessionIndex = e.target.getAttribute('data-session-index-');
            var frozenTime = sessions.sessionStorage[sessionIndex][(sessions.sessionStorage[sessionIndex].length - 1)].split(':');
            sessions.showTarget(sessionIndex);
            timer.setValue(+frozenTime[0], +frozenTime[1], +frozenTime[2], +frozenTime[3]);
            timer.displayCurrValue();
        } else {
            return;
        }

        if(e.target.getAttribute('class') !== null) {
            togglePopUp('hide');
        }
        checkButtonsCondition();
    };

    timer.displayCurrValue();
    timer.pause();
    checkButtonsCondition();
    togglePopUp('hide');
};