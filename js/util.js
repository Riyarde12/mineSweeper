'use strict'

var gWatchInterval;
var gStartTime;

function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

// Select the elCell and set the value
function renderCell(location, value) {
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

// get an random number max inclusive
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function checkWinLose(isWin) {
    if (isWin) {
        console.log('Victory');
    } else {
        console.log('GameOver');
    }
    gGame.isOn = false;
    endStopWatch();
}

function toggleGame(elBtn) {
    // console.log('gGameInterval', gGameInterval)
    if (gGameInterval) {
        clearInterval(gGameInterval)
        gGameInterval = null;
        elBtn.innerText = 'Start';
    } else {
        gGameInterval = setInterval(play, GAME_FREQ);
        elBtn.innerText = 'Pause';
    }
}

function startStopWatch() {
    gWatchInterval = setInterval(updateWatch, 1);
    gStartTime = Date.now();
}

function updateWatch() {
    var now = Date.now()
    var time = ((now - gStartTime) / 1000).toFixed(3)
    var elTime = document.querySelector('.start-stop')
    elTime.innerHTML = time;
}

function endStopWatch() {
    clearInterval(gWatchInterval)
    gWatchInterval = null;
}