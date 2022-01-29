'use strict';

const FLAG = '🎏';
const MINE = '🧨';
const HINT = '🕯️';
const LIFE = '❤️';
const EMPTY = '';
const SMILE_WIN = '😎';
const SMILE_BOMBED = '🤯';
const SMILE_NORMAL = '😐';
const SMILE_DEAD = '☠️';

// the model
var gBoard;

// this is an object by which the board size is set (in this case: 4x4 board and how many mines to put)
var gLevel = {
    size: 4,
    mines: 2,
    life: 0
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    hints: 0
};

var gIsFirstClick;
var gHintInterval;

// this is called when page loads
function initGame() {
    smileNormal();
    gBoard = buildBoard();
    renderBoard(gBoard, '.game-board');
    gGame.isOn = true;
    gIsFirstClick = true;
    settingMinesOnBoard(gBoard);
}

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
    return board;
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

function settingMinesOnBoard(board) {
    for (var i = 0; i < gLevel.mines; i++) {
        var rowIdx = getRandomIntInclusive(0, board.length - 1);
        var colIdx = getRandomIntInclusive(0, board.length - 1);
        board[rowIdx][colIdx].isMine = true;
    }
}

// count mines around each cell and set the cell's minesAroundCount
function checkMinesNegsCount(board, rowIdx, colIdx) {
    board.minesAroundCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var cell = board[i][j];
            if (cell.isMine) board.minesAroundCount++;
            // counterCellsAround++
        }
    }
    return board.minesAroundCount;
}

// called when a cell (td) is clicked
function cellClicked(elCell, i, j,) {
    if (!gGame.isOn) return;

    if (gBoard[i][j].isMarked) return;
    if (gGame.isOn) {
        var minesAmount = checkMinesNegsCount(gBoard, i, j);
        if (gIsFirstClick) {
            startStopWatch();
            gIsFirstClick = false;
            var elCellFirstClick = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            // update Model:
            gBoard[i][j].isMine = false;
            // update DOM:
            elCellFirstClick.innerHTML = `<span class="numbers">${minesAmount}</span>`;
        }
        var currCell = gBoard[i][j];
        var currCell = gBoard[i][j];
        if (currCell.isMine) {
            elCell.innerHTML = `<span class="numbers">${MINE}</span>`;
            getShownOn(false, i, j);
            loseLife();
            smileBombed();
            checkGameOver(true);
            return;
        } else {
            elCell.innerHTML = `<span class="numbers">${minesAmount}</span>`;
            if (minesAmount === 0) {
                gGame.shownCount++;
                elCell.style.backgroundColor = "rgb(92, 89, 89)";
                expandShown(i, j, gBoard);
            } else {
                gGame.shownCount++;
                var elH1ShowCount = document.querySelector('.showen-count')
                elH1ShowCount.innerHTML = `Steps: ${gGame.shownCount}`;
                elCell.style.backgroundColor = "rgb(92, 89, 89)";
            }
            smileNormal();
            getShownOn(true, i, j);
        }
    }
}

function expandShown(cellI, cellJ, board) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var cell = board[i][j];
            var minesAmount = checkMinesNegsCount(gBoard, i, j);
            if (!cell.isMine && !board[i][j].isShown && !board[i][j].isMarked) {
                // Update the Model:
                if (!gBoard[i][j].isShown) gGame.shownCount++;
                gBoard[i][j].isShown = true;
                // Update the Dom:
                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                elCell.innerHTML = `${minesAmount}`;
                elCell.style.backgroundColor = "rgb(92, 89, 89)";
            }
        }
    }
    var elH1ShowCount = document.querySelector('.showen-count')
    elH1ShowCount.innerHTML = `Steps: ${gGame.shownCount}`;
}

// called on right click to mark a cell (sespected to be a mine) 
function cellMarked(elCell, i, j) {
    if (!gGame.isOn) return;
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    if (gBoard[i][j].isShown) return
    if (gGame.isOn) {
        if (gIsFirstClick) {
            startStopWatch();
            gIsFirstClick = false;
        }
        if (!gBoard[i][j].isMarked) {
            elCell.innerHTML = `<span class="numbers">${FLAG}</span>`;
            gBoard[i][j].isMarked = true;
            gGame.markedCount++;
            checkGameOver(false);
            return;
        } else {
            elCell.innerHTML = `<span class="numbers">${EMPTY}</span>`;
            gBoard[i][j].isMarked = false;
        } gGame.markedCount--;
    }
}

