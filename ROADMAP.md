# 🗺️ Privy Wallet Kit Roadmap

This roadmap outlines the development plan to build a comprehensive, "MetaMask-like" UI component library for Privy Embedded Wallets.

##  Phase 1: Foundation & Core Hooks (Current Focus)
Establish the data layer and basic connectivity.

- [x] **Project Setup**: Vite, TypeScript, Tailwind CSS, Viem.
- [x] **Core Hooks**:
    - `useWalletBalance`: Fetch native (ETH/MATIC/etc.) balance.
    - `useAssetList`: Fetch ERC-20 token balances.
    - `useTransfer`: Handle sending transactions (Native & ERC-20).
- [ ] **Hook Refinement**: Ensure hooks handle loading states, errors, and gas estimation gracefully.

## Phase 2: Essential UI Components (The "MetaMask" Experience)
Build the visible building blocks that developers can drop into their apps.

### 1. Wallet Identity & Overview
- [x] **`WalletCard`**: A summary card showing total balance (USD est.), address (truncated), and copy-to-clipboard button.
- [x] **`NetworkBadge`**: Shows current connected network with a dot indicator.
- [x] **`AddressPill`**: A small, clickable component to view/copy the wallet address.

### 2. Asset Management
- [x] **`AssetList`**: A scrollable list of tokens (Native + ERC20).
    - Shows Token Icon, Name, Balance, and Value in USD.
- [x] **`AssetItem`**: Individual row component for a token.
- [x] **`ReceiveModal`**: A modal showing the QR code and full address for receiving funds.

### 3. Transactions (Send & History)
- [x] **`TransferForm`**: The core "Send" experience.
    - Input: Recipient Address (with validation).
    - Input: Amount (with "Max" button).
    - Selector: Token selection.
- [x] **`TransactionReview`**: A summary view before confirming the transaction (Gas fee est., Total).
- [x] **`TransactionHistory`**: A list of past transactions (Sent/Received).
    - Needs integration with an indexer or block explorer API (e.g., Viem logs or external API).


## Phase 3: Developer Experience (DX) & Demo
Make it easy for developers to adopt and test.

- [x] **Playground App (`src/App.tsx`)**:
    - Implement a real Privy login flow.
    - Showcase all components in a "Dashboard" layout.
- [x] **Theming System**:
    - Ensure all components use `tailwind-merge` and `clsx` for easy styling overrides.
    - Define a set of CSS variables for base colors (Primary, Background, Surface) to support Dark/Light mode easily.
- [x] **Exports**: Ensure `src/index.ts` correctly exports all components and hooks.

## Phase 4: Advanced Features (Future)
- [ ] **Network Switcher**: UI to switch between supported chains (Mainnet, Polygon, Base, etc.).

- [ ] **NFT Gallery**: Simple grid view for owned NFTs.
- [ ] **Swap Interface**: (Optional) Basic UI for swapping tokens (integration with Uniswap/0x API).
- [ ] **Fiat On-ramp**: Integration with providers (MoonPay/Stripe) if Privy supports it directly via UI.

## Phase 5: Quality Assurance & Release
- [ ] **Unit Tests**: Test hooks logic (mocking Viem/Privy).
- [ ] **Component Tests**: Ensure UI renders correctly under different states (Loading, Error, Empty).
- [ ] **Documentation**: Detailed README with props definitions and usage examples.
- [ ] **NPM Publish**: Setup CI/CD for automated publishing.
