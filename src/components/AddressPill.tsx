import React from 'react';
import { Copy, Check } from 'lucide-react';
import { formatAddress, copyToClipboard } from '../utils';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AddressPillProps {
  address: string;
  className?: string;
}

export const AddressPill: React.FC<AddressPillProps> = ({ address, className }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (address) {
      copyToClipboard(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-xs text-muted-foreground',
        className,
      )}
    >
      <span>{formatAddress(address)}</span>
      {copied ? (
        <span className="text-green-500 flex items-center gap-1">
          <Check size={12} />
        </span>
      ) : (
        <Copy size={12} />
      )}
    </button>
  );
};
