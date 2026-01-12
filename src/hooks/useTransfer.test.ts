import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTransfer } from './useTransfer';

// Mock viem
vi.mock('viem', async () => {
    const actual = await vi.importActual('viem');
    return {
        ...actual,
        createPublicClient: vi.fn(),
        createWalletClient: vi.fn(),
        custom: vi.fn(),
    };
});

// Mock @privy-io/react-auth
vi.mock('@privy-io/react-auth', () => ({
    useWallets: vi.fn(),
}));

import { useWallets } from '@privy-io/react-auth';
import { createPublicClient, createWalletClient } from 'viem';

const mockedUseWallets = vi.mocked(useWallets);
const mockedCreatePublicClient = vi.mocked(createPublicClient);
const mockedCreateWalletClient = vi.mocked(createWalletClient);

describe('useTransfer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('estimateGas', () => {
        it('should return early when no wallet is connected', async () => {
            mockedUseWallets.mockReturnValue({ wallets: [] } as any);

            const { result } = renderHook(() => useTransfer());

            await act(async () => {
                const gas = await result.current.estimateGas({
                    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                    amount: '1.0',
                });
                expect(gas).toBeUndefined();
            });
        });

        it('should estimate gas for native transfer', async () => {
            const mockEstimateGas = vi.fn().mockResolvedValue(BigInt(21000));
            const mockGetGasPrice = vi.fn().mockResolvedValue(BigInt('1000000000')); // 1 gwei

            const mockProvider = {
                request: vi.fn().mockResolvedValue(['0x1234567890abcdef1234567890abcdef12345678']),
            };

            mockedUseWallets.mockReturnValue({
                wallets: [
                    {
                        getEthereumProvider: vi.fn().mockResolvedValue(mockProvider),
                    },
                ],
            } as any);

            mockedCreatePublicClient.mockReturnValue({
                estimateGas: mockEstimateGas,
                getGasPrice: mockGetGasPrice,
            } as any);

            const { result } = renderHook(() => useTransfer());

            let gas: bigint | undefined;
            await act(async () => {
                gas = await result.current.estimateGas({
                    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                    amount: '1.0',
                });
            });

            expect(gas).toBe(BigInt(21000));
            expect(result.current.gasEstimate).toBe('0.000021');
        });

        it('should estimate gas for ERC20 transfer', async () => {
            const mockEstimateContractGas = vi.fn().mockResolvedValue(BigInt(65000));
            const mockGetGasPrice = vi.fn().mockResolvedValue(BigInt('1000000000')); // 1 gwei

            const mockProvider = {
                request: vi.fn().mockResolvedValue(['0x1234567890abcdef1234567890abcdef12345678']),
            };

            mockedUseWallets.mockReturnValue({
                wallets: [
                    {
                        getEthereumProvider: vi.fn().mockResolvedValue(mockProvider),
                    },
                ],
            } as any);

            mockedCreatePublicClient.mockReturnValue({
                estimateContractGas: mockEstimateContractGas,
                getGasPrice: mockGetGasPrice,
            } as any);

            const { result } = renderHook(() => useTransfer());

            let gas: bigint | undefined;
            await act(async () => {
                gas = await result.current.estimateGas({
                    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                    amount: '100',
                    tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                    decimals: 6,
                });
            });

            expect(gas).toBe(BigInt(65000));
        });
    });

    describe('sendTransaction', () => {
        it('should throw error when no wallet is connected', async () => {
            mockedUseWallets.mockReturnValue({ wallets: [] } as any);

            const { result } = renderHook(() => useTransfer());

            await expect(
                act(async () => {
                    await result.current.sendTransaction({
                        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                        amount: '1.0',
                    });
                }),
            ).rejects.toThrow('No wallet connected');
        });

        it('should send native transfer successfully', async () => {
            const mockTxHash = '0xabc123...';
            const mockSendTransaction = vi.fn().mockResolvedValue(mockTxHash);
            const mockGetAddresses = vi
                .fn()
                .mockResolvedValue(['0x1234567890abcdef1234567890abcdef12345678']);
            const mockWaitForTransactionReceipt = vi.fn().mockResolvedValue({ status: 'success' });

            mockedUseWallets.mockReturnValue({
                wallets: [
                    {
                        getEthereumProvider: vi.fn().mockResolvedValue({}),
                    },
                ],
            } as any);

            mockedCreateWalletClient.mockReturnValue({
                sendTransaction: mockSendTransaction,
                getAddresses: mockGetAddresses,
            } as any);

            mockedCreatePublicClient.mockReturnValue({
                waitForTransactionReceipt: mockWaitForTransactionReceipt,
            } as any);

            const { result } = renderHook(() => useTransfer());

            let hash: string | undefined;
            await act(async () => {
                hash = await result.current.sendTransaction({
                    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                    amount: '1.0',
                });
            });

            expect(hash).toBe(mockTxHash);
            expect(result.current.txHash).toBe(mockTxHash);
            expect(result.current.loading).toBe(false);
        });

        it('should send ERC20 transfer successfully', async () => {
            const mockTxHash = '0xerc20abc...';
            const mockWriteContract = vi.fn().mockResolvedValue(mockTxHash);
            const mockGetAddresses = vi
                .fn()
                .mockResolvedValue(['0x1234567890abcdef1234567890abcdef12345678']);
            const mockWaitForTransactionReceipt = vi.fn().mockResolvedValue({ status: 'success' });

            mockedUseWallets.mockReturnValue({
                wallets: [
                    {
                        getEthereumProvider: vi.fn().mockResolvedValue({}),
                    },
                ],
            } as any);

            mockedCreateWalletClient.mockReturnValue({
                writeContract: mockWriteContract,
                getAddresses: mockGetAddresses,
            } as any);

            mockedCreatePublicClient.mockReturnValue({
                waitForTransactionReceipt: mockWaitForTransactionReceipt,
            } as any);

            const { result } = renderHook(() => useTransfer());

            let hash: string | undefined;
            await act(async () => {
                hash = await result.current.sendTransaction({
                    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                    amount: '100',
                    tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                    decimals: 6,
                });
            });

            expect(hash).toBe(mockTxHash);
            expect(mockWriteContract).toHaveBeenCalled();
        });

        it('should handle transaction error gracefully', async () => {
            const mockError = new Error('User rejected transaction');
            const mockGetAddresses = vi
                .fn()
                .mockResolvedValue(['0x1234567890abcdef1234567890abcdef12345678']);

            mockedUseWallets.mockReturnValue({
                wallets: [
                    {
                        getEthereumProvider: vi.fn().mockResolvedValue({}),
                    },
                ],
            } as any);

            mockedCreateWalletClient.mockReturnValue({
                sendTransaction: vi.fn().mockRejectedValue(mockError),
                getAddresses: mockGetAddresses,
            } as any);

            mockedCreatePublicClient.mockReturnValue({} as any);

            const { result } = renderHook(() => useTransfer());

            let thrownError: Error | undefined;
            await act(async () => {
                try {
                    await result.current.sendTransaction({
                        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                        amount: '1.0',
                    });
                } catch (e) {
                    thrownError = e as Error;
                }
            });

            expect(thrownError?.message).toBe('User rejected transaction');
            await waitFor(() => {
                expect(result.current.error).toBe(mockError);
            });
            expect(result.current.loading).toBe(false);
        });
    });
});
