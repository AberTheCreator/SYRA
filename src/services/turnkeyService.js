const MOCK_MODE = true; 

export const initializeTurnkey = async () => {
  if (MOCK_MODE) {
    console.log('Turnkey: Running in mock mode');
    return createMockTurnkeyInstance();
  }

  
};


export const createWalletWithEmail = async (email) => {
  if (MOCK_MODE) {
    await simulateNetworkDelay(1000);
    
    const mockAddress = generateMockStacksAddress();
    const mockOrgId = generateMockOrgId();

    return {
      address: mockAddress,
      organizationId: mockOrgId,
      wallet: {
        addresses: [mockAddress],
        name: `SYRA-${Date.now()}`,
      },
    };
  }

  
  throw new Error('Production Turnkey not configured. Set up your Turnkey credentials.');
};


export const createWalletWithPasskey = async () => {
  if (MOCK_MODE) {
    await simulateNetworkDelay(1200);
    
    const mockAddress = generateMockStacksAddress();
    const mockOrgId = generateMockOrgId();

    return {
      address: mockAddress,
      organizationId: mockOrgId,
      wallet: {
        addresses: [mockAddress],
        name: `SYRA-Passkey-${Date.now()}`,
      },
    };
  }

  throw new Error('Production Turnkey not configured. Set up your Turnkey credentials.');
};


export const signTransaction = async (organizationId, unsignedTransaction) => {
  if (MOCK_MODE) {
    await simulateNetworkDelay(800);
    
    return {
      signed: true,
      txId: generateMockTxId(),
      signature: 'mock_signature_' + Date.now(),
    };
  }

  throw new Error('Production Turnkey not configured. Set up your Turnkey credentials.');
};


export const getWalletBalance = async (organizationId, address) => {
  try {
    const network = import.meta.env.VITE_STACKS_NETWORK === 'mainnet' 
      ? 'https://api.mainnet.hiro.so'
      : 'https://api.testnet.hiro.so';

    const response = await fetch(
      `${network}/extended/v1/address/${address}/balances`
    );
    
    if (!response.ok) {
      console.warn('Could not fetch balance, using mock data');
      return { stx: 0.5, fungible_tokens: {} };
    }

    const data = await response.json();
    return {
      stx: parseInt(data.stx.balance) / 1000000,
      fungible_tokens: data.fungible_tokens,
    };
  } catch (error) {
    console.error('Error fetching balance:', error);
    
    return { stx: 0.5, fungible_tokens: {} };
  }
};


export const getOAuthUrl = (provider, redirectUri) => {
  if (MOCK_MODE) {
    
    return `${redirectUri}?mock=true&provider=${provider}`;
  }

  throw new Error('Production Turnkey OAuth not configured.');
};


const createMockTurnkeyInstance = () => ({
  auth: {
    email: async ({ email }) => {
      await simulateNetworkDelay(1000);
      return {
        organizationId: generateMockOrgId(),
        success: true,
      };
    },
    passkey: async () => {
      await simulateNetworkDelay(1200);
      return {
        organizationId: generateMockOrgId(),
        success: true,
      };
    },
    getOAuthUrl: ({ provider, redirectUri }) => {
      return `${redirectUri}?mock=true&provider=${provider}`;
    },
  },
  wallet: {
    create: async ({ organizationId }) => {
      await simulateNetworkDelay(800);
      return {
        addresses: [generateMockStacksAddress()],
        walletId: 'mock_wallet_' + Date.now(),
      };
    },
    get: async ({ organizationId }) => {
      await simulateNetworkDelay(500);
      return {
        addresses: [generateMockStacksAddress()],
        walletId: 'mock_wallet_' + Date.now(),
      };
    },
  },
  signTransaction: async ({ organizationId, unsignedTransaction }) => {
    await simulateNetworkDelay(800);
    return {
      signed: true,
      txId: generateMockTxId(),
    };
  },
});

const simulateNetworkDelay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const generateMockStacksAddress = () => {
  const prefix = 'ST';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let address = prefix;
  
  for (let i = 0; i < 39; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return address;
};

const generateMockOrgId = () => {
  return 'org_' + Math.random().toString(36).substring(2, 15);
};

const generateMockTxId = () => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

export default {
  initializeTurnkey,
  createWalletWithEmail,
  createWalletWithPasskey,
  signTransaction,
  getWalletBalance,
  getOAuthUrl,
};
