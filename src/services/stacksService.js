import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  principalCV,
  standardPrincipalCV,
} from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

const NETWORK = import.meta.env.VITE_STACKS_NETWORK === 'mainnet' 
  ? new StacksMainnet() 
  : new StacksTestnet();

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const TIP_CONTRACT_NAME = 'tip-distribution';
const NFT_CONTRACT_NAME = 'nft-rewards';
const RECURRING_CONTRACT_NAME = 'recurring-tips';
const CONTENT_CONTRACT_NAME = 'content-unlock';


export const sendTip = async ({ senderAddress, recipientAddress, amount, organizationId }) => {
  try {
    
    const amountInMicroStx = Math.floor(amount * 1000000);

    
    console.log('Sending tip:', {
      from: senderAddress,
      to: recipientAddress,
      amount: amountInMicroStx,
    });

    const txId = generateMockTxId();

    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      txId,
      amount,
      recipient: recipientAddress,
    };
  } catch (error) {
    console.error('Error sending tip:', error);
    return {
      success: false,
      error: error.message || 'Failed to send tip',
    };
  }
};


export const sendTipViaContract = async ({ senderAddress, recipientAddress, amount, organizationId }) => {
  try {
    const amountInMicroStx = Math.floor(amount * 1000000);

    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: TIP_CONTRACT_NAME,
      functionName: 'send-tip',
      functionArgs: [
        standardPrincipalCV(recipientAddress),
        uintCV(amountInMicroStx),
      ],
      senderKey: '', 
      validateWithAbi: true,
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

    return {
      success: true,
      txId: broadcastResponse.txid,
      amount,
      recipient: recipientAddress,
    };
  } catch (error) {
    console.error('Error sending tip via contract:', error);
    return {
      success: false,
      error: error.message || 'Failed to send tip',
    };
  }
};


export const getCreatorStats = async (creatorAddress) => {
  try {
    const response = await fetch(
      `${NETWORK.coreApiUrl}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${TIP_CONTRACT_NAME}/get-creator-stats`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: creatorAddress,
          arguments: [principalCV(creatorAddress).serialize().toString('hex')],
        }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching creator stats:', error);
    return null;
  }
};

export const getWalletBalance = async (address) => {
  try {
    const response = await fetch(
      `${NETWORK.coreApiUrl}/extended/v1/address/${address}/balances`
    );
    const data = await response.json();
    
    return {
      stx: parseInt(data.stx.balance) / 1000000,
      locked: parseInt(data.stx.locked) / 1000000,
      fungible_tokens: data.fungible_tokens,
    };
  } catch (error) {
    console.error('Error fetching balance:', error);
    return { stx: 0, locked: 0, fungible_tokens: {} };
  }
};


export const setupRecurringTip = async ({ senderAddress, recipientAddress, amount, frequency }) => {
  try {
    const amountInMicroStx = Math.floor(amount * 1000000);
    
    const frequencyMap = {
      daily: 144,      
      weekly: 1008,    
      monthly: 4320,   
    };
    
    const frequencyBlocks = frequencyMap[frequency] || 1008;

  
    const txId = generateMockTxId();
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      txId,
      recurringTipId: Date.now(),
    };
  } catch (error) {
    console.error('Error setting up recurring tip:', error);
    return {
      success: false,
      error: error.message || 'Failed to setup recurring tip',
    };
  }
};


export const mintNFTReward = async ({ recipientAddress, creatorId, totalTips }) => {
  try {
    
    const txId = generateMockTxId();
    await new Promise(resolve => setTimeout(resolve, 1200));

    return {
      success: true,
      txId,
      nftId: Date.now(),
      tier: calculateNFTTier(totalTips),
    };
  } catch (error) {
    console.error('Error minting NFT:', error);
    return {
      success: false,
      error: error.message || 'Failed to mint NFT',
    };
  }
};


export const checkContentAccess = async ({ userAddress, creatorAddress, contentId }) => {
  try {
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      hasAccess: false,
      requiredAmount: 0.1,
      userTipTotal: 0.05,
    };
  } catch (error) {
    console.error('Error checking content access:', error);
    return null;
  }
};


export const getTransactionStatus = async (txId) => {
  try {
    const response = await fetch(
      `${NETWORK.coreApiUrl}/extended/v1/tx/${txId}`
    );
    const data = await response.json();
    
    return {
      status: data.tx_status,
      result: data.tx_result,
      blockHeight: data.block_height,
    };
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    return null;
  }
};


const calculateNFTTier = (totalTips) => {
  if (totalTips >= 1) return 'DIAMOND';
  if (totalTips >= 0.5) return 'PLATINUM';
  if (totalTips >= 0.1) return 'GOLD';
  if (totalTips >= 0.05) return 'SILVER';
  return 'BRONZE';
};


const generateMockTxId = () => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};


export const isValidStacksAddress = (address) => {
  if (!address) return false;
  return /^(SP|ST)[0-9A-Z]{38,41}$/.test(address);
};

export default {
  sendTip,
  sendTipViaContract,
  getCreatorStats,
  getWalletBalance,
  setupRecurringTip,
  mintNFTReward,
  checkContentAccess,
  getTransactionStatus,
  isValidStacksAddress,
};
