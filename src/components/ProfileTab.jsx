import React from 'react';
import { User, Wallet, Gift, LogOut, Settings } from 'lucide-react';
import { useWalletStore } from '../store/walletStore';

const ProfileTab = () => {
  const { address, balance, disconnectWallet } = useWalletStore();

  const stats = [
    { label: 'Total Tips Sent', value: '42', icon: '🎯' },
    { label: 'Creators Supported', value: '8', icon: '👥' },
    { label: 'NFTs Earned', value: '5', icon: '🎨' },
    { label: 'Badges Unlocked', value: '4/9', icon: '🏆' },
  ];

  const recentActivity = [
    { type: 'tip', creator: 'Sarah Chen', amount: '0.01 sBTC', time: '2 hours ago' },
    { type: 'nft', creator: 'Luna Music', reward: 'VIP Listener NFT', time: '1 day ago' },
    { type: 'tip', creator: 'Marcus Dev', amount: '0.005 sBTC', time: '3 days ago' },
    { type: 'badge', achievement: 'First Tip Badge', time: '1 week ago' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
          Your Profile
        </h1>
        <p className="text-gray-400">Manage your account and view your activity</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl font-bold">
              {address ? address.slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold">Your Wallet</h2>
              <p className="text-gray-400 font-mono text-sm">
                {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : 'Not connected'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Balance</p>
              <p className="text-2xl font-bold text-orange-400">{balance.toFixed(4)} sBTC</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Total Tipped</p>
              <p className="text-2xl font-bold text-blue-400">0.245 sBTC</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
            <button
              onClick={disconnectWallet}
              className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-gray-400 text-sm">{stat.label}</span>
                </div>
                <span className="font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
              <div>
                {activity.type === 'tip' && (
                  <p className="font-semibold">Tipped {activity.creator}</p>
                )}
                {activity.type === 'nft' && (
                  <p className="font-semibold">Earned {activity.reward}</p>
                )}
                {activity.type === 'badge' && (
                  <p className="font-semibold">Unlocked {activity.achievement}</p>
                )}
                <p className="text-sm text-gray-400">{activity.time}</p>
              </div>
              {activity.amount && (
                <span className="text-orange-400 font-bold">{activity.amount}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
