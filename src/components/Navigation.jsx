import React, { useState } from 'react';
import { Wallet, Zap, Menu, X } from 'lucide-react';
import WalletConnect from './WalletConnect';

const Navigation = ({ activeTab, setActiveTab, isConnected, address, balance, onConnect, onDisconnect }) => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const tabs = [
    { id: 'discover', label: 'Discover' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'recurring', label: 'Recurring' },
    { id: 'badges', label: 'Badges' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <>
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
                SYRA
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {!isConnected ? (
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
                >
                  <Wallet className="w-5 h-5" />
                  <span className="hidden sm:inline">Connect Wallet</span>
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl hidden sm:block">
                    <span className="text-orange-400 font-bold">{balance.toFixed(4)} sBTC</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="w-10 h-10 bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl flex items-center justify-center font-bold"
                  >
                    {address ? address.slice(0, 2).toUpperCase() : 'U'}
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden w-10 h-10 flex items-center justify-center"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {showMobileMenu && (
            <div className="md:hidden mt-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {showWalletModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Connect Your Wallet</h2>
            <WalletConnect
              onConnect={(walletData) => {
                onConnect(walletData);
                setShowWalletModal(false);
              }}
            />
            <button
              onClick={() => setShowWalletModal(false)}
              className="w-full mt-4 text-gray-400 hover:text-white py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
