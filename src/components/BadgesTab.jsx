import React from 'react';
import { Award, CheckCircle, Lock } from 'lucide-react';

const BadgesTab = () => {
  const badges = [
    { id: 1, name: "First Tip", icon: "🎯", unlocked: true, description: "Sent your first tip" },
    { id: 2, name: "5 Tips Streak", icon: "🔥", unlocked: true, description: "Tipped 5 days in a row" },
    { id: 3, name: "Top Supporter", icon: "⭐", unlocked: false, description: "Become a top 10 supporter" },
    { id: 4, name: "NFT Collector", icon: "🎨", unlocked: true, description: "Earned your first NFT reward" },
    { id: 5, name: "Community Leader", icon: "👑", unlocked: false, description: "Reach 1000 total tips" },
    { id: 6, name: "Early Adopter", icon: "🚀", unlocked: true, description: "Joined SYRA in the first month" },
    { id: 7, name: "Generous Giver", icon: "💎", unlocked: false, description: "Tip over 1 sBTC total" },
    { id: 8, name: "Loyal Supporter", icon: "❤️", unlocked: false, description: "Subscribe to 5 creators" },
    { id: 9, name: "Weekend Warrior", icon: "⚡", unlocked: true, description: "Tip on 10 weekends" },
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
          Your Badges
        </h1>
        <p className="text-gray-400">Unlock achievements as you support creators</p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 mb-1">Achievement Progress</p>
            <p className="text-2xl font-bold">{unlockedCount} / {badges.length} Badges</p>
          </div>
          <Award className="w-12 h-12 text-orange-400" />
        </div>
        <div className="mt-4 bg-white/10 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-orange-500 to-blue-500 h-full transition-all duration-500" 
            style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 ${
              badge.unlocked ? 'opacity-100 hover:bg-white/10' : 'opacity-40'
            }`}
          >
            <div className="text-6xl mb-4">{badge.icon}</div>
            <p className="font-bold mb-2">{badge.name}</p>
            <p className="text-sm text-gray-400 mb-3">{badge.description}</p>
            {badge.unlocked ? (
              <div className="flex items-center justify-center space-x-1 text-sm text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>Unlocked</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Locked</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesTab;
