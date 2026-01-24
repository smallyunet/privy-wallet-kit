import React from 'react';
import { useNetwork } from '../hooks/useNetwork';
import { ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CHAIN_NAMES, DEFAULT_SUPPORTED_CHAIN_IDS } from '../constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type NetworkOption = { id: number; name: string; color?: string };

const DEFAULT_CHAIN_COLORS: Record<number, string> = {
  1: 'bg-blue-500',
  11155111: 'bg-purple-500',
  137: 'bg-indigo-500',
  8453: 'bg-blue-600',
  84532: 'bg-sky-500',
  10: 'bg-red-500',
  42161: 'bg-cyan-500',
};

interface NetworkSwitcherProps {
  className?: string;
  chains?: NetworkOption[];
  onError?: (error: unknown) => void;
}

export const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({ className, chains, onError }) => {
  const { chainId, switchNetwork } = useNetwork();

  const options: NetworkOption[] =
    chains ??
    DEFAULT_SUPPORTED_CHAIN_IDS.map((id) => ({
      id,
      name: CHAIN_NAMES[String(id)] ?? `Chain ${id}`,
      color: DEFAULT_CHAIN_COLORS[id] ?? 'bg-gray-500',
    }));

  const currentChain =
    (chainId ? options.find((c) => c.id === chainId) : undefined) ||
    (chainId
      ? {
          id: chainId,
          name: CHAIN_NAMES[String(chainId)] ?? `Chain ${chainId}`,
          color: 'bg-gray-500',
        }
      : { id: 0, name: 'Select Network', color: 'bg-gray-400' });

  const handleSwitch = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = Number(e.target.value);
    try {
      await switchNetwork(next);
    } catch (err) {
      onError?.(err);
    }
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
        value={chainId ?? ''}
        onChange={handleSwitch}
        disabled={chainId === null}
      >
        <option value="" disabled>
          Select Network
        </option>
        {options.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.name}
          </option>
        ))}
      </select>
    </div>
  );
};
