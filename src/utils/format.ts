import { formatUnits } from 'viem';

/**
 * Truncates an address to the format 0x12...34
 */
export const formatAddress = (address?: string, chars = 4): string => {
  if (!address || address.length < chars * 2 + 2) return address || '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

/**
 * Formats a number as a currency string (USD default)
 */
export const formatCurrency = (
  value: number | string,
  currency = 'USD',
  locale = 'en-US',
): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$0.00';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(num);
};

/**
 * Formats a token amount with appropriate decimal places
 */
export const formatTokenAmount = (
  amount: bigint | string | number,
  decimals = 18,
  displayDecimals = 4,
): string => {
  let num: number;

  if (typeof amount === 'bigint') {
    num = parseFloat(formatUnits(amount, decimals));
  } else if (typeof amount === 'string') {
    // If it's a string, we assume it's already formatted (like "1.5"), unless it looks like a raw big integer string which is rare in this context without decimals passed,
    // but better to be safe. If the user passes a raw string "100000" and decimals 6, we should parse it.
    // However, usually `formatTokenAmount` takes the raw bigint or the already formatted string.
    // Let's assume if it's a string, it might be the raw output from viem's formatUnits or similar float string.
    num = parseFloat(amount);
  } else {
    num = amount;
  }

  if (isNaN(num)) return '0';

  if (num === 0) return '0';

  // For very small numbers, show more precision or < 0.0001
  if (num < 0.0001) {
    return '< 0.0001';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: displayDecimals,
  }).format(num);
};
