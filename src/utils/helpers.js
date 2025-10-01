export const formatCurrency = (amount, decimals = 2) => {
  return `$${parseFloat(amount).toLocaleString('en-US', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  })}`;
};

export const formatAddress = (address, startChars = 4, endChars = 4) => {
  if (!address) return '';
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

export const calculateAPY = (fees, principal, days = 30) => {
  if (!principal || principal === 0) return 0;
  const dailyReturn = fees / principal / days;
  const apy = (Math.pow(1 + dailyReturn, 365) - 1) * 100;
  return apy.toFixed(2);
};

export const calculateImpermanentLoss = (priceChange) => {
  
  const ratio = 1 + (priceChange / 100);
  const il = ((2 * Math.sqrt(ratio)) / (1 + ratio) - 1) * 100;
  return il.toFixed(2);
};

export const getPositionHealth = (currentPrice, lowerPrice, upperPrice) => {
  const lower = parseFloat(lowerPrice);
  const upper = parseFloat(upperPrice);
  const current = parseFloat(currentPrice);
  
  if (current < lower) return { status: 'out-range', color: 'amber', label: 'Below Range' };
  if (current > upper) return { status: 'out-range', color: 'amber', label: 'Above Range' };
  
  const rangeSize = upper - lower;
  const distanceFromLower = current - lower;
  const distanceFromUpper = upper - current;
  const minDistance = Math.min(distanceFromLower, distanceFromUpper);
  const healthPercentage = (minDistance / rangeSize) * 100;
  
  if (healthPercentage > 30) return { status: 'in-range', color: 'emerald', label: 'Healthy' };
  if (healthPercentage > 15) return { status: 'warning', color: 'yellow', label: 'Monitor' };
  return { status: 'danger', color: 'orange', label: 'At Risk' };
};

export const getRiskScore = (strategy, rangeSize, liquidity) => {
  let score = 50;
  
  if (strategy === 'aggressive' || strategy === 'limit-order') score += 30;
  if (strategy === 'conservative') score -= 20;
  
  if (rangeSize < 10) score += 20;
  if (rangeSize > 30) score -= 15;
  
  if (liquidity > 10000) score -= 10;
  
  return Math.max(0, Math.min(100, score));
};

export const generateMockPriceData = (days = 7, basePrice = 23.5) => {
  const data = [];
  let price = basePrice;
  
  for (let i = 0; i < days * 24; i++) {
    const change = (Math.random() - 0.5) * 2;
    price = Math.max(15, Math.min(30, price + change));
    
    data.push({
      timestamp: Date.now() - (days * 24 - i) * 3600000,
      price: parseFloat(price.toFixed(2)),
      volume: Math.random() * 1000000
    });
  }
  
  return data;
};

export const generateMockTransactions = (count = 10) => {
  const types = ['Deposit', 'Withdrawal', 'Fees Collected', 'Rebalance', 'Swap'];
  const tokens = ['SOL', 'USDC', 'USDT'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `tx_${i + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    amount: (Math.random() * 1000).toFixed(2),
    token: tokens[Math.floor(Math.random() * tokens.length)],
    timestamp: Date.now() - i * 3600000 * Math.random() * 24,
    status: 'success'
  }));
};

export const simulateSwapRate = (fromToken, toToken, amount) => {
  const rates = {
    'SOL/USDC': 23.4,
    'USDC/SOL': 1 / 23.4,
    'SOL/USDT': 23.3,
    'USDT/SOL': 1 / 23.3,
    'USDC/USDT': 1.001,
    'USDT/USDC': 0.999,
  };
  
  const pair = `${fromToken}/${toToken}`;
  const rate = rates[pair] || 1;
  const slippage = 0.003;
  
  return {
    rate,
    output: amount * rate * (1 - slippage),
    priceImpact: (slippage * 100).toFixed(3),
    fee: amount * 0.003
  };
};

export const getTimestamp = (date = new Date()) => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
