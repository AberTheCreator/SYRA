import React from 'react';
import { Shield, TrendingUp, Zap, DollarSign, ArrowRight } from 'lucide-react';
import { STRATEGY_TEMPLATES } from '../../utils/constants';

const StrategyTemplates = ({ onSelectTemplate }) => {
  const iconMap = {
    Shield: Shield,
    TrendingUp: TrendingUp,
    Zap: Zap,
    DollarSign: DollarSign
  };

  return (
    <div className="bg-white rounded-3xl p-10 shadow-lg border-2 border-slate-100">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 mb-3">One-Click Strategies</h2>
        <p className="text-slate-600 text-lg">Pre-configured strategies you can deploy instantly</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {STRATEGY_TEMPLATES.map((template) => {
          const Icon = iconMap[template.icon];
          
          return (
            <div
              key={template.id}
              className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`bg-gradient-to-br ${template.color} w-14 h-14 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={28} />
                </div>
                <ArrowRight className="text-slate-400 group-hover:text-violet-600 transition-colors" size={20} />
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
                {template.name}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {template.description}
              </p>

              <div className="flex gap-2 flex-wrap">
                {template.config.riskLevel && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    template.config.riskLevel === 'low' ? 'bg-emerald-100 text-emerald-700' :
                    template.config.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {template.config.riskLevel.toUpperCase()} RISK
                  </span>
                )}
                {template.config.range && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-100 text-violet-700">
                    {template.config.range.toUpperCase()} RANGE
                  </span>
                )}
                {template.config.strategy && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                    {template.config.strategy.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-2xl p-6 border-2 border-violet-200">
        <p className="text-sm text-slate-700 leading-relaxed">
          <strong className="text-violet-700">💡 Pro Tip:</strong> Start with a conservative strategy to learn the basics, 
          then gradually explore more advanced setups as you become comfortable with DLMM mechanics.
        </p>
      </div>
    </div>
  );
};

export default StrategyTemplates;
