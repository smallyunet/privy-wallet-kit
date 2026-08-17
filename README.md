# Privy Wallet Kit

[![npm version](https://img.shields.io/npm/v/privy-wallet-kit.svg?style=flat-square)](https://www.npmjs.com/package/privy-wallet-kit)
[![npm downloads](https://img.shields.io/npm/dm/privy-wallet-kit.svg?style=flat-square)](https://www.npmjs.com/package/privy-wallet-kit)
[![License](https://img.shields.io/npm/l/privy-wallet-kit.svg?style=flat-square)](https://github.com/smallyunet/privy-wallet-kit/blob/main/LICENSE)

Privy Wallet Kit is an experimental React component and hook library for EVM wallets connected through Privy.

> **Maintenance mode:** This project receives critical compatibility and security fixes only. No new features are planned. For new applications, prefer Privy's official React hooks and wallet UI components.

## Scope

The package provides:

- Presentational wallet components such as `WalletCard`, `AssetList`, `TransferForm`, `TransactionHistory`, and `NFTGallery`.
- EVM-focused hooks for balances, ERC-20 assets, transfers, message signing, and network switching.
- Optional fetcher interfaces for transaction history and NFT data.

The package does **not** include an NFT or transaction-history indexer. `NFTGallery` and `TransactionHistory` must receive data directly or use an application-provided fetcher. They never generate placeholder wallet data.

This project does not support Privy's Solana or extended-chain wallets. It also does not replace Privy's current transaction confirmation UI, gas sponsorship, or funding flows.

## Installation

```bash
npm install privy-wallet-kit @privy-io/react-auth viem react react-dom
```

## Privy setup

Wrap the application with Privy's provider. The package supports React 18 and React 19.

```tsx
import { PrivyProvider } from '@privy-io/react-auth';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="your-privy-app-id"
      config={{
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
```

## Components and hooks

```tsx
import { AssetList, NetworkSwitcher, TransferForm } from 'privy-wallet-kit';
import 'privy-wallet-kit/style.css';

export function WalletPage() {
  return (
    <div className="space-y-4">
      <NetworkSwitcher />
      <AssetList tokens={[]} />
      <TransferForm onReview={console.log} onCancel={() => undefined} />
    </div>
  );
}
```

For new transaction and signing flows, prefer Privy's official `useSendTransaction` and `useSignMessage` hooks. The corresponding hooks in this package are retained for existing consumers.

## Indexed data

Pass already-fetched data to the presentational components:

```tsx
import { NFTGallery, TransactionHistory } from 'privy-wallet-kit';

<NFTGallery nfts={nftsFromYourIndexer} />;
<TransactionHistory transactions={transactionsFromYourIndexer} />;
```

Or provide an indexer-backed fetcher:

```tsx
import { NFTGallery, TransactionHistory } from 'privy-wallet-kit';

<NFTGallery
  fetcher={({ address, chainId }) =>
    fetch(`/api/nfts?address=${address}&chainId=${chainId}`).then((response) => response.json())
  }
/>;

<TransactionHistory
  fetcher={({ address, chainId }) =>
    fetch(`/api/transactions?address=${address}&chainId=${chainId}`).then((response) =>
      response.json(),
    )
  }
/>;
```

The application is responsible for indexer credentials, pagination, normalization, and chain coverage.

## Support policy

- Critical security and compatibility fixes may be accepted.
- Feature requests and roadmap expansion are out of scope.
- APIs remain alpha and may not cover production requirements.
- See the [Storybook](https://smallyunet.github.io/privy-wallet-kit/) for the currently documented components.

## License

MIT
