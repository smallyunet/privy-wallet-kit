import { useWallets } from '@privy-io/react-auth';
import { useState, useEffect, useCallback } from 'react';

export interface NFT {
  contractAddress: string;
  tokenId: string;
  name: string;
  description?: string;
  image?: string;
  tokenType: 'ERC721' | 'ERC1155';
  collectionName?: string;
}

export interface UseNFTsOptions {
  refreshInterval?: number;
  enabled?: boolean;
  fetcher?: NFTFetcher;
}

export interface WalletQueryContext {
  address: string;
  chainId?: string | number;
}

export type NFTFetcher = (wallet: WalletQueryContext) => Promise<NFT[]>;

export const useNFTs = (options: UseNFTsOptions = {}) => {
  const { refreshInterval = 60000, enabled = true, fetcher } = options;
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);

  const fetchNFTs = useCallback(async () => {
    if (!wallet || !enabled || !fetcher) {
      setNfts([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextNfts = await fetcher({
        address: wallet.address,
        chainId: wallet.chainId,
      });
      setNfts(nextNfts);
    } catch (err) {
      console.error('Failed to fetch NFTs:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [wallet, enabled, fetcher]);

  useEffect(() => {
    fetchNFTs();

    if (refreshInterval > 0 && enabled && fetcher) {
      const interval = setInterval(fetchNFTs, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchNFTs, refreshInterval, enabled, fetcher]);

  return {
    nfts,
    loading,
    error,
    refresh: fetchNFTs,
    configured: Boolean(fetcher),
  };
};
