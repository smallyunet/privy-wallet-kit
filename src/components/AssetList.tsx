import React from 'react';
import { useAssetList, type TokenDefinition, type Asset } from '../hooks/useAssetList';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AssetListProps {
  tokens: TokenDefinition[];
  className?: string;
  onAssetClick?: (asset: Asset) => void;
}

export const AssetList: React.FC<AssetListProps> = ({ tokens, className, onAssetClick }) => {
  const { assets, loading } = useAssetList(tokens);

  if (loading && assets.length === 0) {
    return (
      <div className={cn("space-y-2", className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className={cn("text-center py-8 text-gray-500", className)}>
        No assets found
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {assets.map((asset) => (
        <div 
          key={asset.address}
          onClick={() => onAssetClick?.(asset)}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
        >
          <div className="flex items-center gap-3">
            {asset.logoUrl ? (
              <img src={asset.logoUrl} alt={asset.symbol} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs">
                {asset.symbol.slice(0, 2)}
              </div>
            )}
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{asset.name}</div>
              <div className="text-xs text-gray-500">{asset.symbol}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium text-gray-900 dark:text-white">
              {parseFloat(asset.balance).toFixed(4)}
            </div>
            {/* Placeholder for USD value if we had price data */}
            {/* <div className="text-xs text-gray-500">$0.00</div> */}
          </div>
        </div>
      ))}
    </div>
  );
};
