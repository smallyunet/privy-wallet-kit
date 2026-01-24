import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNetwork } from './useNetwork';

// Mock @privy-io/react-auth
vi.mock('@privy-io/react-auth', () => ({
  useWallets: vi.fn(),
}));

import { useWallets } from '@privy-io/react-auth';

const mockedUseWallets = vi.mocked(useWallets);

describe('useNetwork', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null chainId when no wallet is connected', () => {
    mockedUseWallets.mockReturnValue({ wallets: [] } as any);

    const { result } = renderHook(() => useNetwork());

    expect(result.current.chainId).toBeNull();
  });

  it('should parse numeric chainId correctly', () => {
    mockedUseWallets.mockReturnValue({
      wallets: [{ chainId: 1 }],
    } as any);

    const { result } = renderHook(() => useNetwork());

    expect(result.current.chainId).toBe(1);
  });

  it('should parse eip155 formatted chainId correctly', () => {
    mockedUseWallets.mockReturnValue({
      wallets: [{ chainId: 'eip155:137' }],
    } as any);

    const { result } = renderHook(() => useNetwork());

    expect(result.current.chainId).toBe(137);
  });

  it('should parse string numeric chainId correctly', () => {
    mockedUseWallets.mockReturnValue({
      wallets: [{ chainId: '11155111' }],
    } as any);

    const { result } = renderHook(() => useNetwork());

    expect(result.current.chainId).toBe(11155111);
  });

  it('should call switchChain when switchNetwork is called', async () => {
    const mockSwitchChain = vi.fn().mockResolvedValue(undefined);
    mockedUseWallets.mockReturnValue({
      wallets: [{ chainId: 1, switchChain: mockSwitchChain }],
    } as any);

    const { result } = renderHook(() => useNetwork());

    await act(async () => {
      await result.current.switchNetwork(137);
    });

    expect(mockSwitchChain).toHaveBeenCalledWith(137);
  });

  it('should handle switchNetwork failure gracefully', async () => {
    const mockError = new Error('Switch failed');
    const mockSwitchChain = vi.fn().mockRejectedValue(mockError);
    mockedUseWallets.mockReturnValue({
      wallets: [{ chainId: 1, switchChain: mockSwitchChain }],
    } as any);

    const { result } = renderHook(() => useNetwork());

    await expect(
      act(async () => {
        await result.current.switchNetwork(137);
      }),
    ).rejects.toThrow('Switch failed');
  });

  it('should not call switchChain when no wallet is connected', async () => {
    mockedUseWallets.mockReturnValue({ wallets: [] } as any);

    const { result } = renderHook(() => useNetwork());

    await act(async () => {
      await result.current.switchNetwork(137);
    });

    // Should not throw, just return early
  });
});
