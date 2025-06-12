import Player from './Player.js';
import { validateUserInput } from './utils.js';

class HumanPlayer extends Player {
  constructor(name = 'Player', boardSize = 10, numShips = 3, shipLength = 3) {
    super(name, boardSize, numShips, shipLength);
  }

  async makeMove(opponentBoard, inputFunction) {
    let validMove = false;
    let coordinate;

    while (!validMove) {
      const input = await inputFunction('Enter your guess (e.g., 00): ');
      const validation = validateUserInput(input, this.board.size);

      if (!validation.valid) {
        console.log(validation.message);
        continue;
      }

      coordinate = validation.coordinate;

      if (this.hasGuessed(coordinate)) {
        console.log('You already guessed that location!');
        continue;
      }

      validMove = true;
    }

    this.addGuess(coordinate);
    return coordinate;
  }
}

export default HumanPlayer; 