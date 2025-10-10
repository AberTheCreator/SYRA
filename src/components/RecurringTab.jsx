import React from 'react';
import { Clock, Trash2, Pause, Play } from 'lucide-react';
import { useTipStore } from '../store/tipStore';

const RecurringTab = () => {
  const { recurringTips, removeRecurringTip } = useTipStore();

  if (recurringTips.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
            Recurring Tips
          </h1>
          <p className="text-gray-400">Manage your scheduled tips to creators</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No recurring tips yet</p>
          <p className="text-sm text-gray-500">Set up recurring tips to support creators automatically</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
          Recurring Tips
        </h1>
        <p className="text-gray-400">Manage your scheduled tips to creators</p>
      </div>

      <div className="space-y-4">
        {recurringTips.map((tip) => (
          <div
            key={tip.id}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${tip.creator.color} rounded-xl flex items-center justify-center font-bold`}>
                  {tip.creator.avatar}
                </div>
                <div>
                  <p className="font-bold">{tip.creator.name}</p>
                  <p className="text-sm text-gray-400 capitalize">{tip.frequency} tip</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-orange-400 font-bold">{tip.amount} sBTC</p>
                  <p className="text-sm text-gray-400">Next: 7 days</p>
                </div>
                <button
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all duration-300"
                  title="Pause"
                >
                  <Pause className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
                <button
                  onClick={() => removeRecurringTip(tip.id)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-red-500/10 rounded-lg transition-all duration-300"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5 text-red-400 hover:text-red-300" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-3">Recurring Tip Benefits</h3>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-center space-x-2">
            <span className="text-green-400">✓</span>
            <span>Unlock exclusive content from creators</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-400">✓</span>
            <span>Get priority access to new releases</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-400">✓</span>
            <span>Earn special NFT badges for loyalty</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RecurringTab;
