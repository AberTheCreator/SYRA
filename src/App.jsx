import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import DiscoverTab from './components/DiscoverTab';
import LeaderboardTab from './components/LeaderboardTab';
import RecurringTab from './components/RecurringTab';
import BadgesTab from './components/BadgesTab';
import ProfileTab from './components/ProfileTab';
import TipModal from './components/TipModal';
import SuccessModal from './components/SuccessModal';
import { useWalletStore } from './store/walletStore';
import { useTipStore } from './store/tipStore';

function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const { isConnected, address, balance, connectWallet, disconnectWallet } = useWalletStore();
  const { showTipModal, showSuccessModal, selectedCreator, closeTipModal, closeSuccessModal } = useTipStore();

  useEffect(() => {
    const savedAddress = localStorage.getItem('syra_wallet_address');
    const savedOrgId = localStorage.getItem('syra_wallet_org_id');
    
    if (savedAddress && savedOrgId) {
      connectWallet({
        address: savedAddress,
        organizationId: savedOrgId,
        provider: 'cached',
      });
    }
  }, [connectWallet]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'discover':
        return <DiscoverTab />;
      case 'leaderboard':
        return <LeaderboardTab />;
      case 'recurring':
        return <RecurringTab />;
      case 'badges':
        return <BadgesTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <DiscoverTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isConnected={isConnected}
        address={address}
        balance={balance}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderActiveTab()}
      </main>

      {showTipModal && selectedCreator && (
        <TipModal
          creator={selectedCreator}
          onClose={closeTipModal}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          creator={selectedCreator}
          onClose={closeSuccessModal}
        />
      )}
    </div>
  );
}

export default App;
