import React from 'react';
import CreatorCard from './CreatorCard';
import { useCreatorStore } from '../store/creatorStore';
import { useWalletStore } from '../store/walletStore';

const DiscoverTab = () => {
  const { creators } = useCreatorStore();
  const { isConnected } = useWalletStore();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
          Discover Creators
        </h1>
        <p className="text-gray-400">Support your favorite creators with sBTC micro-tips</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {creators.map((creator) => (
          <CreatorCard
            key={creator.id}
            creator={creator}
            isWalletConnected={isConnected}
          />
        ))}
      </div>
    </div>
  );
};

export default DiscoverTab;
