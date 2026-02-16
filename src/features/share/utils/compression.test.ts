import { compressCode, decompressCode } from './compression';

// Simple test suite
const testCompression = () => {
  const testCases = [
    'hello world',
    '# Simple YAML\nkey: value\nlist:\n  - item 1\n  - item 2',
    '',
    '   ',
    '{"json": "test"}'
  ];

  console.log('Running compression tests...');

  testCases.forEach((code, index) => {
    const compressed = compressCode(code);
    const decompressed = decompressCode(compressed);

    if (decompressed === code) {
      console.log(`Test Case ${index + 1}: PASSED`);
    } else {
      console.error(`Test Case ${index + 1}: FAILED`);
      console.error(`Expected: "${code}"`);
      console.error(`Got: "${decompressed}"`);
    }
  });
};

// In a real Vitest/Jest environment, this would be:
// import { expect, it, describe } from 'vitest';
// describe('compression utils', () => { ... });

// For now, we can just export it or leave it as a reference.
export { testCompression };
