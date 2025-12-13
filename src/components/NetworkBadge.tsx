import React from 'react';
import { useWallets } from '@privy-io/react-auth';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NetworkBadgeProps {
  className?: string;
}

const CHAIN_NAMES: Record<string, string> = {
  '1': 'Ethereum',
  '11155111': 'Sepolia',
  '137': 'Polygon',
  '80001': 'Mumbai',
  '8453': 'Base',
  '84532': 'Base Sepolia',
  '10': 'Optimism',
  '42161': 'Arbitrum',
};

export const NetworkBadge: React.FC<NetworkBadgeProps> = ({ className }) => {
  const { wallets } = useWallets();
  const wallet = wallets[0];

  if (!wallet) return null;

  // wallet.chainId is usually a string like "eip155:1" or just number/string.
  // Privy wallets usually return chainId as string in format "eip155:1" for EVM.
  // Let's parse it.

  const chainId = wallet.chainId.split(':')[1] || wallet.chainId;
  const networkName = CHAIN_NAMES[chainId] || `Chain ID: ${chainId}`;

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary border border-border',
        className,
      )}
    >
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-xs font-medium text-secondary-foreground">{networkName}</span>
    </div>
  );
};
