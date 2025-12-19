import React from 'react';
import { useNetwork } from '../hooks/useNetwork';
import { CHAIN_NAMES } from '../constants';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type TransferDetails } from './TransferForm';
import { AddressPill } from './AddressPill';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TransactionReviewProps {
  details: TransferDetails;
  onConfirm: () => Promise<void>;
  onBack: () => void;
  loading?: boolean;
  error?: Error | null;
  className?: string;
  gasEstimate?: string | null;
}

export const TransactionReview: React.FC<TransactionReviewProps> = ({
  details,
  onConfirm,
  onBack,
  loading,
  error,
  className,
  gasEstimate,
}) => {
  const { chainId } = useNetwork();
  const networkName = chainId
    ? CHAIN_NAMES[chainId.toString()] || `Chain ID: ${chainId}`
    : 'Unknown Network';

  return (
    <div
      className={cn(
        'p-6 bg-card text-card-foreground rounded-xl border border-border shadow-sm',
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          disabled={loading}
          className="p-1 -ml-1 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground disabled:opacity-50"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">Review Transaction</h2>
      </div>

      <div className="space-y-6">
        <div className="text-center py-6 bg-muted rounded-xl">
          <div className="text-3xl font-bold mb-1">
            {details.amount} {details.token ? details.token.symbol : 'ETH'}
          </div>
          <div className="text-sm text-muted-foreground">≈ $0.00 USD</div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">To</span>
            <AddressPill address={details.to} />
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">Network</span>
            <span className="font-medium">{networkName}</span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">Estimated Gas</span>
            <span className="font-medium">
              {gasEstimate ? `~${gasEstimate} ETH` : 'Loading...'}
            </span>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error.message}</span>
          </div>
        )}

        <button
          onClick={onConfirm}
          disabled={loading}
          className="w-full py-3 px-4 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Confirming...
            </>
          ) : (
            'Confirm Send'
          )}
        </button>
      </div>
    </div>
  );
};
