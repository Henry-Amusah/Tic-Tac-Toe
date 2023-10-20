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

  restartGame(){};
}

const game = new Game();