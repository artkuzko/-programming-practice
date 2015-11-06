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
    var savedSessions = localStorage.getItem('sessions');
    var sessionsArray = (localStorage.getItem('sessions')!== null) ? JSON.parse(savedSessions) : [];
    var timer = {
        hours: 0,
        min: 0,
        sec: 0,
        ms: 0,
        setTimerValue: function (h, m, s, ms) {
            this.hours = h;
            this.min = m;
            this.sec = s;
            this.ms = ms;
        },
        displayTimerCurrValue: function () {
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
        }
    };
    var startingTime = '00:00:00:00';
    var lapsArray = [];
    //var isTimerRunning = false;
    var isTimerRunning;
    var startingPoint;
    toolTip.style.visibility = 'hidden';
    popUpBlock.style.visibility = 'hidden';

    timer.displayTimerCurrValue();

    function pauseTheTimer() {
        clearInterval(startingPoint);
        isTimerRunning = false;
    }
    pauseTheTimer();
    function toggleTimerRunning() {
        if(!isTimerRunning) {
            startTimer();
        }
        else {
            pauseTheTimer();
        }
        checkButtonsCondition();
    }

    function checkButtonsCondition (){
        resetBtn.disabled = true;
        saveLapsBtn.disabled = true;
        saveSessionBtn.disabled = true;

        if(isTimerRunning === false) {
            startBtn.textContent = 'Start';
            if(timeDisplay.textContent !== startingTime) {
                resetBtn.disabled = false;
                if(lapsArray[lapsArray.length -1] !== timeDisplay.textContent) {
                    saveLapsBtn.disabled = false;
                }
            }
        }
        else {
            startBtn.textContent = 'Pause';
            resetBtn.disabled = false;
            saveLapsBtn.disabled = false;
        }
        if(lapsArray.length > 0) {
            var saveSessionActive = true;
            for(var sessionAnchor = 0, sessionAmount = sessionsArray.length; sessionAnchor < sessionAmount; sessionAnchor++) {
                for(var lapsAnchor = 0, lapsAmount = sessionsArray[sessionAnchor].length; lapsAnchor < lapsAmount; lapsAnchor++) {
                    if(sessionsArray[sessionAnchor][lapsAnchor] === lapsArray[lapsArray.length - 1]) {
                        return saveSessionActive = false;
                    }
                }
            }
            if(saveSessionActive === false) {
                saveSessionBtn.disabled = true;
            }
            saveSessionBtn.disabled = false;
        }
    }

    checkButtonsCondition();

    function clearLapsList () {
        lapsArray = [];
        lapsList.innerHTML = '';
    }

    function startTimer () {
        isTimerRunning = true;
        startingPoint = setInterval(function() {
            timer.ms++;
            if(timer.ms > 99) {
                timer.ms = 0;
                timer.sec++;
            }
            if(timer.sec >= 60) {
                timer.sec = 0;
                timer.min++;
            }
            if(timer.min >= 60) {
                timer.min = 0;
                timer.hours++;
            }
            timer.displayTimerCurrValue();
        }, 10);
    }

    function resetTimer() {
        pauseTheTimer();
        clearLapsList();
        timer.setTimerValue(0, 0, 0, 0);
        timer.displayTimerCurrValue();
    }

    function addLap (lapContent, lapId) {
        var lapsListItem = document.createElement('li');
        lapsListItem.innerHTML = '<p class="list-lap" data-lap-num="' + (lapId +1) + '"><span><strong>'+ 'lap #'+ (lapId +1) + ': ' + '</strong></span>' + lapContent + '</p>';
        lapsList.appendChild(lapsListItem);
        lapView.appendChild(lapsList);
    }

    function showSessions (sessionArray) {
        sessionList.innerHTML = '';
        for(var sessionId = 0; sessionId < sessionArray.length; sessionId++) {
            var runningSessionListItem = document.createElement('li');
            runningSessionListItem.innerHTML = '<a href="#" class="sessionLink" data-session-index-="' + sessionId + '">' + 'show session-' + (sessionId + 1) +'</a><ul class="sessionBlock" id="sessionBlock-' + sessionId+ '"></ul>';
            sessionList.appendChild(runningSessionListItem);
        }
        sessionsView.appendChild(sessionList);
    }

    startBtn.onclick = function () {
        toggleTimerRunning();
    };

    resetBtn.onclick = function () {
        resetTimer();
        checkButtonsCondition();
    };

    saveLapsBtn.onclick = function () {
        lapsArray.push(timeDisplay.innerText);
        addLap(lapsArray[lapsArray.length -1], lapsArray.length-1 );
        checkButtonsCondition();
    };

    /**
     * Here we create a copy of lapsArray
     * than we create a loop to check if the last Lap
     * of the target session is unique. If it is not we return
     * from the function.
     * otherwise we just push a newLapsArray with the newly
     * created lap in the end of the sessionsArray
     */
    saveSessionBtn.onclick = function () {
        var newLapsArray = lapsArray.slice();
        for(var sessionAnchor = 0, sessionAmount = sessionsArray.length; sessionAnchor < sessionAmount; sessionAnchor++) {
            for(var lapsAnchor = 0, lapsAmount = sessionsArray[sessionAnchor].length; lapsAnchor < lapsAmount; lapsAnchor++) {
                if(sessionsArray[sessionAnchor][lapsAnchor] === newLapsArray[newLapsArray.length - 1]) {
                    return;
                }
            }
        }
        sessionsArray.push(newLapsArray);
        localStorage.setItem('sessions', JSON.stringify(sessionsArray));
        checkButtonsCondition();
    };

    loadSessionBtn.onclick = function () {
        popUpBlock.style.visibility = 'visible';
        if(localStorage.getItem('sessions') === null) {
            popUpBlock.style.visibility = 'visible';
            toolTip.style.visibility = 'visible';
        }
        showSessions(sessionsArray);
        checkButtonsCondition();
        pauseTheTimer();
    };

    sessionsView.onclick = function(e) {
        if(e.target.getAttribute('class') === 'close' ) {
            if(localStorage.getItem('sessions') === null) {
                toolTip.style.visibility = 'hidden';
                popUpBlock.style.visibility = 'hidden';
            } else {
                popUpBlock.style.visibility = 'hidden';
            }
            if(startBtn.innerText === 'Pause') {
                startTimer();
            }
        }
        else if(e.target.getAttribute('class') !== null && e.target.getAttribute('class') !== 'close'){
            var targetMatchWithSessionNumber = e.target.getAttribute('data-session-index-');
            var frozenTime = sessionsArray[targetMatchWithSessionNumber][(sessionsArray[targetMatchWithSessionNumber].length - 1)].split(':');
            clearLapsList();
            for(var lapsId = 0; lapsId < sessionsArray[targetMatchWithSessionNumber].length; lapsId++) {
                addLap(sessionsArray[targetMatchWithSessionNumber][lapsId], lapsId);
                lapsArray.push(sessionsArray[targetMatchWithSessionNumber][lapsId]);
            }
            timer.setTimerValue(+frozenTime[0], +frozenTime[1], +frozenTime[2], +frozenTime[3]);
            timer.displayTimerCurrValue();
            popUpBlock.style.visibility = 'hidden';
        }
        checkButtonsCondition();
    };
};