import Ship from './Ship.js';
import { isValidCoordinate, formatCoordinate } from './utils.js';

class Board {
  constructor(size = 10) {
    this.size = size;
    this.grid = this.createGrid();
    this.ships = [];
  }

  createGrid() {
    return Array(this.size).fill(null).map(() => 
      Array(this.size).fill('~')
    );
  }

  placeShipRandomly(shipLength = 3) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const startRow = orientation === 'horizontal' 
        ? Math.floor(Math.random() * this.size)
        : Math.floor(Math.random() * (this.size - shipLength + 1));
      const startCol = orientation === 'horizontal'
        ? Math.floor(Math.random() * (this.size - shipLength + 1))
        : Math.floor(Math.random() * this.size);

      const locations = [];
      let canPlace = true;

      // Generate ship locations
      for (let i = 0; i < shipLength; i++) {
        const row = orientation === 'horizontal' ? startRow : startRow + i;
        const col = orientation === 'horizontal' ? startCol + i : startCol;
        const location = formatCoordinate(row, col);
        
        if (!isValidCoordinate(row, col, this.size) || this.hasShipAt(location)) {
          canPlace = false;
          break;
        }
        locations.push(location);
      }

      if (canPlace) {
        const ship = new Ship(locations, shipLength);
        this.ships.push(ship);
        
        // Mark ship positions on grid
        locations.forEach(location => {
          const [row, col] = this.parseCoordinate(location);
          this.grid[row][col] = 'S';
        });
        
        placed = true;
      }
      attempts++;
    }

    return placed;
  }

  placeShipsRandomly(numShips = 3, shipLength = 3) {
    let placedCount = 0;
    for (let i = 0; i < numShips; i++) {
      if (this.placeShipRandomly(shipLength)) {
        placedCount++;
      }
    }
    return placedCount;
  }

  receiveAttack(coordinate) {
    const [row, col] = this.parseCoordinate(coordinate);
    
    if (!isValidCoordinate(row, col, this.size)) {
      throw new Error('Invalid coordinate');
    }

    // Check if already attacked
    if (this.grid[row][col] === 'X' || this.grid[row][col] === 'O') {
      return { hit: false, alreadyAttacked: true };
    }

    // Check for ship hit
    const hitShip = this.ships.find(ship => ship.hasLocation(coordinate));
    
    if (hitShip) {
      hitShip.hit(coordinate);
      this.grid[row][col] = 'X';
      return {
        hit: true,
        sunk: hitShip.isSunk(),
        alreadyAttacked: false
      };
    } else {
      this.grid[row][col] = 'O';
      return { hit: false, sunk: false, alreadyAttacked: false };
    }
  }

  hasShipAt(coordinate) {
    return this.ships.some(ship => ship.hasLocation(coordinate));
  }

  parseCoordinate(coordinate) {
    return [parseInt(coordinate[0]), parseInt(coordinate[1])];
  }

  getRemainingShips() {
    return this.ships.filter(ship => !ship.isSunk()).length;
  }

  getAllShipLocations() {
    return this.ships.flatMap(ship => ship.locations);
  }

  getGrid() {
    return this.grid.map(row => [...row]);
  }

  // Get grid for opponent view (hide ships)
  getOpponentView() {
    return this.grid.map(row => 
      row.map(cell => cell === 'S' ? '~' : cell)
    );
  }
}

export default Board; 