import React, { useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { Wallet, ArrowDownToLine, Send } from 'lucide-react';
import { useWalletBalance } from '../hooks/useWalletBalance';
import { AddressPill } from './AddressPill';
import { NetworkBadge, NetworkBadgeView } from './NetworkBadge';
import { ReceiveModal } from './ReceiveModal';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface WalletCardProps {
  className?: string;
  onSendClick?: () => void;
}

export interface WalletCardViewProps extends WalletCardProps {
  address: string;
  balance: string | null;
  loading?: boolean;
  chainId?: string;
}

export const WalletCardView: React.FC<WalletCardViewProps> = ({
  className,
  onSendClick,
  address,
  balance,
  loading,
  chainId,
}) => {
  const [showReceive, setShowReceive] = useState(false);

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
            {chainId ? <NetworkBadgeView chainId={chainId} /> : <NetworkBadge />}
            <AddressPill address={address} />
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

      <ReceiveModal isOpen={showReceive} onClose={() => setShowReceive(false)} address={address} />
    </>
  );
};

export const WalletCard: React.FC<WalletCardProps> = (props) => {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const { balance, loading } = useWalletBalance();

  if (!wallet) {
    return null;
  }

  const chainId = wallet.chainId.split(':')[1] || wallet.chainId;

  return (
    <WalletCardView
      {...props}
      address={wallet.address}
      balance={balance}
      loading={loading}
      chainId={chainId}
    />
  );
};
