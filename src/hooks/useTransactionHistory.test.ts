import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTransactionHistory } from './useTransactionHistory';

// Mock @privy-io/react-auth
vi.mock('@privy-io/react-auth', () => ({
  useWallets: vi.fn(),
}));

import { useWallets } from '@privy-io/react-auth';

const mockedUseWallets = vi.mocked(useWallets);

describe('useTransactionHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty transactions when no wallet is connected', () => {
    mockedUseWallets.mockReturnValue({ wallets: [] } as any);

    const { result } = renderHook(() => useTransactionHistory());

    expect(result.current.transactions).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should return empty transactions when disabled', () => {
    mockedUseWallets.mockReturnValue({
      wallets: [{ address: '0x1234' }],
    } as any);

    const { result } = renderHook(() => useTransactionHistory({ enabled: false }));

    expect(result.current.transactions).toEqual([]);
  });

  it('should fetch transactions when wallet is connected', async () => {
    mockedUseWallets.mockReturnValue({
      wallets: [{ address: '0x1234567890abcdef1234567890abcdef12345678' }],
    } as any);

    const { result } = renderHook(() => useTransactionHistory());

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for the mock API call to complete (800ms delay in the hook)
    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 2000 },
    );

    expect(result.current.transactions).toHaveLength(2);
    expect(result.current.transactions[0].type).toBe('send');
    expect(result.current.transactions[1].type).toBe('receive');
  });

  it('should provide refresh function', async () => {
    mockedUseWallets.mockReturnValue({
      wallets: [{ address: '0x1234567890abcdef1234567890abcdef12345678' }],
    } as any);

    const { result } = renderHook(() => useTransactionHistory());

    // Wait for initial fetch
    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 2000 },
    );

    // Call refresh
    act(() => {
      result.current.refresh();
    });

    expect(result.current.loading).toBe(true);
  });

  it('should return refresh function type', () => {
    mockedUseWallets.mockReturnValue({
      wallets: [{ address: '0x1234567890abcdef1234567890abcdef12345678' }],
    } as any);

    const { result } = renderHook(() => useTransactionHistory());

    expect(typeof result.current.refresh).toBe('function');
  });
});
