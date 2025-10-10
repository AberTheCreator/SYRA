import { create } from 'zustand';

export const useTipStore = create((set) => ({
  showTipModal: false,
  showSuccessModal: false,
  selectedCreator: null,
  recurringTips: [],
  tipHistory: [],

  openTipModal: (creator) => set({
    showTipModal: true,
    selectedCreator: creator,
  }),

  closeTipModal: () => set({
    showTipModal: false,
  }),

  openSuccessModal: (data) => set({
    showSuccessModal: true,
    selectedCreator: data.creator,
  }),

  closeSuccessModal: () => set({
    showSuccessModal: false,
  }),

  addRecurringTip: (tipData) => set((state) => ({
    recurringTips: [
      ...state.recurringTips,
      {
        id: Date.now(),
        ...tipData,
        createdAt: new Date().toISOString(),
        nextPayment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    showTipModal: false,
  })),

  removeRecurringTip: (tipId) => set((state) => ({
    recurringTips: state.recurringTips.filter(tip => tip.id !== tipId),
  })),

  addTipToHistory: (tip) => set((state) => ({
    tipHistory: [tip, ...state.tipHistory],
  })),
}));
