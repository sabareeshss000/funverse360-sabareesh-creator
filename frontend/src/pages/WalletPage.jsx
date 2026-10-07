import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

const WalletPage = () => {
  const { user, updateWalletAndXp } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState(200);
  const [topUpModal, setTopUpModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wallet');
      setWallet(res.data);
    } catch (err) {
      console.error('[WALLET ERROR]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleTopUp = async () => {
    setProcessing(true);
    try {
      const res = await api.post('/wallet/topup', { amount: topUpAmount });
      setWallet(res.data.wallet);
      updateWalletAndXp(res.data.newBalance);
      setTopUpModal(false);
      confetti({ particleCount: 70, spread: 60 });
    } catch (err) {
      alert(err.response?.data?.message || 'Top-up error');
    } finally {
      setProcessing(false);
    }
  };

  const totalBudget = wallet?.totalBudget || 1000;
  const balance = wallet?.balance !== undefined ? wallet.balance : (user?.walletBalance || 500);
  const spent = wallet?.totalSpent || (totalBudget - balance);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-yellow-400 text-xs font-black uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4" />
            <span>Digital Campus Pass</span>
          </div>
          <h1 className="font-gaming font-black text-3xl sm:text-4xl text-white">
            Smart Wallet & Budget
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Track ride tickets, food court orders, arcade tokens, and set daily limits.
          </p>
        </div>

        <button
          onClick={() => setTopUpModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-pink-600 text-white font-gaming font-extrabold text-xs shadow-sm hover:scale-105 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>TOP-UP CREDITS</span>
        </button>
      </div>

      {/* Main Budget Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-yellow-500/40 bg-gradient-to-r from-purple-950/40 via-[#131838] to-pink-950/40 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase mb-1">Total Budget</div>
            <div className="font-gaming font-black text-3xl text-white">₹{totalBudget}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase mb-1">Total Spent</div>
            <div className="font-gaming font-black text-3xl text-pink-400">₹{spent}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase mb-1">Remaining Balance</div>
            <div className="font-gaming font-black text-3xl text-yellow-300">₹{balance}</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
            <span>Budget Utilization</span>
            <span>{Math.min(100, Math.round((spent / totalBudget) * 100))}% used</span>
          </div>
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (spent / totalBudget) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="font-gaming font-bold text-lg text-white">
          Recent Wallet Transactions
        </h3>

        {(!wallet?.transactions || wallet.transactions.length === 0) ? (
          <div className="text-xs text-slate-400 py-6 text-center">
            No transactions yet. Book a ride or order food to see your audit log!
          </div>
        ) : (
          <div className="space-y-3">
            {wallet.transactions.slice().reverse().map((tx, idx) => (
              <div
                key={tx._id || idx}
                className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-4 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    tx.type === 'CREDIT' ? 'bg-green-500/20 text-green-400' : 'bg-pink-500/20 text-pink-400'
                  }`}>
                    {tx.type === 'CREDIT' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{tx.title}</div>
                    <div className="text-xs text-slate-400">{tx.description || tx.category}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-gaming font-black text-base ${
                    tx.type === 'CREDIT' ? 'text-green-400' : 'text-slate-100'
                  }`}>
                    {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {new Date(tx.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top-up Modal */}
      {topUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm glass-panel bg-[#131838] border border-yellow-500/40 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-gaming font-extrabold text-xl text-white mb-2">
              Reload Smart Wallet
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Select demo credits to deposit into your account instantly:
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    topUpAmount === amt
                      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300'
                      : 'border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setTopUpModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white/5 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleTopUp}
                disabled={processing}
                className="flex-1 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-yellow-500 to-pink-600 text-white shadow-sm"
              >
                {processing ? 'Depositing...' : `Deposit ₹${topUpAmount}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
