import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatAddress } from '../utils';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useTransactionHistory } from '../hooks/useTransactionHistory';

export interface Transaction {
  hash: string;
  type: 'send' | 'receive';
  amount: string;
  symbol: string;
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: number;
  to?: string;
  from?: string;
}

interface TransactionHistoryProps {
  transactions?: Transaction[];
  className?: string;
  onTransactionClick?: (tx: Transaction) => void;
  autoFetch?: boolean;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions: propsTransactions,
  className,
  onTransactionClick,
  autoFetch = true,
}) => {
  const { transactions: hookTransactions, loading } = useTransactionHistory({
    enabled: autoFetch && !propsTransactions,
  });

  const transactions = propsTransactions || hookTransactions;

  if (loading && transactions.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-8 text-muted-foreground', className)}>
        <Loader2 size={20} className="animate-spin mr-2" />
        <span>Loading transactions...</span>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>No transactions found</div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {transactions.map((tx) => (
        <div
          key={tx.hash}
          onClick={() => onTransactionClick?.(tx)}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer border border-transparent hover:border-border"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                tx.type === 'send'
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
              )}
            >
              {tx.type === 'send' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
            </div>
            <div>
              <div className="font-medium text-foreground">
                {tx.type === 'send' ? 'Sent' : 'Received'} {tx.symbol}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                {tx.status === 'confirmed' && <CheckCircle2 size={10} className="text-green-500" />}
                {tx.status === 'pending' && <Clock size={10} className="text-yellow-500" />}
                {tx.status === 'failed' && <XCircle size={10} className="text-destructive" />}
                <span>{new Date(tx.timestamp).toLocaleString()}</span>
                <span>•</span>
                <span>
                  {tx.type === 'send' ? formatAddress(tx.to || '') : formatAddress(tx.from || '')}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div
              className={cn(
                'font-medium',
                tx.type === 'send' ? 'text-foreground' : 'text-green-600 dark:text-green-400',
              )}
            >
              {tx.type === 'send' ? '-' : '+'}
              {tx.amount}
            </div>
            <div className="text-xs text-muted-foreground">{tx.symbol}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
