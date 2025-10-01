import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { getPositionHealth, getRiskScore } from '../../utils/helpers';

const PositionHealthMonitor = ({ position, currentPrice = 23.5 }) => {
  const health = getPositionHealth(currentPrice, position.range.split('-')[0], position.range.split('-')[1]);
  const riskScore = getRiskScore(
    position.strategy || 'single-sided',
    parseFloat(position.range.split('-')[1]) - parseFloat(position.range.split('-')[0]),
    position.amount
  );

  const getHealthIcon = () => {
    switch (health.status) {
      case 'in-range':
        return <CheckCircle className="text-emerald-600" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-600" size={20} />;
      case 'danger':
        return <AlertTriangle className="text-orange-600" size={20} />;
      default:
        return <AlertTriangle className="text-amber-600" size={20} />;
    }
  };

  const getRiskColor = (score) => {
    if (score < 30) return 'emerald';
    if (score < 60) return 'yellow';
    return 'rose';
  };

  const riskColor = getRiskColor(riskScore);

  return (
    <div className="space-y-4">
    
      <div className={`flex items-center gap-2 bg-${health.color}-50 border-2 border-${health.color}-200 rounded-xl px-4 py-3`}>
        {getHealthIcon()}
        <div className="flex-1">
          <p className={`font-bold text-${health.color}-700`}>{health.label}</p>
          <p className="text-xs text-slate-600">Current price: ${currentPrice}</p>
        </div>
      </div>

      
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border-2 border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Risk Score</span>
          <span className={`text-2xl font-black text-${riskColor}-600`}>{riskScore}/100</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className={`bg-gradient-to-r from-${riskColor}-500 to-${riskColor}-600 h-full rounded-full transition-all duration-500`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {riskScore < 30 ? 'Low risk - stable position' :
           riskScore < 60 ? 'Medium risk - monitor regularly' :
           'High risk - consider rebalancing'}
        </p>
      </div>

      {health.status !== 'in-range' && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-bold text-amber-800 mb-2">Action Recommended</p>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Consider rebalancing your position</li>
                <li>• Current price is {health.label.toLowerCase()}</li>
                <li>• Monitor price movements closely</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border-2 border-violet-200">
        <div className="flex items-center gap-2">
          {Math.random() > 0.5 ? (
            <TrendingUp className="text-emerald-600" size={18} />
          ) : (
            <TrendingDown className="text-rose-600" size={18} />
          )}
          <span className="text-sm font-bold text-slate-700">24h Trend</span>
        </div>
        <span className={`font-black ${Math.random() > 0.5 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 5).toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export default PositionHealthMonitor;
