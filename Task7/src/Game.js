import HumanPlayer from './HumanPlayer.js';
import CPUPlayer from './CPUPlayer.js';
import GameDisplay from './GameDisplay.js';

class Game {
  constructor(boardSize = 10, numShips = 3, shipLength = 3) {
    this.boardSize = boardSize;
    this.numShips = numShips;
    this.shipLength = shipLength;
    
    this.humanPlayer = new HumanPlayer('Player', boardSize, numShips, shipLength);
    this.cpuPlayer = new CPUPlayer('CPU', boardSize, numShips, shipLength);
    this.display = new GameDisplay(boardSize);
    
    this.gameOver = false;
    this.winner = null;
  }

  async initializeGame() {
    console.log('Setting up the game...');
    
    try {
      this.humanPlayer.setupBoard();
      console.log(`${this.numShips} ships placed randomly for Player.`);
      
      this.cpuPlayer.setupBoard();
      console.log(`${this.numShips} ships placed randomly for CPU.`);
      
      this.display.displayWelcomeMessage(this.numShips);
    } catch (error) {
      throw new Error(`Failed to initialize game: ${error.message}`);
    }
  }

  async playTurn(currentPlayer, opponent, inputFunction = null) {
    // Display current board state
    if (currentPlayer === this.humanPlayer) {
      this.display.displayBoards(
        this.humanPlayer.getBoard(),
        this.cpuPlayer.getOpponentView(),
        'Player',
        'CPU'
      );
    }

    // Get player's move
    let coordinate;
    try {
      if (currentPlayer === this.humanPlayer) {
        coordinate = await currentPlayer.makeMove(opponent.board, inputFunction);
      } else {
        coordinate = await currentPlayer.makeMove(opponent.board);
      }
    } catch (error) {
      throw new Error(`Error during ${currentPlayer.name}'s turn: ${error.message}`);
    }

    // Process the attack
    const result = opponent.receiveAttack(coordinate);
    
    // Display result
    if (currentPlayer === this.humanPlayer) {
      this.display.displayTurnResult('PLAYER', coordinate, result);
    } else {
      // CPU player handles its own result display
      currentPlayer.processAttackResult(coordinate, result);
    }

    // Check for game end
    if (opponent.hasLost()) {
      this.gameOver = true;
      this.winner = currentPlayer === this.humanPlayer ? 'player' : 'cpu';
    }

    return !result.alreadyAttacked; // Return true if it was a valid turn
  }

  async startGame(inputFunction) {
    await this.initializeGame();

    while (!this.gameOver) {
      try {
        // Human player's turn
        let validPlayerTurn = false;
        while (!validPlayerTurn && !this.gameOver) {
          validPlayerTurn = await this.playTurn(this.humanPlayer, this.cpuPlayer, inputFunction);
          
          if (this.gameOver) break;
        }

        if (this.gameOver) break;

        // CPU player's turn
        let validCpuTurn = false;
        while (!validCpuTurn && !this.gameOver) {
          validCpuTurn = await this.playTurn(this.cpuPlayer, this.humanPlayer);
        }

      } catch (error) {
        console.error('Game error:', error.message);
        throw error;
      }
    }

    // Display final results
    this.display.displayGameResult(
      this.winner,
      this.humanPlayer.getRemainingShips(),
      this.cpuPlayer.getRemainingShips()
    );

    this.display.displayBoards(
      this.humanPlayer.getBoard(),
      this.cpuPlayer.getOpponentView(),
      'Player',
      'CPU'
    );

    return this.winner;
  }

  // Utility methods for testing
  getHumanPlayer() {
    return this.humanPlayer;
  }

  getCpuPlayer() {
    return this.cpuPlayer;
  }

  isGameOver() {
    return this.gameOver;
  }

  getWinner() {
    return this.winner;
  }
}

export default Game; 