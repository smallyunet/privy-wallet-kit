import { useWallets } from '@privy-io/react-auth';
import { useState, useEffect, useCallback } from 'react';
import type { Transaction } from '../components/TransactionHistory';

export interface UseTransactionHistoryOptions {
    refreshInterval?: number;
    enabled?: boolean;
}

export const useTransactionHistory = (options: UseTransactionHistoryOptions = {}) => {
    const { refreshInterval = 30000, enabled = true } = options;
    const { wallets } = useWallets();
    const wallet = wallets[0];
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchHistory = useCallback(async () => {
        if (!wallet || !enabled) return;

        setLoading(true);
        setError(null);

        try {
            // NOTE: Standard Viem/Privy doesn't provide easy history. 
            // In a real implementation, you'd fetch from an indexer like Alchemy/Moralis/Etherscan.
            // For now, we return mock data to demonstrate the hook structure.

            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 800));

            const mockTxs: Transaction[] = [
                {
                    hash: '0x123...456',
                    type: 'send',
                    amount: '0.5',
                    symbol: 'ETH',
                    status: 'confirmed',
                    timestamp: Date.now() - 3600000,
                    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
                },
                {
                    hash: '0x789...012',
                    type: 'receive',
                    amount: '100',
                    symbol: 'USDC',
                    status: 'confirmed',
                    timestamp: Date.now() - 86400000,
                    from: '0x123d35Cc6634C0532925a3b844Bc454e4438f44e'
                }
            ];

            setTransactions(mockTxs);
        } catch (err) {
            console.error('Failed to fetch transaction history:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [wallet, enabled]);

    useEffect(() => {
        fetchHistory();

        if (refreshInterval > 0 && enabled) {
            const interval = setInterval(fetchHistory, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchHistory, refreshInterval, enabled]);

    return {
        transactions,
        loading,
        error,
        refresh: fetchHistory
    };
};
