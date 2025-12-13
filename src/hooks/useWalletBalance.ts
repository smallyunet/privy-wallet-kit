import { useWallets } from '@privy-io/react-auth';
import { createPublicClient, custom, formatUnits, parseAbi, type Address } from 'viem';
import { useEffect, useState } from 'react';

export const useWalletBalance = (tokenAddress?: Address) => {
  const { wallets } = useWallets();
  const wallet = wallets[0]; // Use the first connected wallet
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallet) {
        setBalance(null);
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

        if (tokenAddress) {
          // Fetch ERC20 Balance
          // We need decimals to format correctly.
          // Ideally we should fetch decimals once or pass it in, but here we fetch it.
          const [rawBalance, decimals] = await Promise.all([
            publicClient.readContract({
              address: tokenAddress,
              abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
              functionName: 'balanceOf',
              args: [address],
            }),
            publicClient.readContract({
              address: tokenAddress,
              abi: parseAbi(['function decimals() view returns (uint8)']),
              functionName: 'decimals',
            }),
          ]);

          setBalance(formatUnits(rawBalance, decimals));
        } else {
          // Fetch Native ETH Balance
          const rawBalance = await publicClient.getBalance({ address });
          setBalance(formatUnits(rawBalance, 18));
        }
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError(err as Error);
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [wallet, tokenAddress]);

  return { balance, loading, error };
};