// expose the cells - gBoard.isShowen, and the mines.
function getShownOn(isMineClicked, i, j) {
    // debugger
    var clickedCell = gBoard[i][j];

    if (isMineClicked === false && gLevel.life === 0) {
        for (var i = 0; i < gLevel.size; i++) {
            for (var j = 0; j < gLevel.size; j++) {
                var currCell = gBoard[i][j];
                if (currCell.isMine) {
                    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                    elCell.innerHTML = `<span class="numbers">${MINE}</span>`;
                    checkGameOver(true);
                }
            }
        }
    }
    else {
        // gGame.shownCount++;
        clickedCell.isShown = true;
    }
    checkGameOver(false);
}

// game ends when all mines are marked, and the other cells are shown
function checkGameOver(clickedOnMine) {
    // debugger

    // check if winning only on medium and expert "mode"
    if (clickedOnMine && gLevel.life === 0) {
        checkWinLose(false);
    }
    // check universal checking lose
    if (gGame.shownCount === (gLevel.size ** 2 - gLevel.mines) && gGame.markedCount === gLevel.mines) {
        checkWinLose(true);
        return
    }
    // check if win:
    if (gGame.shownCount === (gLevel.size ** 2 - gLevel.mines)) {
        if (!gGame.markedCount === gLevel.mines) {
            checkWinLose(false);
        }
    }
}

function loseLife() {
    if (gLevel.size === 4) gLevel.life = null;
    else {
        gLevel.life--;
        var elH3Life = document.querySelector('.difficult h3');
        elH3Life.innerHTML = `${LIFE}:  ${gLevel.life}`;
    }
}

function smileNormal() {
    var elSpanSmile = document.querySelector('.smile');
    elSpanSmile.innerHTML = `${SMILE_NORMAL}`;
}

function smileBombed() {
    var elSpanSmile = document.querySelector('.smile');
    elSpanSmile.innerHTML = `${SMILE_BOMBED}`;
}

function smileWin() {
    var elSpanSmile = document.querySelector('.smile');
    elSpanSmile.innerHTML = `${SMILE_WIN}`;
}

function smileDead() {
    var elSpanSmile = document.querySelector('.smile');
    elSpanSmile.innerHTML = `${SMILE_DEAD}`;
}

function showCountToUser() {
    var elH1ShowCount = document.querySelector('.showen-count')
    elH1ShowCount.innerHTML = `Steps: ${gGame.shownCount}`;
}

function chooseLevel(level) {
    if (!gIsFirstClick) return;
    resetGame();
    smileNormal();
    var elStartStopTime = document.querySelector('.start-stop');
    var elH3Life = document.querySelector('.difficult h3');
    elH3Life.innerHTML = '';
    switch (level) {
        case "easy":
            gLevel.size = 4;
            gLevel.mines = 2;
            endStopWatch();
            gLevel.life = 0;
            elStartStopTime.innerHTML = `Time:`;
            elH3Life.innerHTML = '';
            renderBoard(gBoard, '.game-board');
            break;
        case "medium":
            gLevel.size = 8;
            gLevel.mines = 12;
            gLevel.life = 3;
            gLevel.hints = 3;
            endStopWatch();
            elStartStopTime.innerHTML = `Time:`
            elH3Life.innerHTML = `${LIFE}:  ${gLevel.life}`;
            renderBoard(gBoard, '.game-board');
            break;
        case "expert":
            gLevel.size = 12;
            gLevel.mines = 30;
            gLevel.life = 3;
            gLevel.hints = 3;
            endStopWatch();
            elStartStopTime.innerHTML = `Time:`
            elH3Life.innerHTML = `${LIFE}:  ${gLevel.life}`;
            renderBoard(gBoard, '.game-board');
            break;
    }
    gBoard = buildBoard();
    renderBoard(gBoard, '.game-board');
    gGame.isOn = true;
    gIsFirstClick = true;
    settingMinesOnBoard(gBoard);
}