const logo  = document.querySelector('.logo');
const infoBoard = document.querySelector('.player-turn-info');
const restartBtn = document.querySelector('.restart');
const container = document.querySelector('.body');
const playerSelect = document.querySelector('.player-select-option');


class Game {
  constructor(){
    playerSelect.addEventListener('click', this.togglePlayerLogo);
  }

  togglePlayerLogo(e){
    let x_bg = document.querySelector('.x-mark'), o_bg = document.querySelector('.o-mark');
    const { target } = e;
    if(target.classList.contains('x-mark') || target.closest('.x-mark')){
      if(target.classList.contains('bg-hover') || target.closest('.x-mark').classList.contains('bg-hover')){
        // Activate selected state for X player
        x_bg.classList.add('bg-toggle');
        x_bg.classList.remove('bg-hover');
        x_bg.children[0].setAttribute('src', 'assets/icon-x-outline-white.svg');
        
        // Deactivate selected state for O player
        o_bg.classList.remove('bg-toggle');
        o_bg.classList.add('bg-hover');
        o_bg.children[0].setAttribute('src', 'assets/icon-o-white.svg');
      }
    } 
    if(target.classList.contains('o-mark') || target.closest('.o-mark')){
      if(target.classList.contains('bg-hover') || target.closest('.o-mark').classList.contains('bg-hover')){
        // Activate selected state for O player
        o_bg.classList.add('bg-toggle');
        o_bg.classList.remove('bg-hover');
        o_bg.children[0].setAttribute('src', 'assets/icon-o-outline-white.svg');
        
        // Deactivate selected state for O player
        x_bg.classList.remove('bg-toggle');
        x_bg.classList.add('bg-hover');
        x_bg.children[0].setAttribute('src', 'assets/icon-o-white.svg');
      }
    }
  }

}

const game = new Game();