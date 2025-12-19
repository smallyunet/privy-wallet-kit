import React from 'react';
import { useWallets } from '@privy-io/react-auth';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface NetworkBadgeProps {
  className?: string;
}

export interface NetworkBadgeViewProps extends NetworkBadgeProps {
  chainId: string;
}

import { CHAIN_NAMES } from '../constants';

export const NetworkBadgeView: React.FC<NetworkBadgeViewProps> = ({ className, chainId }) => {
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

export const NetworkBadge: React.FC<NetworkBadgeProps> = ({ className }) => {
  const { wallets } = useWallets();
  const wallet = wallets[0];

  if (!wallet) return null;

  const chainId = wallet.chainId.split(':')[1] || wallet.chainId;

  return <NetworkBadgeView className={className} chainId={chainId} />;
};
