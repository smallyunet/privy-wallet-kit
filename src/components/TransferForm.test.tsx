import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransferForm } from './TransferForm';

// Mock viem isAddress
vi.mock('viem', () => ({
    isAddress: (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address),
}));

describe('TransferForm', () => {
    const mockOnReview = vi.fn();
    const mockOnCancel = vi.fn();

    const defaultProps = {
        onReview: mockOnReview,
        onCancel: mockOnCancel,
    };

    const mockTokens = [
        {
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as `0x${string}`,
            symbol: 'USDC',
            name: 'USD Coin',
            decimals: 6,
        },
        {
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7' as `0x${string}`,
            symbol: 'USDT',
            name: 'Tether USD',
            decimals: 6,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the form with all inputs', () => {
        render(<TransferForm {...defaultProps} />);

        expect(screen.getByText('Send Assets')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('0x...')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
        expect(screen.getByText('Review Transaction')).toBeInTheDocument();
    });

    it('should call onCancel when back button is clicked', () => {
        render(<TransferForm {...defaultProps} />);

        // Click the back arrow (first button)
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]); // Arrow back button

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should show error for invalid address', () => {
        render(<TransferForm {...defaultProps} />);

        const addressInput = screen.getByPlaceholderText('0x...');
        const amountInput = screen.getByPlaceholderText('0.00');

        fireEvent.change(addressInput, { target: { value: 'invalid-address' } });
        fireEvent.change(amountInput, { target: { value: '1.0' } });

        fireEvent.click(screen.getByText('Review Transaction'));

        expect(screen.getByText('Invalid recipient address')).toBeInTheDocument();
        expect(mockOnReview).not.toHaveBeenCalled();
    });

    it('should show error for invalid amount', () => {
        render(<TransferForm {...defaultProps} />);

        const addressInput = screen.getByPlaceholderText('0x...');
        const amountInput = screen.getByPlaceholderText('0.00');

        fireEvent.change(addressInput, {
            target: { value: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
        });
        fireEvent.change(amountInput, { target: { value: '0' } });

        fireEvent.click(screen.getByText('Review Transaction'));

        expect(screen.getByText('Invalid amount')).toBeInTheDocument();
        expect(mockOnReview).not.toHaveBeenCalled();
    });

    it('should show error for empty amount', () => {
        render(<TransferForm {...defaultProps} />);

        const addressInput = screen.getByPlaceholderText('0x...');

        fireEvent.change(addressInput, {
            target: { value: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
        });

        fireEvent.click(screen.getByText('Review Transaction'));

        expect(screen.getByText('Invalid amount')).toBeInTheDocument();
        expect(mockOnReview).not.toHaveBeenCalled();
    });

    it('should call onReview with correct details for native transfer', () => {
        render(<TransferForm {...defaultProps} />);

        const addressInput = screen.getByPlaceholderText('0x...');
        const amountInput = screen.getByPlaceholderText('0.00');

        fireEvent.change(addressInput, {
            target: { value: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
        });
        fireEvent.change(amountInput, { target: { value: '1.5' } });

        fireEvent.click(screen.getByText('Review Transaction'));

        expect(mockOnReview).toHaveBeenCalledWith({
            to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            amount: '1.5',
            token: undefined,
        });
    });

    it('should render token selector when tokens are provided', () => {
        render(<TransferForm {...defaultProps} tokens={mockTokens} />);

        expect(screen.getByText('Asset')).toBeInTheDocument();
        expect(screen.getByText('Native Token (ETH)')).toBeInTheDocument();
        expect(screen.getByText('USDC - USD Coin')).toBeInTheDocument();
        expect(screen.getByText('USDT - Tether USD')).toBeInTheDocument();
    });

    it('should not render token selector when tokens array is empty', () => {
        render(<TransferForm {...defaultProps} tokens={[]} />);

        expect(screen.queryByText('Asset')).not.toBeInTheDocument();
    });

    it('should call onReview with selected token', () => {
        render(<TransferForm {...defaultProps} tokens={mockTokens} />);

        const addressInput = screen.getByPlaceholderText('0x...');
        const amountInput = screen.getByPlaceholderText('0.00');
        const tokenSelect = screen.getByRole('combobox');

        fireEvent.change(addressInput, {
            target: { value: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
        });
        fireEvent.change(amountInput, { target: { value: '100' } });
        fireEvent.change(tokenSelect, {
            target: { value: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
        });

        fireEvent.click(screen.getByText('Review Transaction'));

        expect(mockOnReview).toHaveBeenCalledWith({
            to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            amount: '100',
            token: mockTokens[0],
        });
    });

    it('should apply custom className', () => {
        const { container } = render(<TransferForm {...defaultProps} className="custom-class" />);

        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should display selected token symbol in amount input', () => {
        render(<TransferForm {...defaultProps} tokens={mockTokens} />);

        // Initially shows ETH
        expect(screen.getByText('ETH')).toBeInTheDocument();

        // Select USDC
        const tokenSelect = screen.getByRole('combobox');
        fireEvent.change(tokenSelect, {
            target: { value: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
        });

        // Should now show USDC
        expect(screen.getByText('USDC')).toBeInTheDocument();
    });
});
