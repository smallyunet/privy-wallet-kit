# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.7] - 2026-01-12

### Added

- **Unit Tests for Hooks**: Added comprehensive test coverage for all 7 hooks:
  - `useNetwork` - Tests for chainId parsing (numeric, string, eip155 format) and network switching
  - `useWalletBalance` - Tests for native and ERC-20 balance fetching, loading, and error states
  - `useAssetList` - Tests for multi-token balance fetching
  - `useTransfer` - Tests for gas estimation and transaction sending (native & ERC-20)
  - `useSignMessage` - Tests for message and typed data signing
  - `useTransactionHistory` - Tests for history fetching and refresh intervals
  - `useNFTs` - Tests for NFT list fetching and refresh functionality

- **Component Tests**: Added tests for key UI components:
  - `WalletCard` - Tests for rendering states (loading, connected), user interactions (Send/Receive buttons)
  - `TransferForm` - Tests for form validation, token selection, and callback handling

### Changed

- Updated `ROADMAP.md` to mark Phase 5 (Unit Tests & Component Tests) as completed

## [0.0.6] - 2026-01-11

### Added

- Initial release with core components and hooks
- `WalletCard`, `AssetList`, `TransferForm`, `NetworkSwitcher`, `SignMessageForm`, `NFTGallery`
- Hooks: `useWalletBalance`, `useAssetList`, `useTransfer`, `useNetwork`, `useSignMessage`, `useTransactionHistory`, `useNFTs`
- Storybook integration for component development
- GitHub Actions for CI/CD
