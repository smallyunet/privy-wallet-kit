import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { WalletCard } from './components/WalletCard';
import { AssetList } from './components/AssetList';
import { type TokenDefinition } from './hooks/useAssetList';
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
  }
];

function WalletView() {
  const { ready, authenticated, login, logout } = usePrivy();

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

  return (
    <div className="max-w-md mx-auto p-4 min-h-screen bg-gray-50 dark:bg-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
        <button 
          onClick={logout}
          className="text-sm text-red-500 hover:text-red-600"
        >
          Logout
        </button>
      </div>

      <div className="space-y-6">
        <section>
          <WalletCard />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Assets</h2>
          <AssetList 
            tokens={SAMPLE_TOKENS} 
            onAssetClick={(asset) => console.log('Clicked asset:', asset)}
          />
        </section>
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
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <WalletView />
    </PrivyProvider>
  );
}

export default App;
