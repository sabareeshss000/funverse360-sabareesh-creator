import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trophy, Award, Flame, Users, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [boardType, setBoardType] = useState('global');
  const [period, setPeriod] = useState('all');

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leaderboard', {
        params: { type: boardType, period }
      });
      setLeaderboard(res.data.leaderboard);
      setCurrentUserRank(res.data.currentUserRank);
    } catch (err) {
      console.error('[LEADERBOARD ERROR]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [boardType, period]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-yellow-500/20 text-yellow-300 text-xs font-black uppercase mb-3">
          <Trophy className="w-3.5 h-3.5 animate-bounce" />
          <span>Hall of Fame & Rankings</span>
        </div>
        <h1 className="font-gaming font-black text-3xl sm:text-4xl text-white mb-2">
          Amusement Park Leaderboard
        </h1>
        <p className="text-xs text-slate-300">
          Rankings update dynamically when games are played and quests are claimed.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
          {['global', 'campus', 'friends'].map((tab) => (
            <button
              key={tab}
              onClick={() => setBoardType(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize transition-all ${
                boardType === tab
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-pink'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'global' ? '🌍 Global' : tab === 'campus' ? '🎓 Campus' : '👥 Friends'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          {['weekly', 'monthly', 'all'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                period === p ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Active User Rank Highlight Banner */}
      {currentUserRank && (
        <div className="glass-panel p-4 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-gaming font-black text-2xl text-yellow-400">
              #{currentUserRank.rank}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{currentUserRank.name} (You)</span>
                <span className="text-[10px] text-pink-400 bg-pink-500/20 px-2 py-0.5 rounded-full font-extrabold">
                  Lvl {currentUserRank.level}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Streak: {currentUserRank.streak} days • {currentUserRank.xp} Total XP
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-yellow-400 font-extrabold">Active Competitor</span>
          </div>
        </div>
      )}

      {/* Podium for Top 3 */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 pt-4">
          
          {/* #2 Silver */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-400/40 text-center flex flex-col items-center justify-end h-44 bg-gradient-to-t from-slate-500/10 to-transparent">
            <div className="text-2xl mb-1">🥈</div>
            <img src={leaderboard[1].avatar} alt="" className="w-12 h-12 rounded-xl mb-1 bg-white/5" />
            <div className="font-bold text-xs text-white truncate max-w-full">{leaderboard[1].name}</div>
            <div className="font-gaming font-black text-sm text-cyan-400">{leaderboard[1].xp} XP</div>
          </div>

          {/* #1 Gold */}
          <div className="glass-panel p-4 rounded-3xl border border-yellow-500/50 text-center flex flex-col items-center justify-end h-52 bg-gradient-to-t from-yellow-500/15 to-transparent relative -top-4 shadow-neon-purple">
            <div className="text-3xl mb-1">🥇</div>
            <img src={leaderboard[0].avatar} alt="" className="w-14 h-14 rounded-2xl mb-1 bg-white/5 border border-yellow-400" />
            <div className="font-bold text-sm text-white truncate max-w-full">{leaderboard[0].name}</div>
            <div className="font-gaming font-black text-base text-yellow-400">{leaderboard[0].xp} XP</div>
          </div>

          {/* #3 Bronze */}
          <div className="glass-panel p-4 rounded-2xl border border-amber-600/40 text-center flex flex-col items-center justify-end h-40 bg-gradient-to-t from-amber-700/10 to-transparent">
            <div className="text-2xl mb-1">🥉</div>
            <img src={leaderboard[2].avatar} alt="" className="w-10 h-10 rounded-xl mb-1 bg-white/5" />
            <div className="font-bold text-xs text-white truncate max-w-full">{leaderboard[2].name}</div>
            <div className="font-gaming font-black text-sm text-cyan-400">{leaderboard[2].xp} XP</div>
          </div>
        </div>
      )}

      {/* Leaderboard Table List */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
        <div className="divide-y divide-white/5">
          {leaderboard.map((player) => (
            <div
              key={player._id}
              className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                player.isCurrentUser ? 'bg-purple-600/20 border-l-4 border-l-pink-500' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-gaming font-black text-base w-7 text-center text-slate-400">
                  {player.badgeIcon || `#${player.rank}`}
                </span>
                <img src={player.avatar} alt="" className="w-9 h-9 rounded-xl bg-white/5" />
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span>{player.name}</span>
                    {player.isCurrentUser && (
                      <span className="text-[10px] bg-pink-500 text-white font-black px-1.5 py-0.2 rounded-md">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>Level {player.level}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-orange-400">
                      <Flame className="w-3 h-3 fill-orange-400" />
                      {player.streak}d
                    </span>
                  </div>
                </div>
              </div>

              <div className="font-gaming font-black text-base text-yellow-400">
                {player.xp} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
