export const COLORS = {
  background: 'from-violet-50 via-purple-50 to-fuchsia-50',
  primary: 'from-violet-600 via-purple-600 to-fuchsia-600',
  secondary: 'from-emerald-500 to-green-500',
  surface: 'bg-white',
  cardBorder: 'border-slate-100',
};

export const TOKENS = ['USDC', 'SOL', 'USDT', 'RAY', 'SRM'];

export const POOLS = [
  { pair: 'SOL/USDC', fee: '0.3%' },
  { pair: 'SOL/USDT', fee: '0.3%' },
  { pair: 'RAY/USDC', fee: '0.5%' },
  { pair: 'SRM/SOL', fee: '0.5%' },
];

export const STRATEGY_TYPES = [
  { value: 'single-sided', label: 'Single-Sided Liquidity', description: 'Stay fully exposed to one asset' },
  { value: 'limit-order', label: 'Limit Order', description: 'Execute trades at target price' },
  { value: 'dca', label: 'DCA Strategy', description: 'Dollar-cost average over time' },
  { value: 'range-lp', label: 'Range LP', description: 'Concentrated liquidity position' },
];

export const STRATEGY_TEMPLATES = [
  {
    id: 'conservative',
    name: 'Conservative LP',
    description: 'Wide range, lower risk, steady fees',
    icon: 'Shield',
    config: { range: 'wide', riskLevel: 'low' },
    color: 'from-emerald-500 to-green-500'
  },
  {
    id: 'aggressive',
    name: 'Aggressive Trader',
    description: 'Narrow range, higher fees, active management',
    icon: 'TrendingUp',
    config: { range: 'narrow', riskLevel: 'high' },
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 'auto-dca',
    name: 'Auto-DCA SOL',
    description: 'Buy dips automatically below market',
    icon: 'Zap',
    config: { strategy: 'dca', asset: 'SOL' },
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'yield-farmer',
    name: 'Yield Farmer',
    description: 'Maximize fee generation in active ranges',
    icon: 'DollarSign',
    config: { strategy: 'yield', riskLevel: 'medium' },
    color: 'from-amber-500 to-orange-500'
  }
];

export const MOCK_ACHIEVEMENTS = [
  { id: 'first_position', name: 'First Steps', description: 'Created your first position', unlocked: true },
  { id: 'range_master', name: 'Range Master', description: 'Keep position in range for 7 days', unlocked: false },
  { id: 'fee_collector', name: 'Fee Collector', description: 'Earned $100 in fees', unlocked: false },
  { id: 'diversified', name: 'Diversified LP', description: 'Active in 3+ pools', unlocked: false },
];

export const MOCK_LEADERBOARD = [
  { rank: 1, address: 'DYw8j...Hx7K', tvl: 125000, fees: 3420, apy: 34.2 },
  { rank: 2, address: 'FmK9P...Qx2L', tvl: 98000, fees: 2890, apy: 31.8 },
  { rank: 3, address: 'Hn2Lp...Zt4M', tvl: 87500, fees: 2340, apy: 29.4 },
  { rank: 4, address: 'You', tvl: 210, fees: 3.2, apy: 18.5, highlight: true },
  { rank: 5, address: 'Jx7Kn...Lp9Q', tvl: 65000, fees: 1780, apy: 25.1 },
];

export const DEMO_MODE_DATA = {
  position: {
    pool: 'SOL/USDC',
    token: 'USDC',
    amount: '500',
    lowerPrice: '20',
    upperPrice: '25',
    strategy: 'single-sided'
  },
  swap: {
    fromToken: 'USDC',
    toToken: 'SOL',
    amount: '100'
  }
};
