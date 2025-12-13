// Mock Data
const MOCK_WALLET = {
  address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // vitalik.eth
  chainType: 'ethereum',
  chainId: 'eip155:1',
  getEthereumProvider: async () => window.ethereum || {
    request: (args: { method: string, params?: unknown[] }) => {
      if (args.method === 'eth_getBalance') {
        return Promise.resolve('0xde0b6b3a7640000'); // 1 ETH
      }
      if (args.method === 'eth_call') {
        // Return a large number for token balances (e.g. 1000 tokens with 18 decimals)
        return Promise.resolve('0x00000000000000000000000000000000000000000000003635c9adc5dea00000');
      }
      return Promise.resolve('0x0');
    },
    on: () => {},
    removeListener: () => {}
  },
};

export const useWallets = () => {
  return {
    wallets: [MOCK_WALLET],
    ready: true,
  };
};

export const usePrivy = () => {
  return {
    ready: true,
    authenticated: true,
    user: {
      id: 'did:privy:mock-user',
      wallet: MOCK_WALLET,
    },
    login: async () => {},
    logout: async () => {},
  };
};

export const PrivyProvider = ({ children }: { children: React.ReactNode }) => {
  return children;
};
