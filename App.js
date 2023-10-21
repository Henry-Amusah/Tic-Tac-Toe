'use strict';

const logo  = document.querySelector('.logo');
const infoBoard = document.querySelector('.player-turn-info');
const infoLogo = infoBoard.querySelector('.playerlogo');
const restartBtn = document.querySelector('.restart');

const gameBoard = document.querySelector('.body');
const gridContainer = gameBoard.querySelector('.grid');
const playerSelectBoard = document.querySelector('.player-select-board');
const playerSelectOption = document.querySelector('.player-select-option');
const newGameBtn = document.querySelector('.new-game');
const scoreBoard = document.querySelector('.score-board');

const popup = document.querySelector('.popup-wrapper');
const message1 = popup.querySelector('.msg-1');
const winnerIcon = popup.querySelector('.winner-icon');
const message2 = popup.querySelector('.msg-2');
const actionBtn1 = popup.querySelector('.actions .action-btn-1');
const actionBtn2 = popup.querySelector('.actions .action-btn-2');

const leftPlayerName = document.querySelector('.x-score-board .p1-name');
const rightPlayerName = document.querySelector('.o-score-board .p2-name');
const leftScoreValue = document.querySelector('.x-score-board .x-score-value');
const rightScoreValue = document.querySelector('.o-score-board .o-score-value');
const tieScoreValue = document.querySelector('.tied-score-value');

let leftScoreCount = Number(leftScoreValue.textContent);
let rightScoreCount = Number(rightScoreValue.textContent);
let tieScoreCount = Number(tieScoreValue.textContent);
leftScoreCount = 0;
tieScoreCount = 0;
rightScoreCount = 0;

let p1_symbol = 'O', p2_symbol, cpu_symbol;
let startSymbol = 'x';
let vs_cpu, vs_player;

class Game {
  constructor(){
    playerSelectOption.addEventListener('click', this.togglePlayerLogo.bind(this));
    newGameBtn.addEventListener('click', this.newGame.bind(this));
  }

  activatePlayer(bg, playerSymbol){
    bg.classList.add('bg-toggle');
    bg.classList.remove('bg-hover');
    bg.children[0].setAttribute('src', `assets/icon-${playerSymbol}-outline-white.svg`);
  }

  deactivatePlayer(bg, playerSymbol){
    bg.classList.remove('bg-toggle');
    bg.classList.add('bg-hover');
    bg.children[0].setAttribute('src', `assets/icon-${playerSymbol}-white.svg`);
  }


  togglePlayerLogo(e){
    let x_bg = document.querySelector('.x-mark'), o_bg = document.querySelector('.o-mark');
    const { target } = e;
    if(target.classList.contains('x-mark') || target.closest('.x-mark')){
      if(target.classList.contains('bg-hover') || target.closest('.x-mark').classList.contains('bg-hover')){
        this.activatePlayer(x_bg, 'x'); // Activate selected state for X player
        this.deactivatePlayer(o_bg, 'o'); // Deactivate selected state for O player
        p1_symbol = 'X';
      }
    } 
    if(target.classList.contains('o-mark') || target.closest('.o-mark')){
      if(target.classList.contains('bg-hover') || target.closest('.o-mark').classList.contains('bg-hover')){
        this.activatePlayer(o_bg, 'o'); // Activate selected state for O player
        this.deactivatePlayer(x_bg, 'x'); // Deactivate selected state for X player
        p1_symbol = 'O';
      }
    }
    //console.log(p1);
  }
  
