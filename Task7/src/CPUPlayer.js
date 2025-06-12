import Player from './Player.js';
import { getAdjacentCoordinates, formatCoordinate } from './utils.js';

class CPUPlayer extends Player {
  constructor(name = 'CPU', boardSize = 10, numShips = 3, shipLength = 3) {
    super(name, boardSize, numShips, shipLength);
    this.mode = 'hunt'; // 'hunt' or 'target'
    this.targetQueue = [];
  }

  async makeMove(opponentBoard) {
    let coordinate;

    if (this.mode === 'target' && this.targetQueue.length > 0) {
      // Target mode: attack adjacent cells to previous hits
      coordinate = this.targetQueue.shift();
      
      // If we've already guessed this coordinate, remove it and try next
      while (this.hasGuessed(coordinate) && this.targetQueue.length > 0) {
        coordinate = this.targetQueue.shift();
      }
      
      // If no valid targets left, switch to hunt mode
      if (this.hasGuessed(coordinate)) {
        this.mode = 'hunt';
        coordinate = this.getRandomCoordinate();
      }
    } else {
      // Hunt mode: random search
      this.mode = 'hunt';
      coordinate = this.getRandomCoordinate();
    }

    this.addGuess(coordinate);
    console.log(`\n--- ${this.name}'s Turn ---`);
    
    if (this.mode === 'target') {
      console.log(`${this.name} targets: ${coordinate}`);
    }

    return coordinate;
  }

  getRandomCoordinate() {
    let coordinate;
    do {
      const row = Math.floor(Math.random() * this.board.size);
      const col = Math.floor(Math.random() * this.board.size);
      coordinate = formatCoordinate(row, col);
    } while (this.hasGuessed(coordinate));
    
    return coordinate;
  }

  processAttackResult(coordinate, result) {
    if (result.hit) {
      console.log(`${this.name} HIT at ${coordinate}!`);
      
      if (result.sunk) {
        console.log(`${this.name} sunk your battleship!`);
        // Ship sunk, switch back to hunt mode
        this.mode = 'hunt';
        this.targetQueue = [];
      } else {
        // Hit but not sunk, switch to target mode
        this.mode = 'target';
        
        // Add adjacent coordinates to target queue
        const adjacentCoords = getAdjacentCoordinates(coordinate, this.board.size);
        
        for (const adjCoord of adjacentCoords) {
          if (!this.hasGuessed(adjCoord) && !this.targetQueue.includes(adjCoord)) {
            this.targetQueue.push(adjCoord);
          }
        }
      }
    } else {
      console.log(`${this.name} MISS at ${coordinate}.`);
      
      // If we were in target mode and missed, check if we have more targets
      if (this.mode === 'target' && this.targetQueue.length === 0) {
        this.mode = 'hunt';
      }
    }
  }
}

export default CPUPlayer; 