import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWalletBalance } from './useWalletBalance';

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

describe('useWalletBalance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return null balance when no wallet is connected', () => {
    mockedUseWallets.mockReturnValue({ wallets: [] } as any);

    const { result } = renderHook(() => useWalletBalance());

    expect(result.current.balance).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch native balance when wallet is connected', async () => {
    const mockProvider = {};
    const mockGetBalance = vi.fn().mockResolvedValue(BigInt('1000000000000000000')); // 1 ETH

    mockedUseWallets.mockReturnValue({
      wallets: [
        {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          getEthereumProvider: vi.fn().mockResolvedValue(mockProvider),
        },
      ],
    } as any);

    mockedCreatePublicClient.mockReturnValue({
      getBalance: mockGetBalance,
    } as any);

    const { result } = renderHook(() => useWalletBalance());

    // Initially loading
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetBalance).toHaveBeenCalledWith({
      address: '0x1234567890abcdef1234567890abcdef12345678',
    });
    expect(result.current.balance).toBe('1');
    expect(result.current.error).toBeNull();
  });

  it('should fetch ERC20 token balance when tokenAddress is provided', async () => {
    const mockProvider = {};
    const mockReadContract = vi
      .fn()
      .mockResolvedValueOnce(BigInt('100000000')) // 100 USDC (6 decimals)
      .mockResolvedValueOnce(6); // decimals

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

    const tokenAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as `0x${string}`;

    const { result } = renderHook(() => useWalletBalance(tokenAddress));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.balance).toBe('100');
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error gracefully', async () => {
    const mockProvider = {};
    const mockError = new Error('Network error');

    mockedUseWallets.mockReturnValue({
      wallets: [
        {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          getEthereumProvider: vi.fn().mockResolvedValue(mockProvider),
        },
      ],
    } as any);

    mockedCreatePublicClient.mockReturnValue({
      getBalance: vi.fn().mockRejectedValue(mockError),
    } as any);

    const { result } = renderHook(() => useWalletBalance());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.balance).toBeNull();
    expect(result.current.error).toBe(mockError);
  });
});
