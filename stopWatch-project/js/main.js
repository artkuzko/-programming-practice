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
    var lapsArray = [];
    var ms = 0, min = 0, sec = 0, hours = 0, isTimerRunning = false;
    var endResult = '00:00:00:00';
    var startingPoint;
    timer.textContent = endResult;
    toolTip.style.visibility = 'hidden';
    popUpBlock.style.visibility = 'hidden';
    resetBtn.disabled = true;
    saveLapsBtn.disabled = true;
    saveSessionBtn.disabled = true;

    function toggleTimerRunning() {
        if(!isTimerRunning) {
            if(timer.textContent === lapsArray[lapsArray.length -1]) {
                var frozenTime = lapsArray[lapsArray.length -1].split(':');
                continueTimer(frozenTime);
                isTimerRunning = true;
                startBtn.innerText = 'Pause';
            }
            else if(timer.textContent !== lapsArray[lapsArray.length -1] || timer.textContent === endResult) {
                startTimer();
                isTimerRunning = true;
                startBtn.innerText = 'Pause';
            }
        }
        else {
            clearInterval(startingPoint);
            isTimerRunning = false;
            startBtn.innerText = 'Start';
        }
        checkButtnsCondition();
    }

    function checkButtnsCondition (){
        if(isTimerRunning === true && lapsArray.length === 0){
            resetBtn.disabled = false;
            saveLapsBtn.disabled = false;
        }
        else if(timer.textContent !== endResult && isTimerRunning === false && lapsArray.length === 0) {
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

            if(timer.textContent === lapsArray[lapsArray.length -1]) {
                saveSessionBtn.disabled = false;
            }
        }

        else {
            resetBtn.disabled = true;
            saveLapsBtn.disabled = true;
            saveSessionBtn.disabled = true;
        }
    }

    function continueTimer(currTimerResult) {
        ms = currTimerResult[3];
        sec = currTimerResult[2];
        min = currTimerResult[1];
        hours = currTimerResult[0];
        startTimer();
    }

    function startTimer() {
        startingPoint = setInterval(function () {
            ms++;
            if(ms>0 && ms < 10) {
                ms = '0' + ms;
            }
            if(ms > 99) {
                ms = 0;
                sec++;
                if(sec >= 0 && sec < 10) {
                    sec = '0' + sec;
                }
            }
            if (sec >= 60) {
                sec = 0;
                min++;
                if(min > 0 && min < 10) {
                    min = '0' + min;
                }
            }
            if(min >= 60) {
                min = 0;
                hours++;
                if(hours > 0 && hours < 10) {
                    hours = '0' + hours;
                }
            }
            if(ms === 0) {
                ms = '00';
            }
            if(sec === 0) {
                sec = '00';
            }
            if(min === 0) {
                min = '00';
            }
            if(hours === 0) {
                hours = '00';
            }
            timer.textContent = hours + ':' + min + ':' + sec + ':' + ms ;

        } ,10);
    }

    function resetTimer() {
        clearInterval(startingPoint);
        isTimerRunning = false;
        startBtn.innerText = 'Start';
        ms = 0;
        sec = 0;
        min = 0;
        hours = 0;
        timer.textContent = endResult;
        lapsArray= [];
        var archiveLaps = document.getElementsByClassName('list-lap');
        for(var i = 0; i < archiveLaps.length; i++){
            archiveLaps[i].parentNode.removeChild(archiveLaps[i]);
            i--;
        }
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
        checkButtnsCondition();
    };

    saveLapsBtn.onclick = function () {
        lapsArray.push(timer.innerText);
        updateLapsItem(lapsArray[lapsArray.length -1], lapsArray.length-1 );
        checkButtnsCondition();
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
        checkButtnsCondition();
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
        checkButtnsCondition();
    };

    sessionsView.onclick = function(e) {
        if(e.target.getAttribute('class') === 'close' ) {
            if(localStorage.getItem('sessions') === null) {
                toolTip.style.visibility = 'hidden';
                popUpBlock.style.visibility = 'hidden';
            } else {
                popUpBlock.style.visibility = 'hidden';
            }
            if(timer.textContent !== endResult && isTimerRunning === false) {
                if(startBtn.innerText === 'Pause') {
                    toggleTimerRunning();
                }
            }
        }
        else if(e.target.getAttribute('class') !== null && e.target.getAttribute('class') !== 'close'){
            lapsList.innerHTML = '';
            var targetMatchWithSessionNumber = e.target.getAttribute('data-session-index-');
            lapsArray = [];
            for(var lapsId = 0; lapsId < sessionsArray[targetMatchWithSessionNumber].length; lapsId++) {
                updateLapsItem(sessionsArray[targetMatchWithSessionNumber][lapsId], lapsId);
                lapsArray.push(sessionsArray[targetMatchWithSessionNumber][lapsId]);
            }
            resetBtn.disabled = false;
            saveLapsBtn.disabled = true;
            startBtn.innerText = 'Start';
            timer.textContent = sessionsArray[targetMatchWithSessionNumber][sessionsArray[targetMatchWithSessionNumber].length - 1];
            popUpBlock.style.visibility = 'hidden';
        }
    };
};