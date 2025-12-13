import type { Meta, StoryObj } from '@storybook/react';
import { AssetListView } from './AssetList';
import type { Asset } from '../hooks/useAssetList';

const meta = {
  title: 'Components/AssetList',
  component: AssetListView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AssetListView>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_ASSETS: Asset[] = [
  {
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    balance: '100.50',
    balanceRaw: 100500000n,
  },
  {
    address: '0x4200000000000000000000000000000000000006' as const,
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    balance: '1.2345',
    balanceRaw: 1234500000000000000n,
  },
];

export const Default: Story = {
  args: {
    assets: SAMPLE_ASSETS,
    loading: false,
  },
};

export const Empty: Story = {
  args: {
    assets: [],
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    assets: [],
    loading: true,
  },
};
