import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';
import { AddressPill } from './AddressPill';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  className?: string;
}

export const ReceiveModal: React.FC<ReceiveModalProps> = ({ isOpen, onClose, address, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className={cn(
          "relative w-full max-w-sm bg-card text-card-foreground rounded-2xl shadow-xl border border-border p-6",
          className
        )}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-6">
          <h3 className="text-lg font-semibold">Receive Assets</h3>
          
          <div className="flex justify-center p-4 bg-white rounded-xl border border-border shadow-sm mx-auto w-fit">
            <QRCodeSVG value={address} size={180} />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Scan to send funds to this wallet</p>
            <div className="flex justify-center">
              <AddressPill address={address} className="bg-muted px-3 py-2 text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

