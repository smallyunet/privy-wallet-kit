import type { Meta, StoryObj } from '@storybook/react';
import { WalletCardView } from './WalletCard';

const meta = {
  title: 'Components/WalletCard',
  component: WalletCardView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WalletCardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    balance: '1.2345',
    loading: false,
    chainId: '8453',
  },
};

export const Loading: Story = {
  args: {
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    balance: null,
    loading: true,
    chainId: '8453',
  },
};

export const DarkMode: Story = {
  args: {
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    balance: '1.2345',
    loading: false,
    chainId: '8453',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};
