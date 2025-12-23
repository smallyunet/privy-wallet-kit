import { useState } from 'react';
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { WalletCard } from './components/WalletCard';
import { AssetList } from './components/AssetList';
import { TransferForm, type TransferDetails } from './components/TransferForm';
import { TransactionReview } from './components/TransactionReview';
import { TransactionHistory } from './components/TransactionHistory';
import { type TokenDefinition } from './hooks/useAssetList';
import { useTransfer } from './hooks/useTransfer';
import { NetworkSwitcher } from './components/NetworkSwitcher';
import { SignMessageForm } from './components/SignMessageForm';
import { NFTGallery } from './components/NFTGallery';
import { Shield, Image, ArrowLeft } from 'lucide-react';
import './App.css';

// Sample tokens for testing (Base Sepolia or similar testnet recommended)
const SAMPLE_TOKENS: TokenDefinition[] = [
  {
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
  },
];

type View = 'overview' | 'send' | 'review' | 'sign' | 'nfts';

function WalletView() {
  const { ready, authenticated, login, logout } = usePrivy();
  const [view, setView] = useState<View>('overview');
  const [transferDetails, setTransferDetails] = useState<TransferDetails | null>(null);
  const {
    sendTransaction,
    estimateGas,
    loading: transferLoading,
    error: transferError,
    gasEstimate,
  } = useTransfer();

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

  const handleReview = async (details: TransferDetails) => {
    setTransferDetails(details);
    setView('review');
    // Trigger gas estimation
    await estimateGas({
      to: details.to as `0x${string}`,
      amount: details.amount,
      tokenAddress: details.token?.address,
      decimals: details.token?.decimals,
    });
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
        <div className="flex items-center gap-2">
          <NetworkSwitcher />
          {view === 'overview' && (
            <button onClick={logout} className="text-sm text-red-500 hover:text-red-600">
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {view === 'overview' && (
          <>
            <section>
              <WalletCard onSendClick={() => setView('send')} />
            </section>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setView('sign')}
                className="p-4 bg-card border border-border rounded-xl hover:bg-accent hover:text-accent-foreground transition-all flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Shield size={20} />
                </div>
                <span className="text-sm font-medium">Sign</span>
              </button>
              <button
                onClick={() => setView('nfts')}
                className="p-4 bg-card border border-border rounded-xl hover:bg-accent hover:text-accent-foreground transition-all flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <Image size={20} />
                </div>
                <span className="text-sm font-medium">NFTs</span>
              </button>
            </div>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Assets</h2>
              <AssetList
                tokens={SAMPLE_TOKENS}
                onAssetClick={(asset) => console.log('Clicked asset:', asset)}
              />
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">History</h2>
              <TransactionHistory />
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

        {view === 'sign' && (
          <div className="space-y-4">
            <button
              onClick={() => setView('overview')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <SignMessageForm onSuccess={(sig) => console.log('Signed:', sig)} />
          </div>
        )}

        {view === 'nfts' && (
          <div className="space-y-4">
            <button
              onClick={() => setView('overview')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your NFTs</h2>
            <NFTGallery />
          </div>
        )}

        {view === 'review' && transferDetails && (
          <TransactionReview
            details={transferDetails}
            onConfirm={handleConfirmSend}
            onBack={() => setView('send')}
            loading={transferLoading}
            error={transferError}
            gasEstimate={gasEstimate}
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
