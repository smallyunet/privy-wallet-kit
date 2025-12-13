import React from 'react';
import { useAssetList, type TokenDefinition, type Asset } from '../hooks/useAssetList';
import { AssetItem } from './AssetItem';
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
          <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        No assets found
      </div>
    );
  }


  return (
    <div className={cn("space-y-2", className)}>
      {assets.map((asset) => (
        <AssetItem 
          key={asset.address} 
          asset={asset} 
          onClick={onAssetClick} 
        />
      ))}
    </div>
  );
};

