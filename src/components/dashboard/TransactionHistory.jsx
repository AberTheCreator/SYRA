import React, { useState, useEffect } from 'react';
import { ArrowDownCircle, ArrowUpCircle, DollarSign, RefreshCw, ArrowDownUp, Download, Filter } from 'lucide-react';
import { generateMockTransactions, getTimestamp, formatCurrency } from '../../utils/helpers';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setTransactions(generateMockTransactions(15));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'Deposit':
        return <ArrowDownCircle className="text-emerald-600" size={20} />;
      case 'Withdrawal':
        return <ArrowUpCircle className="text-rose-600" size={20} />;
      case 'Fees Collected':
        return <DollarSign className="text-violet-600" size={20} />;
      case 'Rebalance':
        return <RefreshCw className="text-blue-600" size={20} />;
      case 'Swap':
        return <ArrowDownUp className="text-amber-600" size={20} />;
      default:
        return null;
    }
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === filter);

  const exportToCSV = () => {
    const csv = [
      ['Type', 'Amount', 'Token', 'Timestamp', 'Status'],
      ...transactions.map(tx => [
        tx.type,
        tx.amount,
        tx.token,
        new Date(tx.timestamp).toLocaleString(),
        tx.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'syra-transactions.csv';
    a.click();
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-100">
    
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-black text-slate-900">Transaction History</h2>
        <div className="flex gap-3">
          <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === 'all' ? 'bg-white text-violet-600 shadow-md' : 'text-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('Deposit')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === 'Deposit' ? 'bg-white text-violet-600 shadow-md' : 'text-slate-600'
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setFilter('Fees Collected')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === 'Fees Collected' ? 'bg-white text-violet-600 shadow-md' : 'text-slate-600'
              }`}
            >
              Fees
            </button>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-purple-700 transition-all shadow-md"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

    
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTransactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-slate-100 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-sm border-2 border-slate-100">
                {getIcon(tx.type)}
              </div>
              <div>
                <p className="font-bold text-slate-900">{tx.type}</p>
                <p className="text-sm text-slate-500">{getTimestamp(new Date(tx.timestamp))}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-slate-900 text-lg">
                {tx.type === 'Withdrawal' ? '-' : '+'}{tx.amount} {tx.token}
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                tx.status === 'success' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {tx.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-medium">No transactions found for this filter</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
