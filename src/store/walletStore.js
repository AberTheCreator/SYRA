import { create } from 'zustand';

export const useWalletStore = create((set) => ({
  isConnected: false,
  address: null,
  organizationId: null,
  balance: 0,
  provider: null,

  connectWallet: (walletData) => set({
    isConnected: true,
    address: walletData.address,
    organizationId: walletData.organizationId,
    provider: walletData.provider,
    balance: 0.5,
  }),

  disconnectWallet: () => {
    localStorage.removeItem('syra_wallet_address');
    localStorage.removeItem('syra_wallet_org_id');
    set({
      isConnected: false,
      address: null,
      organizationId: null,
      balance: 0,
      provider: null,
    });
  },

  updateBalance: (amount) => set((state) => ({
    balance: state.balance + amount,
  })),

  setBalance: (balance) => set({ balance }),
}));
