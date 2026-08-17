import { useWallets } from '@privy-io/react-auth';
import { useState, useEffect, useCallback } from 'react';
import type { Transaction } from '../components/TransactionHistory';

export interface UseTransactionHistoryOptions {
  refreshInterval?: number;
  enabled?: boolean;
  fetcher?: TransactionHistoryFetcher;
}

export interface TransactionHistoryQuery {
  address: string;
  chainId?: string | number;
}

export type TransactionHistoryFetcher = (wallet: TransactionHistoryQuery) => Promise<Transaction[]>;

export const useTransactionHistory = (options: UseTransactionHistoryOptions = {}) => {
  const { refreshInterval = 30000, enabled = true, fetcher } = options;
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchHistory = useCallback(async () => {
    if (!wallet || !enabled || !fetcher) {
      setTransactions([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextTransactions = await fetcher({
        address: wallet.address,
        chainId: wallet.chainId,
      });
      setTransactions(nextTransactions);
    } catch (err) {
      console.error('Failed to fetch transaction history:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [wallet, enabled, fetcher]);

  useEffect(() => {
    fetchHistory();

    if (refreshInterval > 0 && enabled && fetcher) {
      const interval = setInterval(fetchHistory, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchHistory, refreshInterval, enabled, fetcher]);

  return {
    transactions,
    loading,
    error,
    refresh: fetchHistory,
    configured: Boolean(fetcher),
  };
};
