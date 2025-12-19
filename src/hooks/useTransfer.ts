import { useWallets } from '@privy-io/react-auth';
import {
  createPublicClient,
  createWalletClient,
  custom,
  parseAbi,
  parseUnits,
  type Address,
} from 'viem';
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
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);

  const estimateGas = async ({ to, amount, tokenAddress, decimals = 18 }: TransferParams) => {
    if (!wallet) return;
    setError(null);
    try {
      const provider = await wallet.getEthereumProvider();
      const publicClient = createPublicClient({
        transport: custom(provider),
      });

      const [account] = await (await wallet.getEthereumProvider()).request({ method: 'eth_requestAccounts' });
      const amountBigInt = parseUnits(amount, decimals);
      let gas;

      if (tokenAddress) {
        // ERC20 gas est
        gas = await publicClient.estimateContractGas({
          account: account as Address,
          address: tokenAddress,
          abi: parseAbi(['function transfer(address to, uint256 amount) returns (bool)']),
          functionName: 'transfer',
          args: [to, amountBigInt],
        });
      } else {
        // Native gas est
        gas = await publicClient.estimateGas({
          account: account as Address,
          to,
          value: amountBigInt,
        });
      }

      // Convert to ETH string for display (basic) - typically you want exact BigInt, 
      // but for UI display we often just want a rough estimate.
      // Actually standard practice is to return fees in ETH. 
      // simple estimation: gasUnits * gasPrice
      // let's just return the units for now or convert cleanly?
      // The requirement says "string (in ETH)".

      const gasPrice = await publicClient.getGasPrice();
      // gas * gasPrice = wei
      // formatEther(wei)

      const estimatedFeeWei = gas * gasPrice;
      // We need formatEther from viem
      const { formatEther } = await import('viem');
      setGasEstimate(formatEther(estimatedFeeWei));

      return gas;
    } catch (err) {
      console.error('Gas estimation failed:', err);
      // Don't set global error for estimation, just maybe log or set specific estimation error
      // setError(err as Error); 
    }
  };

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

  return { sendTransaction, estimateGas, loading, error, txHash, gasEstimate };
};
