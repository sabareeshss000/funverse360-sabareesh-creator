import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Flame, Users, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ChallengeCard = ({ challenge, onClaimSuccess }) => {
  const { user, updateWalletAndXp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(challenge.completed);

  const handleClaim = async () => {
    if (completed || loading) return;
    setLoading(true);

    try {
      const res = await api.post(`/challenges/${challenge._id}/complete`);
      setCompleted(true);

      // Trigger Confetti!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 }
      });

      if (res.data.newTotalXp !== undefined) {
        updateWalletAndXp(undefined, res.data.newTotalXp, res.data.newLevel);
      }

      if (onClaimSuccess) onClaimSuccess(res.data);
    } catch (err) {
      console.error('[CHALLENGE CLAIM ERROR]', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'DAILY':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'WEEKLY':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'SQUAD':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <div className={`glass-panel rounded-3xl p-5 border transition-all ${
      completed ? 'border-green-500/30 bg-green-950/10' : 'border-white/10 hover:border-purple-500/40'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
            {challenge.icon || '🎯'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${getTypeStyle(challenge.type)}`}>
                {challenge.type}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                {challenge.category}
              </span>
            </div>
            <h4 className="font-gaming font-bold text-base text-white">
              {challenge.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-extrabold text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>+{challenge.xpReward} XP</span>
        </div>
      </div>

      <p className="text-xs text-slate-300 mb-4 leading-relaxed">
        {challenge.description}
      </p>

      {/* Progress & Action */}
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/5">
        <div className="flex-1">
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
            <span>Progress</span>
            <span>{completed ? challenge.requirementCount : (challenge.progressCount || 0)} / {challenge.requirementCount}</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                completed ? 'bg-green-400' : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
              style={{ width: `${completed ? 100 : Math.min(100, ((challenge.progressCount || 0) / challenge.requirementCount) * 100)}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={handleClaim}
          disabled={completed || loading}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            completed
              ? 'bg-green-500/20 text-green-400 border border-green-500/40 cursor-default'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-neon-pink'
          }`}
        >
          {completed ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CLAIMED</span>
            </>
          ) : (
            <>
              <Flame className="w-3.5 h-3.5 text-yellow-400" />
              <span>{loading ? 'CLAIMING...' : 'COMPLETE & CLAIM'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;
