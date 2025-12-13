import type { Meta, StoryObj } from '@storybook/react';
import { AssetList } from './AssetList';

const meta = {
  title: 'Components/AssetList',
  component: AssetList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AssetList>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_TOKENS = [
  {
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
  },
  {
    address: '0x4200000000000000000000000000000000000006' as const,
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  },
];

export const Default: Story = {
  args: {
    tokens: SAMPLE_TOKENS,
  },
};

export const Empty: Story = {
  args: {
    tokens: [],
  },
};

export const Loading: Story = {
  args: {
    tokens: SAMPLE_TOKENS,
  },
  // Note: To truly show loading state, we'd need to control the hook's return value via a more advanced mock
  // For now, this will show the loaded state because our mock returns data immediately.
};
