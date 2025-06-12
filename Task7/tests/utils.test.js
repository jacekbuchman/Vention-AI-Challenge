import { 
  isValidCoordinate, 
  formatCoordinate, 
  parseCoordinate, 
  validateUserInput, 
  getAdjacentCoordinates 
} from '../src/utils.js';

describe('Utils', () => {
  describe('isValidCoordinate', () => {
    test('should return true for valid coordinates', () => {
      expect(isValidCoordinate(0, 0)).toBe(true);
      expect(isValidCoordinate(5, 5)).toBe(true);
      expect(isValidCoordinate(9, 9)).toBe(true);
    });

    test('should return false for invalid coordinates', () => {
      expect(isValidCoordinate(-1, 0)).toBe(false);
      expect(isValidCoordinate(0, -1)).toBe(false);
      expect(isValidCoordinate(10, 0)).toBe(false);
      expect(isValidCoordinate(0, 10)).toBe(false);
      expect(isValidCoordinate(-1, -1)).toBe(false);
      expect(isValidCoordinate(10, 10)).toBe(false);
    });

    test('should work with custom board size', () => {
      expect(isValidCoordinate(4, 4, 5)).toBe(true);
      expect(isValidCoordinate(5, 5, 5)).toBe(false);
    });
  });

  describe('formatCoordinate', () => {
    test('should format coordinates correctly', () => {
      expect(formatCoordinate(0, 0)).toBe('00');
      expect(formatCoordinate(1, 2)).toBe('12');
      expect(formatCoordinate(9, 9)).toBe('99');
    });
  });

  describe('parseCoordinate', () => {
    test('should parse valid coordinates', () => {
      expect(parseCoordinate('00')).toEqual([0, 0]);
      expect(parseCoordinate('12')).toEqual([1, 2]);
      expect(parseCoordinate('99')).toEqual([9, 9]);
    });

    test('should throw error for invalid coordinates', () => {
      expect(() => parseCoordinate('0')).toThrow('Invalid coordinate format');
      expect(() => parseCoordinate('000')).toThrow('Invalid coordinate format');
      expect(() => parseCoordinate('ab')).toThrow('Invalid coordinate format');
      expect(() => parseCoordinate('')).toThrow('Invalid coordinate format');
      expect(() => parseCoordinate(null)).toThrow('Invalid coordinate format');
    });
  });

  describe('validateUserInput', () => {
    test('should validate correct input', () => {
      const result = validateUserInput('00');
      expect(result.valid).toBe(true);
      expect(result.coordinate).toBe('00');
    });

    test('should reject invalid input format', () => {
      expect(validateUserInput('0').valid).toBe(false);
      expect(validateUserInput('000').valid).toBe(false);
      expect(validateUserInput('ab').valid).toBe(false);
      expect(validateUserInput('').valid).toBe(false);
      expect(validateUserInput(null).valid).toBe(false);
    });

    test('should reject out of bounds coordinates', () => {
      const result = validateUserInput('aa');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid coordinate format');
    });

    test('should work with custom board size', () => {
      expect(validateUserInput('44', 5).valid).toBe(true);
      expect(validateUserInput('55', 5).valid).toBe(false);
    });
  });

  describe('getAdjacentCoordinates', () => {
    test('should return adjacent coordinates for center position', () => {
      const adjacent = getAdjacentCoordinates('55');
      expect(adjacent).toHaveLength(4);
      expect(adjacent).toContain('45'); // up
      expect(adjacent).toContain('65'); // down
      expect(adjacent).toContain('54'); // left
      expect(adjacent).toContain('56'); // right
    });

    test('should return fewer coordinates for corner position', () => {
      const adjacent = getAdjacentCoordinates('00');
      expect(adjacent).toHaveLength(2);
      expect(adjacent).toContain('10'); // down
      expect(adjacent).toContain('01'); // right
    });

    test('should return fewer coordinates for edge position', () => {
      const adjacent = getAdjacentCoordinates('09');
      expect(adjacent).toHaveLength(2);
      expect(adjacent).toContain('19'); // down
      expect(adjacent).toContain('08'); // left
    });

    test('should work with custom board size', () => {
      const adjacent = getAdjacentCoordinates('22', 5);
      expect(adjacent).toHaveLength(4);
      expect(adjacent).toContain('12');
      expect(adjacent).toContain('32');
      expect(adjacent).toContain('21');
      expect(adjacent).toContain('23');
    });
  });
}); 