  switchTurn(e){
    const { target } = e;
    if(target.childElementCount === 0 && target.getAttribute('src') === null){
      const markDisplay = document.createElement('img');
      markDisplay.setAttribute('src', `assets/icon-${startSymbol}.svg`);
      target.append(markDisplay);
      target.addEventListener('mouseenter', () => {
        if(target.children[0].getAttribute('src').includes('-o.svg')){
          target.children[0].setAttribute('src', `assets/icon-o-outline.svg`);
        } 
        if(target.children[0].getAttribute('src').includes('-x.svg')){
          target.children[0].setAttribute('src', `assets/icon-x-outline.svg`);
        }
      });
      target.addEventListener('mouseleave', () => {
        if(target.children[0].getAttribute('src').includes('-o-outline.svg')){
          target.children[0].setAttribute('src', `assets/icon-o.svg`)
        }
        if(target.children[0].getAttribute('src').includes('-x-outline.svg')){
          target.children[0].setAttribute('src', `assets/icon-x.svg`);
        }
      });
      startSymbol = startSymbol === 'x' ? 'o' : 'x';
      infoLogo.setAttribute('src', `assets/icon-${startSymbol}-white.svg`);
    }
    target.removeEventListener('click', this.switchTurn);
    this.checkWinner();
  }

  initGameBoard(){
    const grid = Array(9).fill('').forEach((cell, idx) => {
      const gridCell = document.createElement('div');
      gridCell.classList.add('cell');
      gridCell.id = idx;
      gridCell.addEventListener('click', this.switchTurn.bind(this));
      gridContainer.append(gridCell);
    });
  }


  newGame(e){
    const { target } = e;
    if(target.classList.contains('new-game-vs-cpu')){
      cpu_symbol = p1_symbol === 'X' ? 'O' : 'X';
      if(p1_symbol === 'X'){
        leftPlayerName.textContent = `${p1_symbol} (YOU)`;
        rightPlayerName.textContent = `${cpu_symbol} (CPU)`;
      }else {
        rightPlayerName.textContent = `${p1_symbol} (YOU)`;
        leftPlayerName.textContent = `${cpu_symbol} (CPU)`;
      }
      //alert(`playing with cpu with ${p1_symbol} as you and ${cpu_symbol} as cpu`);
      vs_cpu = true;
      vs_player = false;
    }
    if(target.classList.contains('new-game-vs-player')){
      p2_symbol = p1_symbol === 'X' ? 'O' : 'X';
      if(p1_symbol === 'X'){
        leftPlayerName.textContent = `${p1_symbol} (P1)`;
        rightPlayerName.textContent = `${p2_symbol} (P2)`;
      }else {
        rightPlayerName.textContent = `${p1_symbol} (P1)`;
        leftPlayerName.textContent = `${p2_symbol} (P2)`;
      }
      //alert(`playing with player with ${p1_symbol} as p1 and ${p2_symbol} as p2`);
      vs_player = true;
      vs_cpu = false;
    }
    leftScoreValue.textContent = leftScoreCount;
    tieScoreValue.textContent = tieScoreCount; 
    rightScoreValue.textContent = rightScoreCount;

    [scoreBoard, gridContainer, infoBoard, restartBtn].forEach(item => {
      item.classList.remove('hidden');
    });
    [newGameBtn, playerSelectBoard].forEach(item => {
      item.classList.add('hidden');
    });
    logo.classList.remove('center');

    this.initGameBoard();
  };

