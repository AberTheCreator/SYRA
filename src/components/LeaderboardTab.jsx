import React from 'react';
import { Trophy, TrendingUp } from 'lucide-react';

const LeaderboardTab = () => {
  const leaderboard = [
    { rank: 1, name: "CryptoFan101", tips: 450, badge: "🏆", growth: "+12%" },
    { rank: 2, name: "BTCSupporter", tips: 380, badge: "🥈", growth: "+8%" },
    { rank: 3, name: "StacksLover", tips: 320, badge: "🥉", growth: "+15%" },
    { rank: 4, name: "TipMaster", tips: 285, badge: "⭐", growth: "+5%" },
    { rank: 5, name: "Web3Champion", tips: 240, badge: "🔥", growth: "+20%" },
    { rank: 6, name: "SatoshiFan", tips: 215, badge: "💎", growth: "+3%" },
    { rank: 7, name: "You", tips: 120, badge: "🚀", growth: "+25%" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
          Top Supporters
        </h1>
        <p className="text-gray-400">Compete for the top spot and earn exclusive badges</p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        {leaderboard.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center justify-between py-4 border-b border-white/10 last:border-b-0 ${
              user.name === 'You' ? 'bg-orange-500/10 -mx-6 px-6 rounded-xl' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{user.badge}</span>
              <div>
                <p className="font-bold">{user.name}</p>
                <p className="text-sm text-gray-400">Rank #{user.rank}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-orange-400 font-bold">{user.tips} tips</p>
              <div className="flex items-center space-x-1 text-sm text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span>{user.growth}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gradient-to-r from-orange-500/10 to-blue-500/10 border border-orange-500/20 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-3">
          <Trophy className="w-6 h-6 text-orange-400" />
          <h3 className="text-xl font-bold">Monthly Challenge</h3>
        </div>
        <p className="text-gray-400 mb-3">Top 3 supporters this month win exclusive NFT badges!</p>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Your Progress</span>
            <span className="text-orange-400 font-bold">120 / 320 tips</span>
          </div>
          <div className="mt-2 bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-blue-500 h-full" style={{ width: '37%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTab;
