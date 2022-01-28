'use strict'

//TODO: global const and vars
const FLAG = '🎏';
const MINE = '🧨';
const HINT = '🕯️';
const LIFE = '❤️';
const EMPTY = '';

// the model
var gBoard;

// this is an object by which the board size is set (in this case: 4x4 board and how many mines to put)

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gIsFirstClick;

// this is called when page loads

function initGame(level) {
    switch (level) {
        case "easy":
            gLevel.size = 4;
            gLevel.mines = 2;
            break;
        case "medium":
            gLevel.size = 8;
            gLevel.mines = 12;
            break;
        case "expert":
            gLevel.size = 12
            gLevel.mines = 30;
            break;
    }
    gBoard = buildBoard();
    renderBoard(gBoard, '.game-board');
    gGame.isOn = true;
    gIsFirstClick = true;
    console.log('gBoard', gBoard);
}

// builds the board set mines at random locations Call setMentsNegesCount()
// return the created board 
function buildBoard() {
    // create the matrix:
    var board = createMat(gLevel.size, gLevel.size);
    console.log('gLevel', gLevel);
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell;
        }
    }
    for (var i = 0; i < gLevel.mines; i++) {
        var rowIdx = getRandomIntInclusive(0, board.length - 1);
        var colIdx = getRandomIntInclusive(0, board.length - 1);
        board[rowIdx][colIdx].isMine = true;
        console.log('board', board[rowIdx][colIdx]);
    }
    return board
}

// render the board as a <table> to the page
function renderBoard(board) {
    var strHTMl = ``;
    for (var i = 0; i < board.length; i++) {
        strHTMl += `<tr>`
        for (var j = 0; j < board.length; j++) {
            strHTMl += `<td data-i="${i}" data-j="${j}" class="cell hidden" onclick="cellClicked(this,${i},${j})" 
            oncontextmenu="cellMarked(this,${i},${j},)"></td>`
        }
        strHTMl += `</tr>`;
    }
    document.querySelector('.game-board').innerHTML = strHTMl;
}

// count mines around each cell and set the cell's minesAroundCount
function setMinesNegsCount(board, rowIdx, colIdx) {
    board.minesAroundCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var cell = board[i][j];
            if (cell.isMine) board.minesAroundCount++;
        }
    }
    return board.minesAroundCount;
}

// called when a cell (td) is clicked
function cellClicked(elCell, i, j,) {
    if (!gGame.isOn) return;
    if (gBoard[i][j].isMarked) return;
    if (gGame.isOn) {
        if (gIsFirstClick) {
            startStopWatch();
            gIsFirstClick = false;
        }
        var currCell = gBoard[i][j];
        var minesAmount = setMinesNegsCount(gBoard, i, j);
        var currCell = gBoard[i][j];
        if (currCell.isMine) {
            elCell.innerHTML = `<span class="numbers">${MINE}</span>`;
            getShownOn(false, i, j);
            checkGameOver(true);
            return;
        } else {
            elCell.innerHTML = `<span class="numbers">${minesAmount}</span>`;
            if (minesAmount === 0) {
                blowUpNeighbors(i, j, gBoard);
            }
            getShownOn(true, i, j);
        }
    }
}


function blowUpNeighbors(cellI, cellJ, board) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var cell = board[i][j];
            var minesAmount = setMinesNegsCount(gBoard, i, j);
            if (!cell.isMine) {
                // Update the Model:
                board[i][j].isShown = true;
                // Update the Dom:
                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                elCell.innerHTML = `${minesAmount}`;

            }
        }
    }
}

// called on right click to mark a cell (sespected to be a mine) 

// TODO: Search the web (and implement) how to hide the context menu on right click
function cellMarked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gGame.isOn) {
        if (gIsFirstClick) {
            startStopWatch();
            gIsFirstClick = false;
        }
        if (!gBoard[i][j].isMarked) {
            elCell.innerHTML = `<span class="numbers">${FLAG}</span>`;
            gBoard[i][j].isMarked = true;
            gGame.markedCount++;
        } else {
            elCell.innerHTML = `<span class="numbers">${EMPTY}</span>`;
            gBoard[i][j].isMarked = false;
        } gGame.markedCount--;
    }
}

function getShownOn(isShownAll, i, j) {
    // debugger
    var clickedCell = gBoard[i][j];
    gGame.shownCount++;
    if (isShownAll === false) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                var currCell = gBoard[i][j];
                // var currElCell = elCells[i];
                // currCell.isShown = true;
                if (currCell.isMine) {
                    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                    elCell.innerHTML = `<span class="numbers">${MINE}</span>`;
                }

            }
        }
    }
    else {
        clickedCell.isShown = true;
    }
    checkGameOver(false);
}

// game ends when all mines are marked, and the other cells are shown
function checkGameOver(clickedOnMine) {
    var elCells = document.querySelectorAll('.cell');
    // gGame.markedCount: this is the counter for winning
    if (clickedOnMine) {
        checkWinLose(false);
        // console.log('elCells', elCells);
        // for (var i = 0; i < elCells.length; i++) {
        //     var currElCell = elCells[i];
        //     console.log('currElCell', currElCell);
        //     if (currElCell === FLAG) flagsOnMine++;
        // }
    }
    if ((gGame.shownCount - gLevel.mines) === (gBoard.length * gLevel.size) - gLevel.mines) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                var currCellCheck = gBoard[i][j];
                if (currCellCheck.isMine && currCellCheck.isMarked) {
                    checkWinLose(true);
                } else {
                    checkWinLose(false);
                }
            }
        }
    }
}
// when user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.

// TODO: start with a basic implementation that only opens the non-mine 1st degree neighbors!
function expandShown(board, elCell, i, j) {

}
