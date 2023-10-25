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

// let gridCells;

// let leftScoreCount = Number(leftScoreValue.textContent);
// let rightScoreCount = Number(rightScoreValue.textContent);
// let tieScoreCount = Number(tieScoreValue.textContent);
// leftScoreCount = 0;
// tieScoreCount = 0;
// rightScoreCount = 0;

let gameScores = {
  leftScoreCount: Number(leftScoreValue.textContent),
  rightScoreCount: Number(rightScoreValue.textContent),
  tieScoreCount: Number(tieScoreValue.textContent)
}

let p1_symbol = 'O', p2_symbol, cpu_symbol;
let startSymbol = 'x';
let vs_cpu, vs_player;

class Game {
  constructor(){
    playerSelectOption.addEventListener('click', this.togglePlayerLogo.bind(this));
    newGameBtn.addEventListener('click', this.newGame.bind(this));
    // actionBtn1.addEventListener('click', this.endGame);
    // actionBtn2.addEventListener('click', () => location.reload());
    restartBtn.addEventListener('click', this.restartGame);
    //window.addEventListener('DOMContentLoaded', () => this.loadGameState());

    let data = window.performance.getEntriesByType('navigation')[0].type;
    if(data === 'reload'){
      this.loadGameState();
      console.log('Page reloaded')
    }
    console.log(data);
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
    // if(vs_cpu) this.cpuPlay(cpu_symbol.toLocaleLowerCase());
    target.removeEventListener('click', this.switchTurn);
    this.checkWinner();
  }

  cpuPlay(player){
    const markDisplay = document.createElement('img');
    //player = p1_symbol === 'x' ? 'o' : 'x';
    markDisplay.setAttribute('src', `assets/icon-${player}.svg`);
    this.bestSpot().append(markDisplay);
    //infoLogo.setAttribute('src', `assets/icon-${p1_symbol}-white.svg`)
  }

  emptySpot(){
    return Array.from(gridCells).filter(cell => cell.childElementCount < 1);
  }

  bestSpot(){
    return this.emptySpot()[0];
  }

//   document.addEventListener("DOMContentLoaded", (event) => {
//   const inGame = loadData()
//   if(inGame){ // true
// // fetch array elements and render
//   }else {

//   }
//   console.log("DOM fully loaded and parsed");
// });

  initGameBoard(){
    const grid = Array(9).fill('').forEach((cell, idx) => {
      const gridCell = document.createElement('div');
      gridCell.classList.add('cell');
      gridCell.id = idx;
      gridCell.addEventListener('click', this.switchTurn.bind(this));
      gridContainer.append(gridCell);
      //console.log(gridContainer.innerHTML)
      //console.log(gridCells)
      // localStorage.setItem('cells', gridContainer.innerHTML);
      // console.log(gridCell)
    });
  }

  restartGame(){
    message1.remove();
    winnerIcon.remove();
    message2.innerHTML = 'Restart game?'
    message2.style.color = '#A8BFC9'
    popup.classList.remove('hidden');
    actionBtn1.textContent = 'No, cancel';
    actionBtn2.textContent = 'Yes, restart';

    popup.addEventListener('click', e => {
      if(e.target.textContent === 'No, cancel'){
        popup.classList.add('hidden');
        console.log('game continues');
      }
      if(e.target.textContent === 'Yes, restart'){
        location.reload();
        console.log('game starts');
      }
    })
    //location.reload();
  }

  endGame(){
    localStorage.clear();
    location.reload();
  }

