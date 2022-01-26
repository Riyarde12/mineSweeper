'use strict'

//TODO: global const and vars

// the model
var gBoard;

// this is an object by which the board size is set (in this case: 4x4 board and how many mines to put)
var gLevel;



const flag = '🎏'
const mine = '🧨'
const hint = '🕯️'
const life = '❤️'

var gGame;


// this is called when page loads

function initGame() {
    gBoard = buildBoard();
    renderBoard(gBoard, '.game-board');
    console.log('gBoard', gBoard);
}

// builds the board set mines at random locations Call setMentsNegesCount()
// return the created board 
function buildBoard() {
    // create the matrix:
    // debugger
    var board = createMat(4, 4);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell;

        }
    }
    board[0][1].isMine = true;
    board[1][0].isMine = true;
    return board
}

// render the board as a <table> to the page
function renderBoard(board) {
    var strHTMl = ``;
    for (var i = 0; i < board.length; i++) {
        strHTMl += `<tr>`
        for (var j = 0; j < board.length; j++) {
            strHTMl += `<td data-i="${i}" data-j="${j}" class="cell hidden" onclick="cellClicked(this,${i},${j})" 
            oncontextmenu="cellMarked(event)"></td>`
        }
        strHTMl += `</tr>`;
    }
    document.querySelector('.game-board').innerHTML = strHTMl;
}

// count mines around each cell and set the cell's minesAroundCount
function setMinesNegsCount(board, rowIdx, colIdx) {
    debugger
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
function cellClicked(elCell, i, j) {
    var currCell = gBoard[i][j];
    var minesAmount = setMinesNegsCount(gBoard, i, j);
    currCell.isShown = true;
    if (currCell.isMine) {
        elCell.innerHTML = `<span class="numbers">${mine}</span>`
    } else {
        elCell.innerHTML = `<span class="numbers">${minesAmount}</span>`;
    }
}

// called on right click to mark a cell (sespected to be a mine) 

// TODO: Search the web (and implement) how to hide the context menu on right click
function cellMarked() {

}

// game ends when all mines are marked, and the other cells are shown
function checkGameOver() {

}

// when user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.

// TODO: start with a basic implementation that only opens the non-mine 1st degree neighbors!
function expandShown(board, elCell, i, j) {

}


// drop mines on the board randomally:
function dropMinesOnBoard(gBoard) {
    var rowIdx = getRandomIntInclusive(gBoard.length);
    var colIdx = getRandomIntInclusive(gBoard.length);
    var currLvl = createDifficult(elBtn);
    for (var i = 0; i < levelEasy.mine; i++) {
        gBoard[rowIdx][colIdx].isMine = true;
    }
}

function createDifficult(elBtn) {
    var levelEasy = {
        size: 4,
        mines: 2
    }
    var levelMedium = {
        size: 8,
        mines: 12
    }
    var levelExpert = {
        size: 12,
        mines: 30
    }

    return
}