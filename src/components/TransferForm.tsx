import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type TokenDefinition } from '../hooks/useAssetList';
import { isAddress } from 'viem';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TransferDetails {
  to: string;
  amount: string;
  token?: TokenDefinition;
}

interface TransferFormProps {
  tokens?: TokenDefinition[];
  onReview: (details: TransferDetails) => void;
  onCancel: () => void;
  className?: string;
}

export const TransferForm: React.FC<TransferFormProps> = ({ tokens = [], onReview, onCancel, className }) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<TokenDefinition | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAddress(to)) {
      setError('Invalid recipient address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Invalid amount');
      return;
    }

    onReview({
      to,
      amount,
      token: selectedToken
    });
  };

  return (
    <div className={cn("p-6 bg-card text-card-foreground rounded-xl border border-border shadow-sm", className)}>
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onCancel}
          className="p-1 -ml-1 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">Send Assets</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="any"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pr-16"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {selectedToken ? selectedToken.symbol : 'ETH'}
            </div>
          </div>
        </div>

        {tokens.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Asset
            </label>
            <select
              value={selectedToken?.address || ''}
              onChange={(e) => {
                const token = tokens.find(t => t.address === e.target.value);
                setSelectedToken(token);
              }}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            >
              <option value="">Native Token (ETH)</option>
              {tokens.map(token => (
                <option key={token.address} value={token.address}>
                  {token.symbol} - {token.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors mt-4"
        >
          Review Transaction
        </button>
      </form>
    </div>
  );
};

