import Board from '../src/Board.js';

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board(10);
  });

  describe('constructor', () => {
    test('should create board with correct size and empty grid', () => {
      expect(board.size).toBe(10);
      expect(board.grid).toHaveLength(10);
      expect(board.grid[0]).toHaveLength(10);
      expect(board.ships).toHaveLength(0);
    });

    test('should create board with custom size', () => {
      const customBoard = new Board(5);
      expect(customBoard.size).toBe(5);
      expect(customBoard.grid).toHaveLength(5);
      expect(customBoard.grid[0]).toHaveLength(5);
    });

    test('should initialize grid with water symbols', () => {
      expect(board.grid[0][0]).toBe('~');
      expect(board.grid[5][5]).toBe('~');
      expect(board.grid[9][9]).toBe('~');
    });
  });

  describe('placeShipRandomly', () => {
    test('should place a ship successfully', () => {
      const result = board.placeShipRandomly(3);
      expect(result).toBe(true);
      expect(board.ships).toHaveLength(1);
      
      const ship = board.ships[0];
      expect(ship.locations).toHaveLength(3);
      expect(ship.length).toBe(3);
    });

    test('should mark ship positions on grid', () => {
      board.placeShipRandomly(3);
      const ship = board.ships[0];
      
      ship.locations.forEach(location => {
        const [row, col] = board.parseCoordinate(location);
        expect(board.grid[row][col]).toBe('S');
      });
    });

    test('should handle small board with multiple ships', () => {
      const smallBoard = new Board(3);
      const result1 = smallBoard.placeShipRandomly(2);
      const result2 = smallBoard.placeShipRandomly(2);
      
      expect(result1).toBe(true);
      // Second ship might not fit
      expect(typeof result2).toBe('boolean');
    });
  });

  describe('placeShipsRandomly', () => {
    test('should place multiple ships', () => {
      const placedCount = board.placeShipsRandomly(2, 3);
      expect(placedCount).toBe(2);
      expect(board.ships).toHaveLength(2);
    });

    test('should not place overlapping ships', () => {
      board.placeShipsRandomly(3, 3);
      
      const allLocations = board.ships.flatMap(ship => ship.locations);
      const uniqueLocations = new Set(allLocations);
      
      // All ship locations should be unique
      expect(allLocations.length).toBe(uniqueLocations.size);
    });
  });

  describe('receiveAttack', () => {
    beforeEach(() => {
      // Place a known ship for testing
      board.placeShipRandomly(3);
    });

    test('should handle miss', () => {
      // Find an empty coordinate
      let emptyCoord = '00';
      while (board.hasShipAt(emptyCoord)) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        emptyCoord = `${row}${col}`;
      }

      const result = board.receiveAttack(emptyCoord);
      expect(result.hit).toBe(false);
      expect(result.sunk).toBe(false);
      expect(result.alreadyAttacked).toBe(false);

      const [row, col] = board.parseCoordinate(emptyCoord);
      expect(board.grid[row][col]).toBe('O');
    });

    test('should handle hit', () => {
      const shipLocation = board.ships[0].locations[0];
      const result = board.receiveAttack(shipLocation);
      
      expect(result.hit).toBe(true);
      expect(result.alreadyAttacked).toBe(false);

      const [row, col] = board.parseCoordinate(shipLocation);
      expect(board.grid[row][col]).toBe('X');
    });

    test('should detect when ship is sunk', () => {
      const ship = board.ships[0];
      
      // Hit all locations except the last one
      for (let i = 0; i < ship.locations.length - 1; i++) {
        const result = board.receiveAttack(ship.locations[i]);
        expect(result.sunk).toBe(false);
      }
      
      // Hit the last location
      const finalResult = board.receiveAttack(ship.locations[ship.locations.length - 1]);
      expect(finalResult.hit).toBe(true);
      expect(finalResult.sunk).toBe(true);
    });

    test('should handle already attacked locations', () => {
      const shipLocation = board.ships[0].locations[0];
      
      // First attack
      board.receiveAttack(shipLocation);
      
      // Second attack on same location
      const result = board.receiveAttack(shipLocation);
      expect(result.alreadyAttacked).toBe(true);
    });

    test('should throw error for invalid coordinates', () => {
      expect(() => board.receiveAttack('aa')).toThrow('Invalid coordinate');
      expect(() => board.receiveAttack('99')).not.toThrow(); // Valid coordinate
    });
  });

  describe('hasShipAt', () => {
    beforeEach(() => {
      board.placeShipRandomly(3);
    });

    test('should return true for ship locations', () => {
      const shipLocation = board.ships[0].locations[0];
      expect(board.hasShipAt(shipLocation)).toBe(true);
    });

    test('should return false for empty locations', () => {
      let emptyCoord = '00';
      while (board.hasShipAt(emptyCoord)) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        emptyCoord = `${row}${col}`;
      }
      expect(board.hasShipAt(emptyCoord)).toBe(false);
    });
  });

  describe('parseCoordinate', () => {
    test('should parse coordinates correctly', () => {
      expect(board.parseCoordinate('00')).toEqual([0, 0]);
      expect(board.parseCoordinate('59')).toEqual([5, 9]);
      expect(board.parseCoordinate('99')).toEqual([9, 9]);
    });
  });

  describe('getRemainingShips', () => {
    test('should return correct count of remaining ships', () => {
      board.placeShipsRandomly(3, 3);
      expect(board.getRemainingShips()).toBe(3);
      
      // Sink one ship
      const ship = board.ships[0];
      ship.locations.forEach(location => {
        board.receiveAttack(location);
      });
      
      expect(board.getRemainingShips()).toBe(2);
    });
  });

  describe('getGrid and getOpponentView', () => {
    test('should return copy of grid', () => {
      const grid = board.getGrid();
      expect(grid).not.toBe(board.grid);
      expect(grid).toEqual(board.grid);
    });

    test('should hide ships in opponent view', () => {
      board.placeShipRandomly(3);
      const opponentView = board.getOpponentView();
      
      // Ships should be hidden (shown as water)
      for (let i = 0; i < board.size; i++) {
        for (let j = 0; j < board.size; j++) {
          if (board.grid[i][j] === 'S') {
            expect(opponentView[i][j]).toBe('~');
          } else {
            expect(opponentView[i][j]).toBe(board.grid[i][j]);
          }
        }
      }
    });

    test('should show hits and misses in opponent view', () => {
      board.placeShipRandomly(3);
      const shipLocation = board.ships[0].locations[0];
      
      board.receiveAttack(shipLocation); // Hit
      board.receiveAttack('99'); // Miss (if no ship there)
      
      const opponentView = board.getOpponentView();
      const [hitRow, hitCol] = board.parseCoordinate(shipLocation);
      
      expect(opponentView[hitRow][hitCol]).toBe('X');
      
      if (!board.hasShipAt('99')) {
        expect(opponentView[9][9]).toBe('O');
      }
    });
  });
}); 