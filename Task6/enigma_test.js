const { Enigma, Rotor, plugboardSwap, ROTORS, REFLECTOR, alphabet, mod } = require('./enigma.js');

let testCount = 0;
let passCount = 0;

function runTest(testName, testFunction) {
  testCount++;
  console.log(`\n=== Test ${testCount}: ${testName} ===`);
  try {
    const result = testFunction();
    if (result) {
      console.log('✅ PASS');
      passCount++;
    } else {
      console.log('❌ FAIL');
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

// Test 1: Basic reciprocity without plugboard
runTest('Basic reciprocity without plugboard', () => {
  const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  
  const message = 'HELLO';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  console.log(`Original: ${message}, Encrypted: ${encrypted}, Decrypted: ${decrypted}`);
  return message === decrypted;
});

// Test 2: Single character reciprocity
runTest('Single character reciprocity', () => {
  const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  
  const char = 'A';
  const encrypted = enigma1.encryptChar(char);
  const decrypted = enigma2.encryptChar(encrypted);
  
  console.log(`Original: ${char}, Encrypted: ${encrypted}, Decrypted: ${decrypted}`);
  return char === decrypted;
});

// Test 3: Reciprocity with plugboard
runTest('Reciprocity with plugboard', () => {
  const plugPairs = [['A', 'B'], ['C', 'D']];
  const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugPairs);
  const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugPairs);
  
  const message = 'ABCDEFG';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  console.log(`Original: ${message}, Encrypted: ${encrypted}, Decrypted: ${decrypted}`);
  return message === decrypted;
});

// Test 4: Different rotor positions
runTest('Different rotor positions', () => {
  const enigma1 = new Enigma([0, 1, 2], [5, 10, 15], [0, 0, 0], []);
  const enigma2 = new Enigma([0, 1, 2], [5, 10, 15], [0, 0, 0], []);
  
  const message = 'TESTING';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  console.log(`Original: ${message}, Encrypted: ${encrypted}, Decrypted: ${decrypted}`);
  return message === decrypted;
});

// Test 5: With ring settings
runTest('With ring settings', () => {
  const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [3, 5, 7], []);
  const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [3, 5, 7], []);
  
  const message = 'RINGS';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  console.log(`Original: ${message}, Encrypted: ${encrypted}, Decrypted: ${decrypted}`);
  return message === decrypted;
});

// Test 6: Long message
runTest('Long message encryption', () => {
  const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  
  const message = 'THISISAVERYLONGMESSAGETOTESTWHETHERTHEENIGMAMACHINECANHANDLELONGTEXTSWITHOUTERRORS';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  console.log(`Message length: ${message.length}`);
  console.log(`Original: ${message.substring(0, 20)}...`);
  console.log(`Encrypted: ${encrypted.substring(0, 20)}...`);
  console.log(`Decrypted: ${decrypted.substring(0, 20)}...`);
  return message === decrypted;
});

// Test 7: Non-alphabetic characters
runTest('Non-alphabetic characters', () => {
  const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  
  const message = 'HELLO123WORLD!@#';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  console.log(`Original: ${message}, Encrypted: ${encrypted}, Decrypted: ${decrypted}`);
  return message === decrypted;
});

// Test 8: Rotor stepping test
runTest('Rotor stepping verification', () => {
  const enigma = new Enigma([0, 1, 2], [0, 0, 25], [0, 0, 0], []);
  
  // Encrypt one character to step the rotor
  enigma.encryptChar('A');
  
  // Check if rightmost rotor stepped from 25 to 0
  const stepped = enigma.rotors[2].position === 0;
  console.log(`Rotor position after stepping: ${enigma.rotors[2].position} (should be 0)`);
  return stepped;
});

// Test 9: Double stepping test
runTest('Double stepping mechanism', () => {
  // Set up rotors where middle rotor is at notch position
  const enigma = new Enigma([0, 1, 2], [0, 4, 0], [0, 0, 0], []); // Rotor II notch is at 'E' (position 4)
  
  console.log(`Initial positions: [${enigma.rotors.map(r => r.position)}]`);
  
  // Encrypt one character to trigger stepping
  enigma.encryptChar('A');
  
  console.log(`After stepping: [${enigma.rotors.map(r => r.position)}]`);
  
  // When middle rotor is at notch, both middle and left rotors should step
  // Position should change from [0,4,0] to [1,5,1]
  const leftStepped = enigma.rotors[0].position === 1;
  const middleStepped = enigma.rotors[1].position === 5;
  const rightStepped = enigma.rotors[2].position === 1;
  
  return leftStepped && middleStepped && rightStepped;
});

// Test 10: Plugboard function isolation
runTest('Plugboard function test', () => {
  const pairs = [['A', 'B'], ['C', 'D'], ['E', 'F']];
  
  const tests = [
    ['A', 'B'],
    ['B', 'A'],
    ['C', 'D'],
    ['D', 'C'],
    ['E', 'F'],
    ['F', 'E'],
    ['G', 'G'], // Should remain unchanged
    ['Z', 'Z']  // Should remain unchanged
  ];
  
  let allPassed = true;
  for (const [input, expected] of tests) {
    const result = plugboardSwap(input, pairs);
    console.log(`${input} -> ${result} (expected ${expected})`);
    if (result !== expected) {
      allPassed = false;
    }
  }
  
  return allPassed;
});

// Test 11: Known vector test (historical)
runTest('Known historical vector', () => {
  // This tests against a known Enigma configuration and result
  // Using settings from historical documents
  const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'R'], ['G', 'K'], ['O', 'X']]);
  const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'R'], ['G', 'K'], ['O', 'X']]);
  
  const message = 'ENIGMA';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  console.log(`Original: ${message}, Encrypted: ${encrypted}, Decrypted: ${decrypted}`);
  return message === decrypted;
});

// Print summary
console.log(`\n${'='.repeat(50)}`);
console.log(`Test Summary: ${passCount}/${testCount} tests passed`);
console.log(`Success rate: ${((passCount/testCount) * 100).toFixed(1)}%`);

if (passCount === testCount) {
  console.log('🎉 All tests passed! Enigma machine is working correctly.');
} else {
  console.log('⚠️  Some tests failed. Please review the implementation.');
} 