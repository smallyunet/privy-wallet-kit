export const normalizeChainIdString = (
  chainId: string | number | null | undefined,
): string | null => {
  if (chainId === null || chainId === undefined) return null;

  if (typeof chainId === 'number') return String(chainId);

  // Handles formats like "eip155:1" (Privy), or any other "namespace:id".
  if (chainId.includes(':')) {
    const parts = chainId.split(':');
    const last = parts[parts.length - 1];
    return last || null;
  }

  return chainId;
};

export const parseChainIdNumber = (chainId: string | number | null | undefined): number | null => {
  const normalized = normalizeChainIdString(chainId);
  if (!normalized) return null;

  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : null;
};
