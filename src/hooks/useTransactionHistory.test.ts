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

  it('should not invent transaction data when no fetcher is configured', () => {
    mockedUseWallets.mockReturnValue({
      wallets: [{ address: '0x1234567890abcdef1234567890abcdef12345678' }],
    } as any);

    const { result } = renderHook(() => useTransactionHistory());

    expect(result.current.transactions).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.configured).toBe(false);
  });

  it('should fetch transactions from the configured data source', async () => {
    const fetcher = vi.fn().mockResolvedValue([
      {
        hash: '0x123',
        type: 'send',
        amount: '1',
        symbol: 'ETH',
        status: 'confirmed',
        timestamp: 1,
      },
    ]);
    mockedUseWallets.mockReturnValue({
      wallets: [
        {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          chainId: 'eip155:1',
        },
      ],
    } as any);

    const { result } = renderHook(() => useTransactionHistory({ fetcher }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].type).toBe('send');
    expect(result.current.configured).toBe(true);
    expect(fetcher).toHaveBeenCalledWith({
      address: '0x1234567890abcdef1234567890abcdef12345678',
      chainId: 'eip155:1',
    });
  });

  it('should provide refresh function', async () => {
    let resolveFetch: (value: []) => void = () => undefined;
    const fetcher = vi.fn().mockImplementation(
      () =>
        new Promise<[]>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    mockedUseWallets.mockReturnValue({
      wallets: [{ address: '0x1234567890abcdef1234567890abcdef12345678' }],
    } as any);

    const { result } = renderHook(() => useTransactionHistory({ fetcher, refreshInterval: 0 }));

    await waitFor(() => expect(result.current.loading).toBe(true));
    await act(async () => {
      resolveFetch([]);
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => void result.current.refresh());
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
