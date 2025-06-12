import Game from '../src/Game.js';

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game(10, 3, 3);
  });

  describe('constructor', () => {
    test('should create game with correct properties', () => {
      expect(game.boardSize).toBe(10);
      expect(game.numShips).toBe(3);
      expect(game.shipLength).toBe(3);
      expect(game.humanPlayer).toBeDefined();
      expect(game.cpuPlayer).toBeDefined();
      expect(game.display).toBeDefined();
      expect(game.gameOver).toBe(false);
      expect(game.winner).toBeNull();
    });
  });

  describe('initializeGame', () => {
    test('should initialize both players with ships', async () => {
      const originalLog = console.log;
      console.log = () => {}; // Suppress console output
      
      await game.initializeGame();
      
      expect(game.humanPlayer.board.ships).toHaveLength(3);
      expect(game.cpuPlayer.board.ships).toHaveLength(3);
      
      console.log = originalLog;
    });

    test('should throw error if initialization fails', async () => {
      const originalLog = console.log;
      console.log = () => {}; // Suppress console output
      
      // Mock setupBoard to throw error
      const originalSetup = game.humanPlayer.setupBoard;
      game.humanPlayer.setupBoard = () => {
        throw new Error('Setup failed');
      };
      
      await expect(game.initializeGame()).rejects.toThrow('Failed to initialize game: Setup failed');
      
      // Restore original method
      game.humanPlayer.setupBoard = originalSetup;
      console.log = originalLog;
    });
  });

  describe('utility methods', () => {
    test('should return correct players and game state', () => {
      expect(game.getHumanPlayer()).toBe(game.humanPlayer);
      expect(game.getCpuPlayer()).toBe(game.cpuPlayer);
      expect(game.isGameOver()).toBe(false);
      expect(game.getWinner()).toBeNull();
      
      // Set game over
      game.gameOver = true;
      game.winner = 'player';
      
      expect(game.isGameOver()).toBe(true);
      expect(game.getWinner()).toBe('player');
    });
  });

  describe('edge cases', () => {
    test('should handle custom game parameters', () => {
      const customGame = new Game(5, 2, 2);
      
      expect(customGame.boardSize).toBe(5);
      expect(customGame.numShips).toBe(2);
      expect(customGame.shipLength).toBe(2);
    });
  });
}); 