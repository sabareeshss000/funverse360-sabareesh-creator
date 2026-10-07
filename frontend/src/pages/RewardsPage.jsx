import React, { useState, useEffect } from 'react';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, CheckCircle2, Lock, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RewardsPage = () => {
  const { user, updateWalletAndXp } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimedReward, setClaimedReward] = useState(null);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rewards');
      setRewards(res.data);
    } catch (err) {
      console.error('[REWARDS ERROR]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleClaim = async (reward) => {
    try {
      const res = await api.post(`/rewards/${reward._id}/claim`);
      setClaimedReward({ ...reward, code: res.data.couponCode });
      if (res.data.newWalletBalance) {
        updateWalletAndXp(res.data.newWalletBalance);
      }
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      fetchRewards();
    } catch (err) {
      alert(err.response?.data?.message || 'Error claiming reward');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-pink-400 text-xs font-black uppercase tracking-wider mb-1">
            <Gift className="w-4 h-4" />
            <span>XP Store & Discounts</span>
          </div>
          <h1 className="font-gaming font-black text-3xl sm:text-4xl text-white">
            Rewards & Privilege Perks
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Redeem your hard-earned XP for wallet credits, free passes, and dining vouchers.
          </p>
        </div>

        <div className="bg-white/5 border border-yellow-500/40 p-3 rounded-2xl flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Your Available XP</div>
            <div className="font-gaming font-black text-base text-yellow-300">
              {user?.xp || 250} XP
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading rewards showcase...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const canAfford = (user?.xp || 0) >= reward.xpRequired;

            return (
              <div
                key={reward._id}
                className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-pink-500/40 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                      {reward.icon || '🎁'}
                    </div>
                    <span className="font-gaming font-black text-sm text-yellow-400 bg-yellow-500/10 px-2.5 py-1 rounded-xl border border-yellow-500/20">
                      {reward.xpRequired} XP
                    </span>
                  </div>

                  <h3 className="font-gaming font-bold text-base text-white mb-1">
                    {reward.name}
                  </h3>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleClaim(reward)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      canAfford
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-pink hover:opacity-95'
                        : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Gift className="w-3.5 h-3.5" />
                        <span>REDEEM PERK</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Need {reward.xpRequired - (user?.xp || 0)} More XP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Claimed Voucher Modal */}
      {claimedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm glass-panel bg-[#131838] border border-pink-500/40 rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 mx-auto flex items-center justify-center text-2xl mb-3">
              🎉
            </div>
            <h3 className="font-gaming font-black text-xl text-white mb-1">
              REWARD REDEEMED!
            </h3>
            <p className="text-xs text-slate-300 mb-4">{claimedReward.name}</p>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 mb-4">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Your Voucher Coupon Code
              </span>
              <div className="font-mono font-black text-lg text-yellow-300 tracking-wider">
                {claimedReward.code}
              </div>
            </div>

            <button
              onClick={() => setClaimedReward(null)}
              className="w-full py-2.5 rounded-xl font-extrabold text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPage;
