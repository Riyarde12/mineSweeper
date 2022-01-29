// 'use strict';

// function settingMinesOnBoard(board) {
//     // debugger
//     for (var i = 0; i < gLevel.mines; i++) {
//         var rowIdx = getRandomIntInclusive(0, board.length - 1);
//         var colIdx = getRandomIntInclusive(0, board.length - 1);
//         board[rowIdx][colIdx].isMine = true;
//         // console.log('board', board[rowIdx][colIdx]);
//     }
//     // renderBoard(gBoard, '.game-board');
// }

// function loseLife() {
//     gLevel.life--;
//     var elH3Life = document.querySelector('.difficult h3');
//     elH3Life.innerHTML = `${LIFE}:  ${gLevel.life}`;
// }