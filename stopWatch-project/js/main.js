/**
 * Created by akuzko on 10/9/2015.
 */
function echo(anyData) {
    return console.log(anyData);
}

window.onload = function() {
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
    var sessionList = document.createElement('ul');//-- created UL tag for displaying the running sessions within it
    var savedSessions = localStorage.getItem('sessions');
    var sessionsArray = (localStorage.getItem('sessions')!== null) ? JSON.parse(savedSessions) : [];
    var lapsArray = [];
    var ms = 0, min = 0, sec = 0, hours = 0, isTimerRunning = false;
    var endResult = '00:00:00:00';
    var startingPoint;
    timer.textContent = endResult;
    toolTip.style.display = 'none';
    popUpBlock.style.visibility = 'hidden';
    resetBtn.disabled = true;
    saveLapsBtn.disabled = true;
    saveSessionBtn.disabled = true;

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
        checkButtnsCondition();
    }

    function checkButtnsCondition (){
        toolTip.style.display = 'none';
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

    function startTimer() {
        startingPoint = setInterval(function () {
            ms++;
            if(ms > 99) {
                ms = 0;
                sec++;
                if(sec > 0 && sec < 10) {
                    sec =  '0' + sec;
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

    function updateLapsList(lapContent, lapId) {
        var lapsList = document.createElement('ul');
        lapsList.innerHTML = '<li class="list-lap" data-lap-num="' + lapId + '"><span>'+ 'lap #: ' + lapId + '</span>'+ ' ' + lapContent + '</li>';
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
        updateLapsList(lapsArray[lapsArray.length -1], lapsArray.length);
        checkButtnsCondition();
    };

    saveSessionBtn.onclick = function () {
        var newLapsArray = lapsArray.slice();
        if(sessionsArray.length > 0) {
            if(sessionsArray[sessionsArray.length - 1].join() === lapsArray.join()) {
                return false;
            } else {
                sessionsArray.push(newLapsArray);
            }
        }
        else if(sessionsArray.length === 0) {
            sessionsArray.push(newLapsArray);
        }
        localStorage.setItem('sessions', JSON.stringify(sessionsArray));
        checkButtnsCondition();
    };

    loadSessionBtn.onclick = function () {
        popUpBlock.style.visibility = 'visible';
        if(localStorage.getItem('sessions') === null) {
            toolTip.style.display = 'block';
        }
        universalSessionsShowcase(sessionsArray);
        checkButtnsCondition();
    };

    sessionsView.onclick = function(e) {
        if(e.target.getAttribute('class') === 'close' ) {
            echo('close');
        }
        else if(e.target.getAttribute('class') !== null && e.target.getAttribute('class') !== 'close'){
            lapView.innerHTML = '';
            var targetMatchWithSessionNumber = e.target.getAttribute('data-session-index-');
            for(var lapsId = 0; lapsId < sessionsArray[targetMatchWithSessionNumber].length; lapsId++) {
                var runningLapListItem = document.createElement('li');
                runningLapListItem.innerHTML = '<span><strong>'+ 'lap #' + (lapsId + 1) + ': ' + '</strong>' +  sessionsArray[targetMatchWithSessionNumber][lapsId] + '</span>';
                lapView.appendChild(runningLapListItem);
            }
        }
        popUpBlock.style.visibility = 'hidden';

    };


};