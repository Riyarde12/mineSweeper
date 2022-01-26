'use strict'


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

// function getDefaultGameObj() {
//     return {
//         foodOnBoard: 0,
//         score: 0,
//         isOn: false
//     }
// }

function checkWinLose(isWin) {
    document.querySelector('.modal').style.display = 'block';
    document.querySelector('.renew').style.display = 'block';
    var elH1Msg = document.querySelector('.msg');
    var msg = (isWin) ? 'VICTORY!!!' : 'YOU LOSE!';
    elH1Msg.innerText = msg
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

// count negs
// function countFoodAround(mat, rowIdx, colIdx) {
//     var count = 0
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i > mat.length - 1) continue
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j < 0 || j > mat[0].length - 1) continue
//             if (i === rowIdx && j === colIdx) continue
//             var currCell = mat[i][j]
//             if (currCell === '$') count++
//         }
//     }
//     return count
// }

// function startStopWatch() {
//     gWatchInterval = setInterval(updateWatch, 1)
//     gStartTime = Date.now()
// }