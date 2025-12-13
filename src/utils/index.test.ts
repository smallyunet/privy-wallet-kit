import { describe, it, expect } from 'vitest';
import { formatAddress } from './index';

describe('formatAddress', () => {
  it('should format address correctly with default chars', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    expect(formatAddress(address)).toBe('0x1234...5678');
  });

  it('should format address correctly with custom chars', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    expect(formatAddress(address, 6)).toBe('0x123456...345678');
  });

  it('should return empty string for undefined address', () => {
    expect(formatAddress(undefined)).toBe('');
  });
});
