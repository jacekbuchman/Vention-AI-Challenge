const { Enigma, Rotor, plugboardSwap, ROTORS, REFLECTOR, alphabet, mod } = require('./enigma.js');

// Test basic encryption/decryption reciprocity
function testBasicReciprocity() {
  console.log('Testing basic encryption/decryption reciprocity...');
  
  const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  
  const message = 'HELLO';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  console.log(`Original: ${message}`);
  console.log(`Encrypted: ${encrypted}`);
  console.log(`Decrypted: ${decrypted}`);
  console.log(`Reciprocity test: ${message === decrypted ? 'PASS' : 'FAIL'}`);
  console.log('');
}

// Test single character encryption
function testSingleChar() {
  console.log('Testing single character encryption...');
  
  const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  
  const char = 'A';
  const encrypted = enigma1.encryptChar(char);
  const decrypted = enigma2.encryptChar(encrypted);
  
  console.log(`Original: ${char}`);
  console.log(`Encrypted: ${encrypted}`);
  console.log(`Decrypted: ${decrypted}`);
  console.log(`Single char test: ${char === decrypted ? 'PASS' : 'FAIL'}`);
  console.log('');
}

// Test with plugboard
function testWithPlugboard() {
  console.log('Testing with plugboard...');
  
  const plugPairs = [['A', 'B'], ['C', 'D']];
  const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugPairs);
  const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugPairs);
  
  const message = 'ABCD';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  console.log(`Original: ${message}`);
  console.log(`Encrypted: ${encrypted}`);
  console.log(`Decrypted: ${decrypted}`);
  console.log(`Plugboard test: ${message === decrypted ? 'PASS' : 'FAIL'}`);
  console.log('');
}

// Test plugboard function directly
function testPlugboardFunction() {
  console.log('Testing plugboard function...');
  
  const pairs = [['A', 'B'], ['C', 'D']];
  console.log(`A -> ${plugboardSwap('A', pairs)} (should be B)`);
  console.log(`B -> ${plugboardSwap('B', pairs)} (should be A)`);
  console.log(`C -> ${plugboardSwap('C', pairs)} (should be D)`);
  console.log(`E -> ${plugboardSwap('E', pairs)} (should be E)`);
  console.log('');
}

// Run tests
testPlugboardFunction();
testBasicReciprocity();
testSingleChar();
testWithPlugboard(); 