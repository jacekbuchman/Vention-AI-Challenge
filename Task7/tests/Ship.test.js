import Ship from '../src/Ship.js';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(['00', '01', '02'], 3);
  });

  describe('constructor', () => {
    test('should create ship with locations and initialize hits array', () => {
      expect(ship.locations).toEqual(['00', '01', '02']);
      expect(ship.hits).toEqual([false, false, false]);
      expect(ship.length).toBe(3);
    });

    test('should work with custom length', () => {
      const customShip = new Ship(['10', '20'], 2);
      expect(customShip.length).toBe(2);
      expect(customShip.hits).toEqual([false, false]);
    });
  });

  describe('hit', () => {
    test('should register hit on valid location', () => {
      const result = ship.hit('01');
      expect(result).toBe(true);
      expect(ship.hits[1]).toBe(true);
      expect(ship.hits[0]).toBe(false);
      expect(ship.hits[2]).toBe(false);
    });

    test('should return false for invalid location', () => {
      const result = ship.hit('99');
      expect(result).toBe(false);
      expect(ship.hits).toEqual([false, false, false]);
    });

    test('should return false for already hit location', () => {
      ship.hit('01');
      const result = ship.hit('01');
      expect(result).toBe(false);
      expect(ship.hits[1]).toBe(true);
    });

    test('should handle multiple hits on different locations', () => {
      ship.hit('00');
      ship.hit('02');
      expect(ship.hits).toEqual([true, false, true]);
    });
  });

  describe('isSunk', () => {
    test('should return false when ship is not hit', () => {
      expect(ship.isSunk()).toBe(false);
    });

    test('should return false when ship is partially hit', () => {
      ship.hit('00');
      ship.hit('01');
      expect(ship.isSunk()).toBe(false);
    });

    test('should return true when all locations are hit', () => {
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      expect(ship.isSunk()).toBe(true);
    });

    test('should work with different ship lengths', () => {
      const smallShip = new Ship(['10'], 1);
      expect(smallShip.isSunk()).toBe(false);
      smallShip.hit('10');
      expect(smallShip.isSunk()).toBe(true);
    });
  });

  describe('isHit', () => {
    test('should return false for unhit location', () => {
      expect(ship.isHit('00')).toBe(false);
    });

    test('should return true for hit location', () => {
      ship.hit('01');
      expect(ship.isHit('01')).toBe(true);
      expect(ship.isHit('00')).toBe(false);
    });

    test('should return false for location not on ship', () => {
      expect(ship.isHit('99')).toBe(false);
    });
  });

  describe('hasLocation', () => {
    test('should return true for valid ship location', () => {
      expect(ship.hasLocation('00')).toBe(true);
      expect(ship.hasLocation('01')).toBe(true);
      expect(ship.hasLocation('02')).toBe(true);
    });

    test('should return false for invalid location', () => {
      expect(ship.hasLocation('99')).toBe(false);
      expect(ship.hasLocation('10')).toBe(false);
    });
  });
}); 