import { useWallets } from '@privy-io/react-auth';
import { useCallback } from 'react';
import { parseChainIdNumber } from '../utils/chain';

export const useNetwork = () => {
  const { wallets } = useWallets();
  const wallet = wallets[0];

  const chainId = parseChainIdNumber(wallet?.chainId);

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
