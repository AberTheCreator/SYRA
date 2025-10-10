import React, { useState } from 'react';
import { X, Zap, Calendar } from 'lucide-react';
import { useTipStore } from '../store/tipStore';
import { useWalletStore } from '../store/walletStore';
import { sendTip } from '../services/stacksService';

const TipModal = ({ creator, onClose }) => {
  const [tipAmount, setTipAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { openSuccessModal, addRecurringTip } = useTipStore();
  const { address, organizationId, updateBalance } = useWalletStore();

  const quickAmounts = [0.001, 0.005, 0.01, 0.05];

  const handleSendTip = async () => {
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      setError('Please enter a valid tip amount');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await sendTip({
        senderAddress: address,
        recipientAddress: creator.walletAddress,
        amount: parseFloat(tipAmount),
        organizationId,
      });

      if (result.success) {
        updateBalance(-parseFloat(tipAmount));
        onClose();
        openSuccessModal({ creator, amount: tipAmount, txId: result.txId });
      } else {
        setError(result.error || 'Failed to send tip');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while sending the tip');
      console.error('Tip error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecurringTip = () => {
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      setError('Please enter a valid tip amount');
      return;
    }

    addRecurringTip({
      creator,
      amount: parseFloat(tipAmount),
      frequency: 'weekly',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Send Tip</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className={`w-16 h-16 bg-gradient-to-r ${creator.color} rounded-2xl flex items-center justify-center text-2xl font-bold`}>
            {creator.avatar}
          </div>
          <div>
            <h3 className="text-xl font-bold">{creator.name}</h3>
            <p className="text-blue-400">{creator.handle}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Tip Amount (sBTC)</label>
          <input
            type="number"
            value={tipAmount}
            onChange={(e) => setTipAmount(e.target.value)}
            placeholder="0.001"
            step="0.001"
            min="0"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
          />
          <div className="flex space-x-2 mt-3">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setTipAmount(amount.toString())}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-sm transition-all duration-300"
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={handleSendTip}
            disabled={isProcessing}
            className="flex-1 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 disabled:opacity-50 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Zap className="w-5 h-5" />
            <span>{isProcessing ? 'Sending...' : 'Send Tip'}</span>
          </button>
          <button
            onClick={handleRecurringTip}
            disabled={isProcessing}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Recurring</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TipModal;
