import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletCardView } from './WalletCard';

// Mock child components
vi.mock('./AddressPill', () => ({
  AddressPill: ({ address }: { address: string }) => (
    <div data-testid="address-pill">{address.slice(0, 10)}...</div>
  ),
}));

vi.mock('./NetworkBadge', () => ({
  NetworkBadge: () => <div data-testid="network-badge">Network</div>,
  NetworkBadgeView: ({ chainId }: { chainId: string }) => (
    <div data-testid="network-badge-view">Chain: {chainId}</div>
  ),
}));

vi.mock('./ReceiveModal', () => ({
  ReceiveModal: ({
    isOpen,
    onClose,
    address,
  }: {
    isOpen: boolean;
    onClose: () => void;
    address: string;
  }) =>
    isOpen ? (
      <div data-testid="receive-modal">
        <span>Receive: {address}</span>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe('WalletCardView', () => {
  const defaultProps = {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    balance: '1.5',
    loading: false,
    chainId: '1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render wallet card with balance', () => {
    render(<WalletCardView {...defaultProps} />);

    expect(screen.getByText('Total Balance')).toBeInTheDocument();
    expect(screen.getByText('1.5000')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    render(<WalletCardView {...defaultProps} loading={true} />);

    // Should show loading skeleton instead of balance
    expect(screen.queryByText('1.5000')).not.toBeInTheDocument();
    expect(screen.getByTestId('address-pill')).toBeInTheDocument();
  });

  it('should display 0.00 when balance is null', () => {
    render(<WalletCardView {...defaultProps} balance={null} />);

    expect(screen.getByText('0.00')).toBeInTheDocument();
  });

  it('should render Send and Receive buttons', () => {
    render(<WalletCardView {...defaultProps} />);

    expect(screen.getByText('Send')).toBeInTheDocument();
    expect(screen.getByText('Receive')).toBeInTheDocument();
  });

  it('should call onSendClick when Send button is clicked', () => {
    const onSendClick = vi.fn();
    render(<WalletCardView {...defaultProps} onSendClick={onSendClick} />);

    fireEvent.click(screen.getByText('Send'));

    expect(onSendClick).toHaveBeenCalledTimes(1);
  });

  it('should open ReceiveModal when Receive button is clicked', () => {
    render(<WalletCardView {...defaultProps} />);

    // Modal should not be visible initially
    expect(screen.queryByTestId('receive-modal')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Receive'));

    // Modal should now be visible
    expect(screen.getByTestId('receive-modal')).toBeInTheDocument();
  });

  it('should close ReceiveModal when close is triggered', () => {
    render(<WalletCardView {...defaultProps} />);

    // Open modal
    fireEvent.click(screen.getByText('Receive'));
    expect(screen.getByTestId('receive-modal')).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('receive-modal')).not.toBeInTheDocument();
  });

  it('should display NetworkBadgeView with chainId', () => {
    render(<WalletCardView {...defaultProps} chainId="137" />);

    expect(screen.getByText('Chain: 137')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<WalletCardView {...defaultProps} className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
