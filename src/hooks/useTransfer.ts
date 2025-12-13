import { useWallets } from '@privy-io/react-auth';
import { createPublicClient, createWalletClient, custom, parseAbi, parseUnits, type Address } from 'viem';
import { useState } from 'react';

export interface TransferParams {
  to: Address;
  amount: string; // Amount in human readable units (e.g. "1.5")
  tokenAddress?: Address; // If undefined, sends native currency (ETH/MATIC)
  decimals?: number; // Required for ERC20, defaults to 18 for native
}

export const useTransfer = () => {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const sendTransaction = async ({ to, amount, tokenAddress, decimals = 18 }: TransferParams) => {
    if (!wallet) {
      throw new Error('No wallet connected');
    }

    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        transport: custom(provider),
      });
      const publicClient = createPublicClient({
        transport: custom(provider),
      });

      const [account] = await walletClient.getAddresses();
      const amountBigInt = parseUnits(amount, decimals);
      let hash;

      if (tokenAddress) {
        // ERC20 Transfer
        hash = await walletClient.writeContract({
          account,
          address: tokenAddress,
          abi: parseAbi(['function transfer(address to, uint256 amount) returns (bool)']),
          functionName: 'transfer',
          args: [to, amountBigInt],
          chain: undefined, // Let the provider handle chain
        });
      } else {
        // Native Transfer
        hash = await walletClient.sendTransaction({
          account,
          to,
          value: amountBigInt,
          chain: undefined,
        });
      }

      setTxHash(hash);
      
      // Wait for receipt (optional, but good for UX)
      await publicClient.waitForTransactionReceipt({ hash });
      
      return hash;
    } catch (err) {
      console.error('Transfer failed:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendTransaction, loading, error, txHash };
};
