import React from 'react';
import { type Asset } from '../hooks/useAssetList';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AssetItemProps {
  asset: Asset;
  onClick?: (asset: Asset) => void;
  className?: string;
}

export const AssetItem: React.FC<AssetItemProps> = ({ asset, onClick, className }) => {
  return (
    <div 
      onClick={() => onClick?.(asset)}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer border border-transparent hover:border-border",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {asset.logoUrl ? (
          <img src={asset.logoUrl} alt={asset.symbol} className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-xs">
            {asset.symbol.slice(0, 2)}
          </div>
        )}
        <div>
          <div className="font-medium text-foreground">{asset.name}</div>
          <div className="text-xs text-muted-foreground">{asset.symbol}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium text-foreground">
          {parseFloat(asset.balance).toFixed(4)}
        </div>
        {/* Placeholder for USD value - to be implemented */}
        <div className="text-xs text-muted-foreground">$0.00</div>
      </div>
    </div>
  );
};

