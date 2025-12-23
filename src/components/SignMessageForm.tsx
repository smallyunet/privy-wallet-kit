import React, { useState } from 'react';
import { Shield, Copy, Check, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSignMessage } from '../hooks/useSignMessage';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SignMessageFormProps {
  onSuccess?: (signature: string) => void;
  className?: string;
}

export const SignMessageForm: React.FC<SignMessageFormProps> = ({ onSuccess, className }) => {
  const [message, setMessage] = useState('');
  const { signMessage, loading, error, signature } = useSignMessage();
  const [copied, setCopied] = useState(false);

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    try {
      const sig = await signMessage(message);
      onSuccess?.(sig);
    } catch (err) {
      console.error('Signing failed', err);
    }
  };

  const copySignature = () => {
    if (signature) {
      navigator.clipboard.writeText(signature);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={cn(
        'p-6 bg-card text-card-foreground rounded-xl border border-border shadow-sm',
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Shield size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Sign Message</h2>
          <p className="text-xs text-muted-foreground">
            Sign a plain text message with your wallet
          </p>
        </div>
      </div>

      <form onSubmit={handleSign} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message to sign..."
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        {error && (
          <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
            {error.message}
          </div>
        )}

        {signature && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Signature</label>
            <div className="relative group">
              <div className="w-full p-3 rounded-lg border border-border bg-muted/50 text-xs break-all pr-12 font-mono">
                {signature}
              </div>
              <button
                type="button"
                onClick={copySignature}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-background transition-colors"
                title="Copy signature"
              >
                {copied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} className="text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !message}
          className="w-full py-3 px-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Signing...' : 'Sign Message'}
        </button>
      </form>
    </div>
  );
};
