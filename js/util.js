'use strict';

var gWatchInterval;
var gStartTime;

function createMat(ROWS, COLS) {
    var mat = [];
    for (var i = 0; i < ROWS; i++) {
        var row = [];
        for (var j = 0; j < COLS; j++) {
            row.push('');
        }
        mat.push(row);
    }
    return mat
}

// get an random number max inclusive
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkWinLose(isWin) {
    var elH1Msg = document.querySelector('.msg');
    var msg = (isWin) ? 'VICTORY!!!' : 'YOU LOSE!';
    elH1Msg.innerText = msg;
    gGame.isOn = false;
    if (!isWin) smileDead()
    endStopWatch();
}

function startStopWatch() {
    gWatchInterval = setInterval(updateWatch, 1);
    gStartTime = Date.now();
}

function updateWatch() {
    var now = Date.now();
    var time = ((now - gStartTime) / 1000).toFixed(3);
    var elTime = document.querySelector('.start-stop');
    elTime.innerHTML = `Time: ${time}`;
}

function endStopWatch() {
    clearInterval(gWatchInterval);
    gWatchInterval = null;
}

function resetGame() {
    endStopWatch();
    initGame();
    gIsFirstClick = true;
    var elSpanSmile = document.querySelector('.smile');
    if (!elSpanSmile.classList.contains('.choose-lvl')) {
        // elSpanSmile.classList.add('.choose-lvl')
        elSpanSmile.innerHTML = 'Choose Your Level';
    }
    gLevel = {
        size: 4,
        mines: 2,
        life: 0
    };

    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        hints: 0
    };
    showCountToUser();
}