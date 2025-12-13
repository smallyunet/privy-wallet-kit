import { useWallets } from '@privy-io/react-auth';
import { createPublicClient, custom, formatUnits, parseAbi, type Address } from 'viem';
import { useEffect, useState } from 'react';

export interface TokenDefinition {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
}

export interface Asset extends TokenDefinition {
  balance: string;
  balanceRaw: bigint;
}

export const useAssetList = (tokens: TokenDefinition[]) => {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!wallet || tokens.length === 0) {
        setAssets([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const provider = await wallet.getEthereumProvider();
        const publicClient = createPublicClient({
          transport: custom(provider),
        });
        const address = wallet.address as Address;

        // Create contract calls for all tokens
        // For simplicity and compatibility, we'll use Promise.all with individual reads for now
        const balances = await Promise.all(
          tokens.map(
            (token) =>
              publicClient.readContract({
                address: token.address,
                abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
                functionName: 'balanceOf',
                args: [address],
              }) as Promise<bigint>,
          ),
        );

        const assetsWithBalance: Asset[] = tokens.map((token, index) => ({
          ...token,
          balanceRaw: balances[index],
          balance: formatUnits(balances[index], token.decimals),
        }));

        setAssets(assetsWithBalance);
      } catch (err) {
        console.error('Error fetching asset list:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, JSON.stringify(tokens)]); // Use stringified tokens to avoid infinite loop if array ref changes

  return { assets, loading, error };
};
