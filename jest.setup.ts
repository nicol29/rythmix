import '@testing-library/jest-dom';

jest.mock('path/to/image.svg', () => 'svg');

if (typeof TextEncoder === 'undefined' || typeof TextDecoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

