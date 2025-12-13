# Privy Wallet Kit 🛠️

[![npm version](https://img.shields.io/npm/v/privy-wallet-kit.svg?style=flat-square)](https://www.npmjs.com/package/privy-wallet-kit)
[![npm downloads](https://img.shields.io/npm/dm/privy-wallet-kit.svg?style=flat-square)](https://www.npmjs.com/package/privy-wallet-kit)
[![License](https://img.shields.io/npm/l/privy-wallet-kit.svg?style=flat-square)](https://github.com/smallyunet/privy-wallet-kit/blob/main/LICENSE)

**Privy Wallet Kit** is an open-source React UI component library designed specifically for **Privy Embedded Wallets**.


It provides developers with "drop-in" components (like Token Lists, Transfer Forms, Transaction History) so you don't have to rebuild the UI for Privy's headless wallet system from scratch.

> 🚧 **Status: Active Development** - This library is currently in early alpha.

## 🌟 Features

- **🧩 Drop-in UI Components**: Ready-to-use components for common wallet operations.
- **🎣 Headless Hooks**: Logic is separated from UI. Use our hooks (`useWalletBalance`, `useTransfer`) to build your own custom UI if needed.
- **🎨 Shadcn-like Architecture**: Built with Tailwind CSS. Components are fully customizable via `className` and designed to be copied/pasted or imported directly.
- **⚡ Powered by Viem**: Robust and type-safe blockchain interactions.
- **🔐 Zero Global State**: Relies on Privy's context. No Redux or Zustand required.

## 📦 Installation

You can find the package on [npm](https://www.npmjs.com/package/privy-wallet-kit).

```bash
npm install privy-wallet-kit
# Peer dependencies
npm install @privy-io/react-auth viem react react-dom
```


## 🚀 Usage

### 1. Setup Privy Provider

Ensure your app is wrapped in the `PrivyProvider` from `@privy-io/react-auth`.

```tsx
import { PrivyProvider } from '@privy-io/react-auth';

export const App = () => {
  return (
    <PrivyProvider
      appId="your-privy-app-id"
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <YourApp />
    </PrivyProvider>
  );
};
```

### 2. Use Hooks (Headless)

```tsx
import { useWalletBalance } from 'privy-wallet-kit';

const MyBalance = () => {
  // Fetch Native ETH Balance
  const { balance, loading, error } = useWalletBalance();
  
  // Or Fetch ERC20 Balance
  // const { balance } = useWalletBalance('0x...'); 

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading balance</div>;

  return <div>Balance: {balance} ETH</div>;
};
```

### 3. Use Components (Coming Soon)

```tsx
import { TokenList, TransferCard } from 'privy-wallet-kit';
import 'privy-wallet-kit/dist/style.css'; // Import styles

const WalletPage = () => {
  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <TokenList />
      <TransferCard />
    </div>
  );
};
```

## 🗺️ Roadmap

- [x] **Phase 1: Project Scaffolding** - Vite library mode, Tailwind setup.
- [x] **Phase 2: Core Hooks** - `useWalletBalance`, `useAssetList`, `useTransfer`.
- [ ] **Phase 3: UI Components** - `TokenList`, `AssetCard`, `TransferCard`.
- [ ] **Phase 4: Utilities** - Formatting helpers.

## 🛠️ Tech Stack

- **React 18+**
- **Tailwind CSS**
- **@privy-io/react-auth**
- **Viem**
- **Lucide React**

## 📄 License

MIT
# privy-wallet-kit
