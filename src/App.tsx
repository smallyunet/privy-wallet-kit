import { useState } from 'react';
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { WalletCard } from './components/WalletCard';
import { AssetList } from './components/AssetList';
import { TransferForm, type TransferDetails } from './components/TransferForm';
import { TransactionReview } from './components/TransactionReview';
import { TransactionHistory, type Transaction } from './components/TransactionHistory';
import { type TokenDefinition } from './hooks/useAssetList';
import { useTransfer } from './hooks/useTransfer';
import './App.css';

// Sample tokens for testing (Base Sepolia or similar testnet recommended)
const SAMPLE_TOKENS: TokenDefinition[] = [
  {
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC on Base Sepolia (Example)
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
  },
  {
    address: '0x4200000000000000000000000000000000000006', // WETH on Base
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  },
];

// Sample transactions
const SAMPLE_HISTORY: Transaction[] = [
  {
    hash: '0x123...abc',
    type: 'receive',
    amount: '0.5',
    symbol: 'ETH',
    status: 'confirmed',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  },
  {
    hash: '0x456...def',
    type: 'send',
    amount: '100',
    symbol: 'USDC',
    status: 'confirmed',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    to: '0x123d35Cc6634C0532925a3b844Bc454e4438f123',
  },
];

type View = 'overview' | 'send' | 'review';

function WalletView() {
  const { ready, authenticated, login, logout } = usePrivy();
  const [view, setView] = useState<View>('overview');
  const [transferDetails, setTransferDetails] = useState<TransferDetails | null>(null);
  const { sendTransaction, loading: transferLoading, error: transferError } = useTransfer();

  if (!ready) {
    return <div className="flex items-center justify-center min-h-screen">Loading Privy...</div>;
  }

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Privy Wallet Kit Demo</h1>
        <button
          onClick={login}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Log in with Privy
        </button>
      </div>
    );
  }

  const handleReview = (details: TransferDetails) => {
    setTransferDetails(details);
    setView('review');
  };

  const handleConfirmSend = async () => {
    if (!transferDetails) return;

    try {
      await sendTransaction({
        to: transferDetails.to as `0x${string}`,
        amount: transferDetails.amount,
        tokenAddress: transferDetails.token?.address,
        decimals: transferDetails.token?.decimals,
      });
      alert('Transaction Sent!');
      setView('overview');
      setTransferDetails(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 min-h-screen bg-gray-50 dark:bg-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {view === 'overview' ? 'My Wallet' : 'Send'}
        </h1>
        {view === 'overview' && (
          <button onClick={logout} className="text-sm text-red-500 hover:text-red-600">
            Logout
          </button>
        )}
      </div>

      <div className="space-y-6">
        {view === 'overview' && (
          <>
            <section>
              <WalletCard onSendClick={() => setView('send')} />
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Assets</h2>
              <AssetList
                tokens={SAMPLE_TOKENS}
                onAssetClick={(asset) => console.log('Clicked asset:', asset)}
              />
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">History</h2>
              <TransactionHistory transactions={SAMPLE_HISTORY} />
            </section>
          </>
        )}

        {view === 'send' && (
          <TransferForm
            tokens={SAMPLE_TOKENS}
            onReview={handleReview}
            onCancel={() => setView('overview')}
          />
        )}

        {view === 'review' && transferDetails && (
          <TransactionReview
            details={transferDetails}
            onConfirm={handleConfirmSend}
            onBack={() => setView('send')}
            loading={transferLoading}
            error={transferError}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID || 'your-privy-app-id'}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      <WalletView />
    </PrivyProvider>
  );
}

export default App;
