export default class Utilities{
  hoverState(element){
    element.addEventListener('mouseenter', () => {
        if(element.children[0].getAttribute('src').includes('-o.svg')){
          element.children[0].setAttribute('src', `assets/icon-o-outline.svg`);
        } 
        if(element.children[0].getAttribute('src').includes('-x.svg')){
          element.children[0].setAttribute('src', `assets/icon-x-outline.svg`);
        }
      });
    element.addEventListener('mouseleave', () => {
      if(element.children[0].getAttribute('src').includes('-o-outline.svg')){
        element.children[0].setAttribute('src', `assets/icon-o.svg`)
      }
      if(element.children[0].getAttribute('src').includes('-x-outline.svg')){
        element.children[0].setAttribute('src', `assets/icon-x.svg`);
      }
    });
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
}