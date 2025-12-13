export const formatAddress = (address: string | undefined, chars = 4): string => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

export const copyToClipboard = async (text: string) => {
  if (!navigator.clipboard) {
    console.warn('Clipboard not supported');
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Copy failed', error);
    return false;
  }
};
