class GameDisplay {
  constructor(boardSize = 10) {
    this.boardSize = boardSize;
  }

  displayBoards(playerBoard, opponentView, playerName = 'Player', opponentName = 'Opponent') {
    console.log(`\n   --- ${opponentName.toUpperCase()} BOARD ---          --- YOUR BOARD ---`);
    
    // Header with column numbers
    let header = '  ';
    for (let h = 0; h < this.boardSize; h++) {
      header += h + ' ';
    }
    console.log(header + '     ' + header);

    // Display both boards side by side
    for (let i = 0; i < this.boardSize; i++) {
      let rowStr = i + ' ';

      // Opponent board (hidden ships)
      for (let j = 0; j < this.boardSize; j++) {
        rowStr += opponentView[i][j] + ' ';
      }
      
      rowStr += '    ' + i + ' ';

      // Player board (show ships)
      for (let j = 0; j < this.boardSize; j++) {
        rowStr += playerBoard[i][j] + ' ';
      }
      
      console.log(rowStr);
    }
    console.log('\n');
  }

  displayWelcomeMessage(numShips) {
    console.log("\nLet's play Sea Battle!");
    console.log(`Try to sink the ${numShips} enemy ships.`);
    console.log('\nLegend:');
    console.log('~ = Water (unknown)');
    console.log('S = Your ships');
    console.log('X = Hit');
    console.log('O = Miss');
  }

  displayGameResult(winner, playerShips, cpuShips) {
    if (winner === 'player') {
      console.log('\n*** CONGRATULATIONS! You sunk all enemy battleships! ***');
    } else {
      console.log('\n*** GAME OVER! The CPU sunk all your battleships! ***');
    }
  }

  displayTurnResult(playerName, coordinate, result) {
    if (result.alreadyAttacked) {
      console.log(`${playerName} already attacked that location!`);
      return;
    }

    if (result.hit) {
      console.log(`${playerName} HIT!`);
      if (result.sunk) {
        console.log(`${playerName === 'PLAYER' ? 'You' : playerName} sunk ${playerName === 'PLAYER' ? 'an enemy' : 'your'} battleship!`);
      }
    } else {
      console.log(`${playerName} MISS.`);
    }
  }

  displayShipsRemaining(playerShips, cpuShips) {
    console.log(`Your ships remaining: ${playerShips}`);
    console.log(`Enemy ships remaining: ${cpuShips}`);
  }
}

export default GameDisplay; 