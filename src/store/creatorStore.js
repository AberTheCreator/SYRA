import { create } from 'zustand';

export const useCreatorStore = create((set) => ({
  creators: [
    {
      id: 1,
      name: "Sarah Chen",
      handle: "@sarahcreates",
      bio: "Digital artist & NFT creator",
      avatar: "SC",
      tipsReceived: 2450,
      supporters: 342,
      color: "from-orange-500 to-pink-500",
      nftReward: "Golden Supporter NFT",
      walletAddress: "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR",
    },
    {
      id: 2,
      name: "Marcus Dev",
      handle: "@marcusbuilds",
      bio: "Open source developer & educator",
      avatar: "MD",
      tipsReceived: 1890,
      supporters: 278,
      color: "from-blue-500 to-cyan-500",
      nftReward: "Code Master NFT",
      walletAddress: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE",
    },
    {
      id: 3,
      name: "Luna Music",
      handle: "@lunabeats",
      bio: "Electronic music producer",
      avatar: "LM",
      tipsReceived: 3120,
      supporters: 456,
      color: "from-purple-500 to-pink-500",
      nftReward: "VIP Listener NFT",
      walletAddress: "SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60",
    },
    {
      id: 4,
      name: "Alex Writer",
      handle: "@alexwrites",
      bio: "Tech journalist & storyteller",
      avatar: "AW",
      tipsReceived: 1650,
      supporters: 201,
      color: "from-green-500 to-teal-500",
      nftReward: "Premium Reader NFT",
      walletAddress: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    },
  ],

  getCreatorById: (id) => {
    const state = useCreatorStore.getState();
    return state.creators.find(creator => creator.id === id);
  },

  updateCreatorStats: (creatorId, stats) => set((state) => ({
    creators: state.creators.map(creator =>
      creator.id === creatorId
        ? { ...creator, ...stats }
        : creator
    ),
  })),
}));
