import React from 'react';
import { useNetwork } from '../hooks/useNetwork';
import { ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Common chains config
const SUPPORTED_CHAINS = [
  { id: 1, name: 'Ethereum', color: 'bg-blue-500' },
  { id: 11155111, name: 'Sepolia', color: 'bg-purple-500' },
  { id: 137, name: 'Polygon', color: 'bg-indigo-500' },
  { id: 8453, name: 'Base', color: 'bg-blue-600' },
  { id: 10, name: 'Optimism', color: 'bg-red-500' },
];

interface NetworkSwitcherProps {
  className?: string;
}

export const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({ className }) => {
  const { chainId, switchNetwork } = useNetwork();

  const currentChain = SUPPORTED_CHAINS.find((c) => c.id === chainId) || {
    id: chainId,
    name: 'Unknown Network',
    color: 'bg-gray-500',
  };

  const handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchNetwork(Number(e.target.value));
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm font-medium border border-border hover:bg-muted/80 transition-colors pointer-events-none">
        <div className={cn('w-2 h-2 rounded-full', currentChain.color)} />
        <span>{currentChain.name}</span>
        <ChevronDown size={14} className="opacity-50" />
      </div>

      <select
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        value={chainId || ''}
        onChange={handleSwitch}
      >
        <option value="" disabled>
          Select Network
        </option>
        {SUPPORTED_CHAINS.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.name}
          </option>
        ))}
      </select>
    </div>
  );
};
