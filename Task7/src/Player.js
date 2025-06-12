import Board from './Board.js';

class Player {
  constructor(name, boardSize = 10, numShips = 3, shipLength = 3) {
    this.name = name;
    this.board = new Board(boardSize);
    this.guesses = new Set();
    this.numShips = numShips;
    this.shipLength = shipLength;
  }

  setupBoard() {
    const placedShips = this.board.placeShipsRandomly(this.numShips, this.shipLength);
    if (placedShips !== this.numShips) {
      throw new Error(`Could only place ${placedShips} out of ${this.numShips} ships`);
    }
  }

  receiveAttack(coordinate) {
    return this.board.receiveAttack(coordinate);
  }

  hasLost() {
    return this.board.getRemainingShips() === 0;
  }

  hasGuessed(coordinate) {
    return this.guesses.has(coordinate);
  }

  addGuess(coordinate) {
    this.guesses.add(coordinate);
  }

  getRemainingShips() {
    return this.board.getRemainingShips();
  }

  getBoard() {
    return this.board.getGrid();
  }

  getOpponentView() {
    return this.board.getOpponentView();
  }

  // Abstract method to be implemented by subclasses
  async makeMove(opponentBoard) {
    throw new Error('makeMove must be implemented by subclass');
  }
}

export default Player; 