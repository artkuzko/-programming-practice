/**
 * Created by akuzko on 10/9/2015.
 */
function echo(anyData) {
    return console.log(anyData);
}

window.onload = function() {
    var lapView = document.getElementById('lapView');
    var sessionsView = document.getElementById('sampleSessions');
    var startBtn = document.getElementById('starter');
    var timer = document.getElementById('timer');
    var saveLapsBtn = document.getElementById('saveLap');
    var resetBtn = document.getElementById('reset');
    var saveSessionBtn = document.getElementById('saveSession');
    var sessionId;
    var savedLaps = localStorage.getItem(sessionId);
    //var sessionsArray = (localStorage.length !== 0) ? localStorage.key(sessionId) : [];
    var sessionsArray = [];
    var lapsArray = [];
    var ms = 0, min = 0, sec = 0, hours = 0, isTimerRunning = false, showSession = false;
    var endResult = '00:00:00:00';
    var startingPoint;
    timer.textContent = endResult;

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
    }

    for(var listItems = 0; listItems < lapsArray.length; listItems++){
        updateLapsList(lapsArray[listItems], listItems+1);
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

    function showSessions(sessionContent, sessionId) {
        var sessionList = document.createElement('ul');
        var sessionBlock;
        sessionList.innerHTML = '<li class="" data-sesssion-lap="' + sessionId + '"><a href="#">' + 'show session-' + sessionId+ '</a><ul class="sessionBlock" id="sessionBlock-' + sessionId+ '"></ul></li>';
        sessionsView.appendChild(sessionList);
        sessionBlock = document.getElementById('sessionBlock-' + sessionId);
        for(var mx = 0; mx < sessionContent.length; mx++) {
            var lapsList = document.createElement('li');
            lapsList.innerHTML = '<div class="list-lap" data-lap-num="' + mx + '"><span>'+ 'lap #: ' + mx + '</span>' + ' ' + sessionContent[mx] + '</div>';
            sessionBlock.appendChild(lapsList);
        }
    }

    startBtn.onclick = function () {
        toggleTimerRunning();
    };

    resetBtn.onclick = function () {
        resetTimer();
    };

    saveLapsBtn.onclick = function () {
        lapsArray.push(timer.innerText);
        updateLapsList(lapsArray[lapsArray.length -1], lapsArray.length);
    };

    saveSessionBtn.onclick = function () {
        sessionsArray.push(lapsArray);
        localStorage.setItem('sessions', JSON.stringify(sessionsArray));
    }
};