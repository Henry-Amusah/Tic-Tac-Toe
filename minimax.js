// export function minimax(){
  
// }

/**********************An effective but slow Algo*********************/
function minimax(currentBoard, player){
    const playerState = this.fetchPlayerState()
    const cpu = playerState.cpu_symbol.toLowerCase();
    const p1 = playerState.p1_symbol.toLowerCase();
    let emptyCells = this.emptySpot();
    
   if(this.winDetected(currentBoard, p1)){
    return { score: -10 };
   } else if(this.winDetected(currentBoard, cpu)){
    return { score: 10 }
   } else if(emptyCells.length === 0){
    return { score: 0 }
   }

    let allMoves = [];
    for(let i = 0; i < emptyCells.length; i++){
      let currentMove = {};
      currentMove.index = currentBoard[emptyCells[i]];
      currentBoard[emptyCells[i]] = player;

      if(player === cpu){
        const result = this.minimax(currentBoard, p1);
        currentMove.score = result.score;
      } 
      else {
        const result = this.minimax(currentBoard, cpu);
        currentMove.score = result.score;
      }

      currentBoard[emptyCells[i]] = currentMove.index;
      allMoves.push(currentMove);
    }

    let bestMove;
    if(player === cpu){
      let bestScore = -Infinity;
      for(let i = 0; i < allMoves.length; i++){
        if(allMoves[i].score > bestScore){
          bestScore = allMoves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for(let i = 0; i < allMoves.length; i++){
        if(allMoves[i].score < bestScore){
          bestScore = allMoves[i].score;
          bestMove = i;
        }
      }
    }
    return allMoves[bestMove];
  }



  /******************************Efficient but ineffective Algo******************************/
  // Optimized with Alpha Beta Prunning
  function minimax(currentBoard, player, alpha = -Infinity, beta = Infinity){
    const playerState = this.fetchPlayerState()
    const cpu = playerState.cpu_symbol.toLowerCase();
    const p1 = playerState.p1_symbol.toLowerCase();
    let emptyCells = this.emptySpot();
    
   if(this.winDetected(currentBoard, p1)){
    return { score: -10 };
   } else if(this.winDetected(currentBoard, cpu)){
    return { score: 10 }
   } else if(emptyCells.length === 0){
    return { score: 0 }
   }

    let bestMove = {};
    let allMoves = [];
    if(player === cpu){
      let bestScore = -Infinity;
      for(let i = 0; i < emptyCells.length; i++){
        let currentMove = {};
        currentMove.index = currentBoard[emptyCells[i]];
        currentBoard[emptyCells[i]] = player;

        const result = this.minimax(currentBoard, p1, alpha, beta);
        currentMove.score = result.score;

        currentBoard[emptyCells[i]] = currentMove.index;
        bestScore = Math.max(bestScore, currentMove.score);
        alpha = Math.max(alpha, currentMove.score);
        bestMove.score = bestScore;
        bestMove.index = currentMove.index;
        if(beta <= alpha) break;
      }

      
    } else {
      let bestScore = Infinity;
      for(let i = 0; i < emptyCells.length; i++){
        let currentMove = {};
        currentMove.index = currentBoard[emptyCells[i]];
        currentBoard[emptyCells[i]] = player;

        const result = this.minimax(currentBoard, cpu, alpha, beta);
        currentMove.score = result.score;

        currentBoard[emptyCells[i]] = currentMove.index;
        bestScore = Math.min(bestScore, currentMove.score);
        beta = Math.min(beta, currentMove.score);
        bestMove.score = bestScore;
        bestMove.index = currentMove.index;
        if(beta <= alpha) break;
      }
      
    }
    return bestMove;
  }