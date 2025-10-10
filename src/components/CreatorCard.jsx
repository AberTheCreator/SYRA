import React from 'react';
import { Zap, Users, Gift } from 'lucide-react';
import { useTipStore } from '../store/tipStore';

const CreatorCard = ({ creator, isWalletConnected }) => {
  const { openTipModal } = useTipStore();

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 bg-gradient-to-r ${creator.color} rounded-2xl flex items-center justify-center text-2xl font-bold`}>
            {creator.avatar}
          </div>
          <div>
            <h3 className="text-xl font-bold">{creator.name}</h3>
            <p className="text-blue-400">{creator.handle}</p>
          </div>
        </div>
        <button
          onClick={() => openTipModal(creator)}
          disabled={!isWalletConnected}
          className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl font-semibold transition-all duration-300"
        >
          Tip
        </button>
      </div>

      <p className="text-gray-400 mb-4">{creator.bio}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 font-bold">{creator.tipsReceived}</span>
            <span className="text-gray-400">tips</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-bold">{creator.supporters}</span>
            <span className="text-gray-400">supporters</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          <Gift className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400">NFT Reward</span>
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;