  newGame(e){
    const { target } = e;
    if(target.classList.contains('new-game-vs-cpu')){
      cpu_symbol = p1_symbol === 'X' ? 'O' : 'X';
      if(p1_symbol === 'X'){
        // localStorage.setItem('p1_symbol', p1_symbol)
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

    [scoreBoard, gridContainer, infoBoard, restartBtn].forEach(item => {
      item.classList.remove('hidden');
    });
    [newGameBtn, playerSelectBoard].forEach(item => {
      item.classList.add('hidden');
    });
    logo.classList.remove('center');

    this.initGameBoard();
    this.saveGameState();

   let { leftScoreCount, tieScoreCount, rightScoreCount } = JSON.parse(localStorage.getItem('gameScores'));
    leftScoreValue.textContent = leftScoreCount;
    tieScoreValue.textContent = tieScoreCount; 
    rightScoreValue.textContent = rightScoreCount;
  };

  saveGameState(){
    let visibleElement = [scoreBoard, gridContainer, infoBoard, restartBtn].every(element => {
      return element.classList.contains('hidden');
    });
    if(!visibleElement){
      localStorage.setItem('visibleElement', true);
    } else{
      localStorage.removeItem('visibleElement');
    }

    let hiddenElement = [newGameBtn, playerSelectBoard].every(element => {
      return element.classList.contains('hidden');
    });
    if(hiddenElement){
      localStorage.setItem('hiddenElement', true);
    } else{
      localStorage.removeItem('hiddenElement');
    }

    let centeredLogo = logo.classList.contains('center');
    if(!centeredLogo){
      localStorage.setItem('centeredLogo', true);
    } else{
      localStorage.removeItem('centeredLogo');
    }

    if(gridContainer.innerHTML){
      localStorage.setItem('grid', gridContainer.innerHTML);
    }

    if(vs_cpu){
      let playerState = {
        cpu_symbol: p1_symbol === 'X' ? 'O' : 'X',
        p1_symbol: cpu_symbol === 'X' ? 'O': 'X',
        vs_cpu
      }
      localStorage.setItem('playerState', JSON.stringify(playerState));
    } else{
      let playerState = {
        p1_symbol: p2_symbol === 'X' ? 'O' : 'X',
        p2_symbol: p1_symbol === 'X' ? 'O' : 'X',
        vs_player
      }
      localStorage.setItem('playerState', JSON.stringify(playerState));
    }

    localStorage.setItem('gameScores', JSON.stringify(gameScores));
    //localStorage.setItem('gridCells', JSON.stringify(gridCells))
    // localStorage.setItem('cells', gridContainer.innerHTML);
    
  }

  loadGameState(){
    if(localStorage.getItem('visibleElement')){
      [scoreBoard, gridContainer, infoBoard, restartBtn].forEach(element => {
        element.classList.remove('hidden');
      });
    }

    if(localStorage.getItem('hiddenElement')){
      [newGameBtn, playerSelectBoard].forEach(element => {
        element.classList.add('hidden');
      });
    }

    if(localStorage.getItem('centeredLogo')){
      logo.classList.remove('center');
    }

    if(localStorage.getItem('playerState')){
      let playerState = JSON.parse(localStorage.getItem('playerState'));
      if(playerState.vs_cpu){
        if(playerState.p1_symbol === 'X'){
          leftPlayerName.textContent = `${playerState.p1_symbol} (YOU)`;
          rightPlayerName.textContent = `${playerState.cpu_symbol} (CPU)`;
        } else{
          rightPlayerName.textContent = `${playerState.p1_symbol} (YOU)`;
          leftPlayerName.textContent = `${playerState.cpu_symbol} (CPU)`;
        }
      } else{
        if(playerState.p1_symbol === 'X'){
          leftPlayerName.textContent = `${playerState.p1_symbol} (P1)`;
          rightPlayerName.textContent = `${playerState.p2_symbol} (P2)`;
        } else{
          rightPlayerName.textContent = `${playerState.p1_symbol} (P1)`;
          leftPlayerName.textContent = `${playerState.p2_symbol} (P2)`;
        }
      }
    }

    if(localStorage.getItem('gameScores')){
      let gameScores = JSON.parse(localStorage.getItem('gameScores'));
      leftScoreValue.textContent = `${gameScores.leftScoreCount}`;
      rightScoreValue.textContent = `${gameScores.rightScoreCount}`;
      tieScoreValue.textContent = `${gameScores.tieScoreCount}`;
    }

    if(localStorage.getItem('grid')){
      let grid = localStorage.getItem('grid');
      
      //grid.addEventListener('click', this.switchTurn.bind(this))
      gridContainer.innerHTML = grid;
      let gridCells = gridContainer.querySelectorAll('.cell')
      gridCells.forEach(cell => cell.addEventListener('click', this.switchTurn.bind(this)));
    }

    //gridContainer.innerHTML = localStorage.getItem('cells')
  }

  fetchGameScore(){
    return JSON.parse(localStorage.getItem('gameScores'));
  }
  updateGameScore(gameScores){
    localStorage.setItem('gameScores', JSON.stringify(gameScores));
  }
  fetchPlayerState(){
    return JSON.parse(localStorage.getItem('playerState'));
  }

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

        let gameScores = this.fetchGameScore();
        // gameScores.leftScoreCount += 1;
        leftScoreValue.textContent = gameScores.leftScoreCount += 1;
        this.updateGameScore(gameScores);
        console.log(gameScores);

        infoLogo.setAttribute('src', 'assets/icon-x-white.svg');
        
        // checking if game is between player and cpu
        const playerState = this.fetchPlayerState();
        const { vs_cpu, p1_symbol, cpu_symbol } = playerState;
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
        popup.classList.remove('hidden');
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

        let gameScores = this.fetchGameScore();
        rightScoreValue.textContent = gameScores.rightScoreCount += 1;
        this.updateGameScore(gameScores);
        console.log(gameScores);

        infoLogo.setAttribute('src', 'assets/icon-o-white.svg');

        // checking if game is between player and cpu
        const playerState = this.fetchPlayerState();
        const { vs_cpu, p1_symbol, cpu_symbol } = playerState;
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
            winnerIcon.setAttribute('src', 'assets/icon-o.svg');   
            message2.style.color = '#F2B137';
            console.log(`player 2 wins....${p2_symbol} takes the round`)
          }
        }
        popup.classList.remove('hidden');
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
      let gameScores = this.fetchGameScore();
        tieScoreValue.textContent = gameScores.tieScoreCount += 1;
        this.updateGameScore(gameScores);
       
        // Display popup
        message1.classList.add('hidden');
        winnerIcon.classList.add('hidden');
        message2.style.color = '#A8BFC9';
        message2.textContent = 'Round tied';
        popup.classList.remove('hidden');
        console.log('tied score');
    };

  };
}

const game = new Game();