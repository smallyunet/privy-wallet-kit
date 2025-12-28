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
}

export const useNFTs = (options: UseNFTsOptions = {}) => {
  const { refreshInterval = 60000, enabled = true } = options;
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);

  const fetchNFTs = useCallback(async () => {
    if (!wallet || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      // NOTE: Standard Viem/Privy doesn't provide easy NFT lists.
      // Requires an indexer like Alchemy/Moralis/SimpleHash.

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockNFTs: NFT[] = [
        {
          contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
          tokenId: '1234',
          name: 'Bored Ape #1234',
          description: 'A mock ape for testing',
          image: 'https://img.seadn.io/files/6b7f3b5894b95f265691f964082269a8.png',
          tokenType: 'ERC721',
          collectionName: 'Bored Ape Yacht Club',
        },
      ];

      setNfts(mockNFTs);
    } catch (err) {
      console.error('Failed to fetch NFTs:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [wallet, enabled]);

  useEffect(() => {
    fetchNFTs();

    if (refreshInterval > 0 && enabled) {
      const interval = setInterval(fetchNFTs, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchNFTs, refreshInterval, enabled]);

  return {
    nfts,
    loading,
    error,
    refresh: fetchNFTs,
  };
};
