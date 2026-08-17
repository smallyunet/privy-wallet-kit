import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useNFTs } from './useNFTs';

// Mock @privy-io/react-auth
vi.mock('@privy-io/react-auth', () => ({
  useWallets: vi.fn(),
}));

import { useWallets } from '@privy-io/react-auth';

const mockedUseWallets = vi.mocked(useWallets);

describe('useNFTs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty NFTs when no wallet is connected', () => {
    mockedUseWallets.mockReturnValue({ wallets: [] } as any);

    const { result } = renderHook(() => useNFTs());

    expect(result.current.nfts).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should return empty NFTs when disabled', () => {
    mockedUseWallets.mockReturnValue({
      wallets: [{ address: '0x1234' }],
    } as any);

    const { result } = renderHook(() => useNFTs({ enabled: false }));

    expect(result.current.nfts).toEqual([]);
  });

  it('should not invent NFT data when no fetcher is configured', () => {
    mockedUseWallets.mockReturnValue({
      wallets: [{ address: '0x1234567890abcdef1234567890abcdef12345678' }],
    } as any);

    const { result } = renderHook(() => useNFTs());

    expect(result.current.nfts).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.configured).toBe(false);
  });

  it('should fetch NFTs from the configured data source', async () => {
    const fetcher = vi.fn().mockResolvedValue([
      {
        contractAddress: '0xabc',
        tokenId: '1',
        name: 'Indexed NFT',
        tokenType: 'ERC721',
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

    const { result } = renderHook(() => useNFTs({ fetcher }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.nfts).toHaveLength(1);
    expect(result.current.nfts[0].name).toBe('Indexed NFT');
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

    const { result } = renderHook(() => useNFTs({ fetcher, refreshInterval: 0 }));

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

    const { result } = renderHook(() => useNFTs());

    expect(typeof result.current.refresh).toBe('function');
  });
});
