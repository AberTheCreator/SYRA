import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from 'lucide-react';
import { calculateImpermanentLoss, formatCurrency } from '../../utils/helpers';

const ILCalculator = ({ position, currentPrice = 23.5 }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const initialPrice = (parseFloat(position.range.split('-')[0]) + parseFloat(position.range.split('-')[1])) / 2;
  const priceChange = ((currentPrice - initialPrice) / initialPrice) * 100;
  const il = calculateImpermanentLoss(priceChange);
  const ilAmount = (position.value * Math.abs(il)) / 100;

  const hodlValue = position.amount * (1 + priceChange / 100);
  const lpValue = position.value;
  const feesEarned = position.fees || 0;
  const netDifference = lpValue + feesEarned - hodlValue;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <AlertCircle className="text-violet-600" size={20} />
          Impermanent Loss Analysis
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-xl p-4 border-2 border-rose-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="text-rose-600" size={18} />
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">IL Impact</span>
          </div>
          <p className="text-3xl font-black text-rose-600">{il}%</p>
          <p className="text-sm text-slate-600 mt-1">≈ {formatCurrency(ilAmount)}</p>
        </div>

        <div className={`bg-gradient-to-br ${netDifference >= 0 ? 'from-emerald-50 to-green-50 border-emerald-200' : 'from-amber-50 to-yellow-50 border-amber-200'} rounded-xl p-4 border-2`}>
          <div className="flex items-center gap-2 mb-2">
            {netDifference >= 0 ? (
              <TrendingUp className="text-emerald-600" size={18} />
            ) : (
              <TrendingDown className="text-amber-600" size={18} />
            )}
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Net Position</span>
          </div>
          <p className={`text-3xl font-black ${netDifference >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {netDifference >= 0 ? '+' : ''}{formatCurrency(netDifference)}
          </p>
          <p className="text-sm text-slate-600 mt-1">vs HODLing</p>
        </div>
      </div>

      {showDetails && (
        <div className="space-y-4 border-t-2 border-slate-100 pt-6">
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border-2 border-violet-200">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-violet-600" />
              Value Comparison
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 font-medium">If you HODL'd:</span>
                <span className="font-black text-slate-900">{formatCurrency(hodlValue)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 font-medium">LP Position Value:</span>
                <span className="font-black text-slate-900">{formatCurrency(lpValue)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 font-medium">+ Fees Earned:</span>
                <span className="font-black text-emerald-600">+{formatCurrency(feesEarned)}</span>
              </div>
              
              <div className="border-t-2 border-violet-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total LP Value:</span>
                  <span className="text-xl font-black text-violet-600">{formatCurrency(lpValue + feesEarned)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Initial Price:</span>
              <span className="font-bold text-slate-900">{formatCurrency(initialPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-slate-600 font-medium">Current Price:</span>
              <span className="font-bold text-slate-900">{formatCurrency(currentPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-slate-600 font-medium">Price Change:</span>
              <span className={`font-bold ${priceChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong className="text-blue-700">💡 Note:</strong> Impermanent loss occurs when the price ratio of your LP tokens changes. 
              However, trading fees can offset this loss. Your net position is {netDifference >= 0 ? 'profitable' : 'currently negative'} 
              compared to simply holding the tokens.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ILCalculator
