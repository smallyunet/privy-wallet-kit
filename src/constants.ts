export const CHAIN_NAMES: Record<string, string> = {
  '1': 'Ethereum',
  '11155111': 'Sepolia',
  '137': 'Polygon',
  '80001': 'Mumbai',
  '8453': 'Base',
  '84532': 'Base Sepolia',
  '10': 'Optimism',
  '42161': 'Arbitrum',
};

export const DEFAULT_SUPPORTED_CHAIN_IDS = [1, 11155111, 137, 8453, 84532, 10, 42161] as const;
