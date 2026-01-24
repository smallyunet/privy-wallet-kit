import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSignMessage } from './useSignMessage';

// Mock viem
vi.mock('viem', async () => {
  const actual = await vi.importActual('viem');
  return {
    ...actual,
    createWalletClient: vi.fn(),
    custom: vi.fn(),
  };
});

// Mock @privy-io/react-auth
vi.mock('@privy-io/react-auth', () => ({
  useWallets: vi.fn(),
}));

import { useWallets } from '@privy-io/react-auth';
import { createWalletClient } from 'viem';

const mockedUseWallets = vi.mocked(useWallets);
const mockedCreateWalletClient = vi.mocked(createWalletClient);

describe('useSignMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error when signing without wallet', async () => {
    mockedUseWallets.mockReturnValue({ wallets: [] } as any);

    const { result } = renderHook(() => useSignMessage());

    await expect(
      act(async () => {
        await result.current.signMessage('Hello World');
      }),
    ).rejects.toThrow('No wallet connected');
  });

  it('should sign message successfully', async () => {
    const mockSignature = '0xabcd1234...';
    const mockSignMessage = vi.fn().mockResolvedValue(mockSignature);
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
      signMessage: mockSignMessage,
      getAddresses: mockGetAddresses,
    } as any);

    const { result } = renderHook(() => useSignMessage());

    let sig: string | undefined;
    await act(async () => {
      sig = await result.current.signMessage('Hello World');
    });

    expect(sig).toBe(mockSignature);
    expect(result.current.signature).toBe(mockSignature);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle signing error gracefully', async () => {
    const mockError = new Error('User rejected');
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
      signMessage: vi.fn().mockRejectedValue(mockError),
      getAddresses: mockGetAddresses,
    } as any);

    const { result } = renderHook(() => useSignMessage());

    let thrownError: Error | undefined;
    await act(async () => {
      try {
        await result.current.signMessage('Hello World');
      } catch (e) {
        thrownError = e as Error;
      }
    });

    expect(thrownError?.message).toBe('User rejected');
    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
    });
    expect(result.current.signature).toBeNull();
  });

  it('should sign typed data successfully', async () => {
    const mockSignature = '0xtyped1234...';
    const mockSignTypedData = vi.fn().mockResolvedValue(mockSignature);
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
      signTypedData: mockSignTypedData,
      getAddresses: mockGetAddresses,
    } as any);

    const { result } = renderHook(() => useSignMessage());

    const typedData = {
      domain: { name: 'Test', version: '1' },
      types: { Message: [{ name: 'content', type: 'string' }] },
      primaryType: 'Message',
      message: { content: 'Hello' },
    };

    let sig: string | undefined;
    await act(async () => {
      sig = await result.current.signTypedData(typedData);
    });

    expect(sig).toBe(mockSignature);
    expect(result.current.signature).toBe(mockSignature);
  });
});
