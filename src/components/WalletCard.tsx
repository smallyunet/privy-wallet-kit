import React from 'react';
import { useWallets } from '@privy-io/react-auth';
import { Copy, Wallet } from 'lucide-react';
import { useWalletBalance } from '../hooks/useWalletBalance';
import { formatAddress, copyToClipboard } from '../utils';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WalletCardProps {
  className?: string;
}

export const WalletCard: React.FC<WalletCardProps> = ({ className }) => {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const { balance, loading } = useWalletBalance();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (wallet?.address) {
      copyToClipboard(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!wallet) {
    return null;
  }

  return (
    <div className={cn("p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Wallet size={16} />
          <span className="text-sm font-medium">Total Balance</span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs text-gray-500"
        >
          <span>{formatAddress(wallet.address)}</span>
          {copied ? <span className="text-green-500 text-[10px]">Copied!</span> : <Copy size={12} />}
        </button>
      </div>
      
      <div className="flex items-baseline gap-1">
        {loading ? (
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        ) : (
          <>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {balance ? parseFloat(balance).toFixed(4) : '0.00'}
            </span>
            <span className="text-lg font-medium text-gray-500">ETH</span>
          </>
        )}
      </div>
    </div>
  );
};
