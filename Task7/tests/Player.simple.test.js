import Player from '../src/Player.js';
import HumanPlayer from '../src/HumanPlayer.js';
import CPUPlayer from '../src/CPUPlayer.js';

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player('TestPlayer', 10, 3, 3);
  });

  describe('constructor', () => {
    test('should create player with correct properties', () => {
      expect(player.name).toBe('TestPlayer');
      expect(player.board).toBeDefined();
      expect(player.guesses).toBeInstanceOf(Set);
      expect(player.numShips).toBe(3);
      expect(player.shipLength).toBe(3);
    });
  });

  describe('setupBoard', () => {
    test('should place ships on board', () => {
      player.setupBoard();
      expect(player.board.ships).toHaveLength(3);
    });

    test('should throw error if cannot place all ships', () => {
      // Create a player with impossible ship configuration
      const impossiblePlayer = new Player('Test', 2, 5, 3);
      expect(() => impossiblePlayer.setupBoard()).toThrow();
    });
  });

  describe('hasLost', () => {
    test('should return false when ships remain', () => {
      player.setupBoard();
      expect(player.hasLost()).toBe(false);
    });

    test('should return true when no ships remain', () => {
      player.setupBoard();
      
      // Sink all ships
      player.board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          player.receiveAttack(location);
        });
      });
      
      expect(player.hasLost()).toBe(true);
    });
  });

  describe('guess tracking', () => {
    test('should track guesses', () => {
      expect(player.hasGuessed('00')).toBe(false);
      player.addGuess('00');
      expect(player.hasGuessed('00')).toBe(true);
    });
  });

  describe('makeMove', () => {
    test('should throw error as abstract method', async () => {
      await expect(player.makeMove()).rejects.toThrow('makeMove must be implemented by subclass');
    });
  });
});

describe('HumanPlayer', () => {
  let humanPlayer;

  beforeEach(() => {
    humanPlayer = new HumanPlayer('Human', 10, 3, 3);
  });

  describe('constructor', () => {
    test('should create human player with default name', () => {
      const defaultPlayer = new HumanPlayer();
      expect(defaultPlayer.name).toBe('Player');
    });
  });
});

describe('CPUPlayer', () => {
  let cpuPlayer;

  beforeEach(() => {
    cpuPlayer = new CPUPlayer('CPU', 10, 3, 3);
  });

  describe('constructor', () => {
    test('should create CPU player with hunt mode', () => {
      expect(cpuPlayer.name).toBe('CPU');
      expect(cpuPlayer.mode).toBe('hunt');
      expect(cpuPlayer.targetQueue).toEqual([]);
    });
  });

  describe('getRandomCoordinate', () => {
    test('should return unguessed coordinate', () => {
      cpuPlayer.addGuess('00');
      cpuPlayer.addGuess('01');
      
      const coordinate = cpuPlayer.getRandomCoordinate();
      
      expect(coordinate).toMatch(/^\d\d$/);
      expect(cpuPlayer.hasGuessed(coordinate)).toBe(false);
    });
  });

  describe('processAttackResult', () => {
    test('should handle hit without sinking', () => {
      const originalLog = console.log;
      console.log = () => {}; // Suppress console output
      
      cpuPlayer.processAttackResult('12', { hit: true, sunk: false });
      
      expect(cpuPlayer.mode).toBe('target');
      expect(cpuPlayer.targetQueue.length).toBeGreaterThan(0);
      
      console.log = originalLog;
    });

    test('should handle sinking ship', () => {
      const originalLog = console.log;
      console.log = () => {}; // Suppress console output
      
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = ['11', '13'];
      
      cpuPlayer.processAttackResult('12', { hit: true, sunk: true });
      
      expect(cpuPlayer.mode).toBe('hunt');
      expect(cpuPlayer.targetQueue).toEqual([]);
      
      console.log = originalLog;
    });

    test('should add adjacent coordinates to target queue on hit', () => {
      const originalLog = console.log;
      console.log = () => {}; // Suppress console output
      
      cpuPlayer.processAttackResult('55', { hit: true, sunk: false });
      
      expect(cpuPlayer.targetQueue).toContain('45'); // up
      expect(cpuPlayer.targetQueue).toContain('65'); // down
      expect(cpuPlayer.targetQueue).toContain('54'); // left
      expect(cpuPlayer.targetQueue).toContain('56'); // right
      
      console.log = originalLog;
    });

    test('should not add already guessed coordinates to target queue', () => {
      const originalLog = console.log;
      console.log = () => {}; // Suppress console output
      
      cpuPlayer.addGuess('45');
      cpuPlayer.addGuess('54');
      
      cpuPlayer.processAttackResult('55', { hit: true, sunk: false });
      
      expect(cpuPlayer.targetQueue).not.toContain('45');
      expect(cpuPlayer.targetQueue).not.toContain('54');
      expect(cpuPlayer.targetQueue).toContain('65');
      expect(cpuPlayer.targetQueue).toContain('56');
      
      console.log = originalLog;
    });

    test('should switch to hunt mode on miss when target queue becomes empty', () => {
      const originalLog = console.log;
      console.log = () => {}; // Suppress console output
      
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = [];
      
      cpuPlayer.processAttackResult('12', { hit: false });
      
      expect(cpuPlayer.mode).toBe('hunt');
      
      console.log = originalLog;
    });
  });
}); 