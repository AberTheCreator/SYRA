import React, { useEffect } from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';

const SuccessModal = ({ creator, amount, txId, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const explorerUrl = `https://explorer.stacks.co/txid/${txId}?chain=testnet`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-green-500/50 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Tip Sent Successfully!</h3>
        <p className="text-gray-400 mb-4">Your support means the world to {creator.name}</p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <p className="text-orange-400 font-bold text-2xl">{amount} sBTC</p>
          <p className="text-sm text-gray-400">Transaction verified on Stacks</p>
        </div>
        {txId && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
          >
            <span>View on Explorer</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

export default SuccessModal;
