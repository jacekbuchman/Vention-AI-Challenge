import readline from 'readline';
import Game from './Game.js';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify readline question
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('# Sea Battle CLI Game');
  console.log('Modern ES6+ Implementation\n');

  try {
    const game = new Game();
    const winner = await game.startGame(askQuestion);
    
    console.log('\nThanks for playing Sea Battle!');
    process.exit(0);
  } catch (error) {
    console.error('Game failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nGame interrupted. Thanks for playing!');
  rl.close();
  process.exit(0);
});

main().catch(error => {
  console.error('Unexpected error:', error);
  rl.close();
  process.exit(1);
}); 