  checkWinner(){
    const gridCells = document.querySelectorAll('.cell');
    // let X_win, O_win;
    // console.log(gridCells[1].children[0].getAttribute('src').includes('icon-x.svg'));

    const winCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for(let combo of winCombinations){
      let X_win = combo.every(cell => {
        return gridCells[cell].children[0]?.getAttribute('src').includes('icon-x.svg');
      });

      let O_win = combo.every(cell => {
        return gridCells[cell].children[0]?.getAttribute('src').includes('icon-o.svg');
      });

      // Declaring win for X mark
      if(X_win){
        combo.forEach(cell => {
          // Highlighting win icons based on combo indexes
          gridCells[cell].style.backgroundColor = '#31C3BD';
          gridCells[cell].children[0].setAttribute('src', 'assets/icon-x-outline-white.svg');
        });
        console.log(`X wins with ${combo} combinations`);
        gridCells.forEach(cellElement => cellElement.replaceWith(cellElement.cloneNode(true)));
        leftScoreCount++;
        leftScoreValue.textContent = leftScoreCount;
        infoLogo.setAttribute('src', 'assets/icon-x-white.svg');
        popup.classList.remove('hidden');
        
        // checking if game is between player and cpu
        if(vs_cpu){
          if(cpu_symbol === 'X'){
            // cpu won against you with X mark
            message1.textContent = 'oh no, you lost...';
            winnerIcon.setAttribute('src', 'assets/icon-x.svg');
            message2.style.color = '#31C3BD';
            console.log(`Oh no, you lost...${cpu_symbol} takes the round or Cpu wins`)
          } else{
            // you won against cpu with X mark
            message1.textContent = 'you won!';
            winnerIcon.setAttribute('src', 'assets/icon-x.svg');
            message2.style.color = '#31C3BD';
            console.log(`you won ${p1_symbol} takes the round`)
          }
        } else{
          if(p1_symbol === 'X'){
            // player 1 won against player 2 with X mark
            message1.textContent = 'player 1 wins!';
            winnerIcon.setAttribute('src', 'assets/icon-x.svg');
            message2.style.color = '#31C3BD';
            console.log(`player 1 wins....${p1_symbol} takes the round`)
          } else{
            // player 2 won against player 1 with X mark
            message1.textContent = 'player 2 wins!';
            winnerIcon.setAttribute('src', 'assets/icon-x.svg');
            message2.style.color = '#31C3BD';
            console.log(`player 2 wins....${p2_symbol} takes the round`)
          }
        }
        return;
      }
      // Declaring win for O mark
      if(O_win){ 
        combo.forEach(cell => {
          //Highlighting win icons based on combo indexes
          gridCells[cell].style.backgroundColor = '#F2B137';
          gridCells[cell].children[0].setAttribute('src', 'assets/icon-o-outline-white.svg')
        });
        gridCells.forEach(cellElement => cellElement.replaceWith(cellElement.cloneNode(true)));
        rightScoreCount++;
        rightScoreValue.textContent = rightScoreCount;
        infoLogo.setAttribute('src', 'assets/icon-o-white.svg');
        popup.classList.remove('hidden');

        // checking if game is between player and cpu
        if(vs_cpu){
          if(cpu_symbol === 'O'){
            // cpu won against you with O mark
            message1.textContent = 'oh no, you lost...';
            winnerIcon.setAttribute('src', 'assets/icon-o.svg');
            message2.style.color = '#F2B137';
            console.log(`Oh no, you lost...${cpu_symbol} takes the round or Cpu wins`)
          } else{
            // you won against cpu with O mark
            message1.textContent = 'you won!';
            winnerIcon.setAttribute('src', 'assets/icon-o.svg');
            message2.style.color = '#F2B137';
            console.log(`you won ${p1_symbol} takes the round`)
          }
        } else{
          if(p1_symbol === 'O'){
            // player 1 won against player 2 with O mark
            message1.textContent = 'player 1 wins!';
            winnerIcon.setAttribute('src', 'assets/icon-o.svg');
            message2.style.color = '#F2B137';
            console.log(`player 1 wins....${p1_symbol} takes the round`)
          } else{
            // player 2 won against player 1 with O mark
            message1.textContent = 'player 2 wins!';
            winnerIcon.setAttr   // if(X_win === false && O_win === false){
    //   alert('tied')
    // }ibute('src', 'assets/icon-o.svg');
            message2.style.color = '#F2B137';
            console.log(`player 2 wins....${p2_symbol} takes the round`)
          }
        }
        console.log('O wins');
        return;
      } 
    };

    // Checking and declaring Tied round
    let tied = Array.from(gridCells).every(cell => {
      return cell.childElementCount > 0;
    });
    if(tied){
      gridCells.forEach(cellElement => cellElement.replaceWith(cellElement.cloneNode(true)));
      tieScoreCount++;
      tieScoreValue.textContent = tieScoreCount;
      popup.classList.remove('hidden');
      message1.classList.add('hidden');
      winnerIcon.classList.add('hidden');
      message2.style.color = '#A8BFC9';
      message2.textContent = 'Round tied';
      console.log('tied score');
    };

  };

  restartGame(){};
}

const game = new Game();