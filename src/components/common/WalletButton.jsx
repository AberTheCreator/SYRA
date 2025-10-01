import React from 'react';
import { Wallet } from 'lucide-react';

const WalletButton = ({ connected, onConnect, address = null }) => {
  return (
    <button
      onClick={onConnect}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
        connected
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
          : 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 shadow-lg hover:shadow-xl'
      }`}
    >
      <Wallet size={18} />
      {connected ? (
        <span className="flex items-center gap-2">
          Connected
          {address && (
            <span className="text-xs bg-emerald-200 px-2 py-0.5 rounded-full">
              {address}
            </span>
          )}
        </span>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
};

export default WalletButton;
