import { useWallets } from '@privy-io/react-auth';
import { useCallback } from 'react';

export const useNetwork = () => {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const parseChainId = (id: string | number) => {
    if (typeof id === 'number') return id;
    if (typeof id === 'string' && id.startsWith('eip155:')) {
      return parseInt(id.split(':')[1]);
    }
    return parseInt(id as string);
  };

  const chainId = wallet?.chainId ? parseChainId(wallet.chainId) : null;

  const switchNetwork = useCallback(
    async (targetChainId: number) => {
      if (!wallet) return;
      try {
        await wallet.switchChain(targetChainId);
      } catch (e) {
        console.error('Failed to switch network:', e);
        throw e;
      }
    },
    [wallet],
  );

  return { chainId, switchNetwork };
};
