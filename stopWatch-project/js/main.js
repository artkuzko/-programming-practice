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
    var timer = document.getElementById('timer');
    var toolTip = document.getElementById('tooltip');
    var saveLapsBtn = document.getElementById('saveLap');
    var resetBtn = document.getElementById('reset');
    var saveSessionBtn = document.getElementById('saveSession');
    var loadSessionBtn = document.getElementById('loadSession');
    var savedSessions = localStorage.getItem('sessions');
    var sessionsArray = (localStorage.getItem('sessions')!== null) ? JSON.parse(savedSessions) : [];
    var timerObj = {
        hours: 0,
        min: 0,
        sec: 0,
        ms: 0
    };
    var startingTime = '00:00:00:00';
    var lapsArray = [];
    var isTimerRunning = false;
    var ms, sec, min, hours;
    var startingPoint, startingTime;
    toolTip.style.visibility = 'hidden';
    popUpBlock.style.visibility = 'hidden';
    resetBtn.disabled = true;
    saveLapsBtn.disabled = true;
    saveSessionBtn.disabled = true;

    function setTimerCurrentValue(h, m, s, ms) {
        timerObj.hours = h;
        timerObj.min = m;
        timerObj.sec = s;
        timerObj.ms = ms;

    }

    function displayTimerCurrentValue() {
        if(timerObj.ms === 0) {
            timerObj.ms = '00';
        }
        if(timerObj.sec === 0) {
            timerObj.sec = '00';
        }
        if(timerObj.min === 0) {
            timerObj.min = '00';
        }
        if(timerObj.hours === 0) {
            timerObj.hours = '00';
        }
        timer.textContent = timerObj.hours + ':' + timerObj.min + ':' + timerObj.sec + ':' + timerObj.ms;
    }
    setTimerCurrentValue(timerObj.hours, timerObj.min, timerObj.sec, timerObj.ms);
    displayTimerCurrentValue();

    /**
     * Here we declare and immediately invoke function, that will return us the current timer value.
     * Before the timer starts, it sets the starting value for the timer.
     * When the timer starts, function enters another condition to check, whether the laps array, sessions array aren't empty
     * and timer is not running, to set the timer value equal to the last lapsArray element
     * and return the timer value;
     * */

    //function retrieveCurrentTimerValue() {
    //    if(timer.textContent === '') {
    //        ms= 0; sec = 0; min = 0; hours = 0;
    //        startingTime = '00:00:00:00';
    //        return timer.textContent = startingTime;
    //    }
    //    else {
    //        if(lapsArray.length > 0 && sessionsArray.length > 0  && isTimerRunning === false) {
    //            var frozenTime = lapsArray[lapsArray.length - 1].split(':');
    //            ms = frozenTime[3];
    //            sec = frozenTime[2];
    //            min = frozenTime[1];
    //            hours = frozenTime[0];
    //        }
    //        return timer.textContent = hours + ':' + min + ':' + sec + ':' + ms;
    //    }
    //
    //}

    //retrieveCurrentTimerValue();

    function toggleTimerRunning() {
        if(!isTimerRunning) {
            startTimer();
            isTimerRunning = true;
            startBtn.innerText = 'Pause';
        }
        else {
            clearInterval(startingPoint);
            isTimerRunning = false;
            startBtn.innerText = 'Start';
        }
        checkButtonsCondition();
    }

    function checkButtonsCondition (){
        if(isTimerRunning === true && lapsArray.length === 0){
            resetBtn.disabled = false;
            saveLapsBtn.disabled = false;
        }
        else if(timer.textContent !== startingTime && isTimerRunning === false && lapsArray.length === 0) {
            echo(timer.textContent === startingTime);
            resetBtn.disabled = false;
            saveLapsBtn.disabled = false;
        }

        else if (isTimerRunning === false && lapsArray.length > 0){
            resetBtn.disabled = false;
            saveLapsBtn.disabled = false;
            if(timer.textContent === lapsArray[lapsArray.length -1]) {
                saveLapsBtn.disabled = true;
                saveSessionBtn.disabled = false;
            }
        }

        else if(isTimerRunning === true && lapsArray.length > 0) {
            resetBtn.disabled = false;
            saveLapsBtn.disabled = false;

            if(timer.textContent === lapsArray[lapsArray.length - 1]) {
                saveSessionBtn.disabled = false;
            }
        }

        else {
            resetBtn.disabled = true;
            saveLapsBtn.disabled = true;
            saveSessionBtn.disabled = true;
        }
    }

    function addStartingZero(timerParam) {
        echo(timerParam);
        if(timerParam >= 0 && timerParam < 10) {
            timerParam = '0' + timerParam;
            echo(timerParam);
            return timerParam;
        }
    }

    function startTimer () {
        startingPoint = setInterval(function() {
            timerObj.ms++;
            if(timerObj.ms > 0 && timerObj.ms < 10) {
                timerObj.ms = '0' + timerObj.ms;
            }
            if(timerObj.ms > 99) {
                timerObj.ms = 0;
                timerObj.sec++;
                if(timerObj.sec >= 0 && timerObj.sec < 10) {
                    timerObj.sec = '0' + timerObj.sec;
                }
            }
            if (timerObj.sec >= 60) {
                timerObj.sec = 0;
                timerObj.min++;
                if(timerObj.min >= 0 && timerObj.min < 10) {
                    timerObj.min = '0' + timerObj.min;
                }
            }
            if(timerObj.min >= 60) {
                timerObj.min = 0;
                timerObj.hours++;
                if(timerObj.hours >= 0 && timerObj.hours < 10) {
                    timerObj.hours = '0' + timerObj.hours;
                }
            }
            displayTimerCurrentValue();
            timerObj.ms++;
        }, 10);
    }

    function resetTimer() {
        clearInterval(startingPoint);
        isTimerRunning = false;
        startBtn.innerText = 'Start';
        setTimerCurrentValue(0, 0, 0, 0);
        displayTimerCurrentValue();
        lapsArray= [];
        lapsList.innerHTML = '';
    }

    function updateLapsItem(lapContent, lapId) {
        var lapsListItem = document.createElement('li');
        lapsListItem.innerHTML = '<p class="list-lap" data-lap-num="' + (lapId +1) + '"><span><strong>'+ 'lap #'+ (lapId +1) + ': ' + '</strong></span>' + lapContent + '</p>';
        lapsList.appendChild(lapsListItem);
        lapView.appendChild(lapsList);
    }

    function universalSessionsShowcase (sessionArray) {
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
        lapsArray.push(timer.innerText);
        updateLapsItem(lapsArray[lapsArray.length -1], lapsArray.length-1 );
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
                    echo(sessionAnchor + '--' + lapsAnchor + '---' + 'flag check (1)');
                    return;
                } else {
                    echo(sessionAnchor + '--' + lapsAnchor + '---' + 'flag check (2)');
                }
            }
        }
        sessionsArray.push(newLapsArray);
        localStorage.setItem('sessions', JSON.stringify(sessionsArray));
        checkButtonsCondition();
    };

    loadSessionBtn.onclick = function () {
        isTimerRunning = false;
        clearInterval(startingPoint);

        popUpBlock.style.visibility = 'visible';
        if(localStorage.getItem('sessions') === null) {
            popUpBlock.style.visibility = 'visible';
            toolTip.style.visibility = 'visible';
        }
        universalSessionsShowcase(sessionsArray);
        checkButtonsCondition();
    };

    sessionsView.onclick = function(e) {
        if(e.target.getAttribute('class') === 'close' ) {
            if(localStorage.getItem('sessions') === null) {
                toolTip.style.visibility = 'hidden';
                popUpBlock.style.visibility = 'hidden';
            } else {
                popUpBlock.style.visibility = 'hidden';
            }
            if(timer.textContent !== startingTime && isTimerRunning === false) {
                if(startBtn.innerText === 'Pause') {
                    toggleTimerRunning();
                }
            }
        }
        else if(e.target.getAttribute('class') !== null && e.target.getAttribute('class') !== 'close'){
            var targetMatchWithSessionNumber = e.target.getAttribute('data-session-index-');
            lapsList.innerHTML = '';
            lapsArray = [];
            for(var lapsId = 0; lapsId < sessionsArray[targetMatchWithSessionNumber].length; lapsId++) {
                updateLapsItem(sessionsArray[targetMatchWithSessionNumber][lapsId], lapsId);
                lapsArray.push(sessionsArray[targetMatchWithSessionNumber][lapsId]);
            }
            resetBtn.disabled = false;
            saveLapsBtn.disabled = true;
            startBtn.innerText = 'Start';
            popUpBlock.style.visibility = 'hidden';
        }
    };
};