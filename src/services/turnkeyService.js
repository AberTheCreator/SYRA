import { Turnkey } from '@turnkey/sdk-react';

const turnkeyConfig = {
  apiBaseUrl: import.meta.env.VITE_TURNKEY_API_URL || 'https://api.turnkey.com',
  defaultOrganizationId: import.meta.env.VITE_TURNKEY_ORG_ID,
  rpId: import.meta.env.VITE_TURNKEY_RP_ID || 'syra.app',
  iframeUrl: import.meta.env.VITE_TURNKEY_IFRAME_URL || 'https://auth.turnkey.com',
};

let turnkeyInstance = null;

export const initializeTurnkey = async () => {
  if (!turnkeyInstance) {
    turnkeyInstance = new Turnkey(turnkeyConfig);
  }
  return turnkeyInstance;
};

export const createWalletWithEmail = async (email) => {
  const turnkey = await initializeTurnkey();
  
  const authResponse = await turnkey.auth.email({
    email,
    targetPublicKey: turnkeyConfig.defaultOrganizationId,
  });

  if (!authResponse.organizationId) {
    throw new Error('Failed to authenticate with email');
  }

  const wallet = await turnkey.wallet.create({
    organizationId: authResponse.organizationId,
    wallet: {
      walletName: `SYRA-${Date.now()}`,
      accounts: [
        {
          curve: 'CURVE_SECP256K1',
          pathFormat: 'PATH_FORMAT_BIP32',
          path: "m/44'/5757'/0'/0/0",
          addressFormat: 'ADDRESS_FORMAT_BITCOIN',
        },
      ],
    },
  });

  return {
    address: wallet.addresses[0],
    organizationId: authResponse.organizationId,
    wallet,
  };
};

export const createWalletWithPasskey = async () => {
  const turnkey = await initializeTurnkey();
  
  const passkeyResponse = await turnkey.auth.passkey();

  if (!passkeyResponse.organizationId) {
    throw new Error('Failed to authenticate with passkey');
  }

  const wallet = await turnkey.wallet.get({
    organizationId: passkeyResponse.organizationId,
  });

  return {
    address: wallet.addresses[0],
    organizationId: passkeyResponse.organizationId,
    wallet,
  };
};

export const signTransaction = async (organizationId, unsignedTransaction) => {
  const turnkey = await initializeTurnkey();
  
  const signedTx = await turnkey.signTransaction({
    organizationId,
    signWith: organizationId,
    unsignedTransaction,
  });

  return signedTx;
};

export const getWalletBalance = async (organizationId, address) => {
  try {
    const response = await fetch(
      `https://api.stacks.co/extended/v1/address/${address}/balances`
    );
    const data = await response.json();
    return {
      stx: parseInt(data.stx.balance) / 1000000,
      fungible_tokens: data.fungible_tokens,
    };
  } catch (error) {
    console.error('Error fetching balance:', error);
    return { stx: 0, fungible_tokens: {} };
  }
};
