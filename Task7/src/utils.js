export function isValidCoordinate(row, col, boardSize = 10) {
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

export function formatCoordinate(row, col) {
  return `${row}${col}`;
}

export function parseCoordinate(coordinate) {
  if (typeof coordinate !== 'string' || coordinate.length !== 2) {
    throw new Error('Invalid coordinate format');
  }
  
  const row = parseInt(coordinate[0]);
  const col = parseInt(coordinate[1]);
  
  if (isNaN(row) || isNaN(col)) {
    throw new Error('Invalid coordinate format');
  }
  
  return [row, col];
}

export function validateUserInput(input, boardSize = 10) {
  if (!input || input.length !== 2) {
    return { valid: false, message: 'Input must be exactly two digits (e.g., 00, 34, 98).' };
  }

  try {
    const [row, col] = parseCoordinate(input);
    
    if (!isValidCoordinate(row, col, boardSize)) {
      return { 
        valid: false, 
        message: `Please enter valid row and column numbers between 0 and ${boardSize - 1}.` 
      };
    }
    
    return { valid: true, coordinate: input };
  } catch (error) {
    return { valid: false, message: error.message };
  }
}

export function getAdjacentCoordinates(coordinate, boardSize = 10) {
  const [row, col] = parseCoordinate(coordinate);
  const adjacent = [];
  
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1] // up, down, left, right
  ];
  
  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;
    
    if (isValidCoordinate(newRow, newCol, boardSize)) {
      adjacent.push(formatCoordinate(newRow, newCol));
    }
  }
  
  return adjacent;
} 