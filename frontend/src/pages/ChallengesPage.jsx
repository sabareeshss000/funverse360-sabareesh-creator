import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ChallengeCard from '../components/ChallengeCard';
import { Target, Flame, Sparkles, Trophy, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ChallengesPage = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const res = await api.get('/challenges');
      setChallenges(res.data);
    } catch (err) {
      console.error('[CHALLENGES FETCH ERROR]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const filteredChallenges = filterType === 'ALL'
    ? challenges
    : challenges.filter(c => c.type === filterType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-pink-400 text-xs font-black uppercase tracking-wider mb-1">
            <Target className="w-4 h-4" />
            <span>Gamification & XP Quests</span>
          </div>
          <h1 className="font-gaming font-black text-3xl sm:text-4xl text-white">
            Daily, Weekly & Squad Quests
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Complete amusement missions, level up your rank, and claim bonus wallet tokens & badges!
          </p>
        </div>

        {/* User XP stats summary */}
        <div className="flex items-center gap-3 bg-white/5 border border-purple-500/30 p-3 rounded-2xl self-start md:self-auto">
          <div className="text-2xl">🔥</div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Streak & Level</div>
            <div className="font-gaming font-black text-sm text-yellow-300">
              Level {user?.level || 1} • {user?.streak || 3} Day Streak
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-2">
        {['ALL', 'DAILY', 'WEEKLY', 'SQUAD'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
              filterType === type
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-pink'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            {type === 'ALL' ? '🌟 All Quests' : type === 'DAILY' ? '⚡ Daily' : type === 'WEEKLY' ? '🎢 Weekly' : '👥 Squad'}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading active quests...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge._id}
              challenge={challenge}
              onClaimSuccess={() => fetchChallenges()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengesPage;
