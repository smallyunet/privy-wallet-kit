import { describe, it, expect } from 'vitest';
import { normalizeChainIdString, parseChainIdNumber } from './chain';

describe('chain utils', () => {
  it('normalizeChainIdString should handle eip155 format', () => {
    expect(normalizeChainIdString('eip155:137')).toBe('137');
  });

  it('normalizeChainIdString should handle numeric input', () => {
    expect(normalizeChainIdString(1)).toBe('1');
  });

  it('parseChainIdNumber should parse numeric strings', () => {
    expect(parseChainIdNumber('11155111')).toBe(11155111);
  });

  it('parseChainIdNumber should return null for null/undefined', () => {
    expect(parseChainIdNumber(null)).toBeNull();
    expect(parseChainIdNumber(undefined)).toBeNull();
  });
});
