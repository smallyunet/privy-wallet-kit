import React, { useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { Wallet, ArrowDownToLine, Send } from 'lucide-react';
import { useWalletBalance } from '../hooks/useWalletBalance';
import { AddressPill } from './AddressPill';
import { NetworkBadge } from './NetworkBadge';
import { ReceiveModal } from './ReceiveModal';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WalletCardProps {
  className?: string;
  onSendClick?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({ className, onSendClick }) => {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const { balance, loading } = useWalletBalance();
  const [showReceive, setShowReceive] = useState(false);

  if (!wallet) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          'p-6 rounded-xl bg-card text-card-foreground border border-border shadow-sm',
          className,
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet size={16} />
            <span className="text-sm font-medium">Total Balance</span>
          </div>
          <div className="flex items-center gap-2">
            <NetworkBadge />
            <AddressPill address={wallet.address} />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            {loading ? (
              <div className="h-8 w-32 bg-muted rounded animate-pulse" />
            ) : (
              <>
                <span className="text-3xl font-bold">
                  {balance ? parseFloat(balance).toFixed(4) : '0.00'}
                </span>
                <span className="text-lg font-medium text-muted-foreground">ETH</span>
              </>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-1">≈ $0.00 USD</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onSendClick}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
          >
            <Send size={18} />
            Send
          </button>
          <button
            onClick={() => setShowReceive(true)}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium transition-colors"
          >
            <ArrowDownToLine size={18} />
            Receive
          </button>
        </div>
      </div>

      <ReceiveModal
        isOpen={showReceive}
        onClose={() => setShowReceive(false)}
        address={wallet.address}
      />
    </>
  );
};
