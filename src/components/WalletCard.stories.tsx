import type { Meta, StoryObj } from '@storybook/react';
import { WalletCard } from './WalletCard';

const meta = {
  title: 'Components/WalletCard',
  component: WalletCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WalletCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const DarkMode: Story = {
  args: {},
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
