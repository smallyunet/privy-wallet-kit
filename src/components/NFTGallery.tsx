import React from 'react';
import { Image as ImageIcon, ExternalLink, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useNFTs, type NFT } from '../hooks/useNFTs';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface NFTCardProps {
    nft: NFT;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
    return (
        <div className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all">
            <div className="aspect-square relative bg-muted flex items-center justify-center overflow-hidden">
                {nft.image ? (
                    <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '';
                            (e.target as HTMLImageElement).className = 'hidden';
                        }}
                    />
                ) : (
                    <ImageIcon size={32} className="text-muted-foreground/50" />
                )}
            </div>
            <div className="p-3">
                <div className="text-xs text-muted-foreground font-medium truncate mb-1">
                    {nft.collectionName || 'Unknown Collection'}
                </div>
                <div className="text-sm font-semibold text-foreground truncate">{nft.name}</div>
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground uppercase font-bold tracking-wider">
                        {nft.tokenType}
                    </span>
                    <a
                        href={`https://opensea.io/assets/ethereum/${nft.contractAddress}/${nft.tokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ExternalLink size={14} />
                    </a>
                </div>
            </div>
        </div>
    );
};

interface NFTGalleryProps {
    className?: string;
    columns?: 2 | 3 | 4;
}

export const NFTGallery: React.FC<NFTGalleryProps> = ({ className, columns = 2 }) => {
    const { nfts, loading, error } = useNFTs();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-sm">Loading your collection...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-destructive/10 text-destructive rounded-xl text-sm text-center">
                Failed to load NFTs: {error.message}
            </div>
        );
    }

    if (nfts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-xl border border-dashed border-border">
                <ImageIcon size={32} className="text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground font-medium">No NFTs found</p>
                <p className="text-xs text-muted-foreground/70">Your digital assets will appear here</p>
            </div>
        );
    }

    const gridCols = {
        2: 'grid-cols-2',
        3: 'grid-cols-2 sm:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    };

    return (
        <div className={cn('grid gap-4', gridCols[columns], className)}>
            {nfts.map((nft) => (
                <NFTCard key={`${nft.contractAddress}-${nft.tokenId}`} nft={nft} />
            ))}
        </div>
    );
};
