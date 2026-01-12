import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAssetList, type TokenDefinition } from './useAssetList';

// Mock viem
vi.mock('viem', async () => {
  const actual = await vi.importActual('viem');
  return {
    ...actual,
    createPublicClient: vi.fn(),
    custom: vi.fn(),
  };
});

// Mock @privy-io/react-auth
vi.mock('@privy-io/react-auth', () => ({
  useWallets: vi.fn(),
}));

import { useWallets } from '@privy-io/react-auth';
import { createPublicClient } from 'viem';

const mockedUseWallets = vi.mocked(useWallets);
const mockedCreatePublicClient = vi.mocked(createPublicClient);

describe('useAssetList', () => {
  const mockTokens: TokenDefinition[] = [
    {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
    {
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return empty assets when no wallet is connected', () => {
    mockedUseWallets.mockReturnValue({ wallets: [] } as any);

    const { result } = renderHook(() => useAssetList(mockTokens));

    expect(result.current.assets).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should return empty assets when tokens array is empty', () => {
    mockedUseWallets.mockReturnValue({
      wallets: [
        {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          getEthereumProvider: vi.fn().mockResolvedValue({}),
        },
      ],
    } as any);

    const { result } = renderHook(() => useAssetList([]));

    expect(result.current.assets).toEqual([]);
  });

  it('should fetch balances for all tokens', async () => {
    const mockProvider = {};
    const mockReadContract = vi
      .fn()
      .mockResolvedValueOnce(BigInt('100000000')) // 100 USDC
      .mockResolvedValueOnce(BigInt('50000000')); // 50 USDT

    mockedUseWallets.mockReturnValue({
      wallets: [
        {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          getEthereumProvider: vi.fn().mockResolvedValue(mockProvider),
        },
      ],
    } as any);

    mockedCreatePublicClient.mockReturnValue({
      readContract: mockReadContract,
    } as any);

    const { result } = renderHook(() => useAssetList(mockTokens));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.assets).toHaveLength(2);
    expect(result.current.assets[0].balance).toBe('100');
    expect(result.current.assets[0].symbol).toBe('USDC');
    expect(result.current.assets[1].balance).toBe('50');
    expect(result.current.assets[1].symbol).toBe('USDT');
  });

  it('should handle fetch error gracefully', async () => {
    const mockProvider = {};
    const mockError = new Error('RPC error');

    mockedUseWallets.mockReturnValue({
      wallets: [
        {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          getEthereumProvider: vi.fn().mockResolvedValue(mockProvider),
        },
      ],
    } as any);

    mockedCreatePublicClient.mockReturnValue({
      readContract: vi.fn().mockRejectedValue(mockError),
    } as any);

    const { result } = renderHook(() => useAssetList(mockTokens));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(mockError);
  });
});
