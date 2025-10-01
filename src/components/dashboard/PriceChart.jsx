import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { generateMockPriceData, formatCurrency } from '../../utils/helpers';

const PriceChart = ({ pair = 'SOL/USDC', positionRange = null }) => {
  const [timeframe, setTimeframe] = useState('7d');
  const [priceData, setPriceData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(23.5);

  useEffect(() => {
  
    const days = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : 30;
    const data = generateMockPriceData(days);
    setPriceData(data);
    setCurrentPrice(data[data.length - 1].price);

    const interval = setInterval(() => {
      setPriceData(prev => {
        const lastPrice = prev[prev.length - 1].price;
        const change = (Math.random() - 0.5) * 0.5;
        const newPrice = Math.max(15, Math.min(30, lastPrice + change));
        
        return [...prev.slice(1), {
          timestamp: Date.now(),
          price: parseFloat(newPrice.toFixed(2)),
          volume: Math.random() * 1000000
        }];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [timeframe]);

  const priceChange = priceData.length > 0 
    ? ((priceData[priceData.length - 1].price - priceData[0].price) / priceData[0].price) * 100 
    : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl p-4 shadow-xl border-2 border-slate-200">
          <p className="text-sm text-slate-600 mb-1">
            {new Date(payload[0].payload.timestamp).toLocaleString()}
          </p>
          <p className="text-lg font-black text-slate-900">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-100">
    
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">{pair}</h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-slate-900">
              {formatCurrency(currentPrice)}
            </span>
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
              priceChange >= 0 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-rose-100 text-rose-700'
            }`}>
              {priceChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
          {['24h', '7d', '30d'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                timeframe === tf
                  ? 'bg-white text-violet-600 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={priceData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(time) => new Date(time).toLocaleDateString()} 
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: 600 }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: 600 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
          
            {positionRange && (
              <>
                <ReferenceLine 
                  y={parseFloat(positionRange.split('-')[0])} 
                  stroke="#10b981" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{ value: 'Lower', position: 'left', fill: '#10b981', fontWeight: 'bold' }}
                />
                <ReferenceLine 
                  y={parseFloat(positionRange.split('-')[1])} 
                  stroke="#f59e0b" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{ value: 'Upper', position: 'left', fill: '#f59e0b', fontWeight: 'bold' }}
                />
              </>
            )}
            
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              fill="url(#colorPrice)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-200 rounded-full px-4 py-2">
          <Activity className="text-emerald-600 animate-pulse" size={16} />
          <span className="text-sm font-bold text-emerald-700">Live Price Updates</span>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;
