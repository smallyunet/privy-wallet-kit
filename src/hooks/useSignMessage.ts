import { useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom } from 'viem';
import { useState } from 'react';

export const useSignMessage = () => {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const signMessage = async (message: string) => {
    if (!wallet) throw new Error('No wallet connected');

    setLoading(true);
    setError(null);
    setSignature(null);

    try {
      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        transport: custom(provider),
      });

      const [account] = await walletClient.getAddresses();
      const sig = await walletClient.signMessage({
        account,
        message,
      });

      setSignature(sig);
      return sig;
    } catch (err) {
      console.error('Signing failed:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signTypedData = async (typedData: any) => {
    if (!wallet) throw new Error('No wallet connected');

    setLoading(true);
    setError(null);
    setSignature(null);

    try {
      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        transport: custom(provider),
      });

      const [account] = await walletClient.getAddresses();
      const sig = await walletClient.signTypedData({
        account,
        ...typedData,
      });

      setSignature(sig);
      return sig;
    } catch (err) {
      console.error('Typed data signing failed:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    signMessage,
    signTypedData,
    loading,
    error,
    signature,
  };
};
