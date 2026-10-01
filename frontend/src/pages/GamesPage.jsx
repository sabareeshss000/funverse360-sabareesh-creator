import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GameCard from '../components/GameCard';
import MiniGameModal from '../components/MiniGameModal';
import { Gamepad2, Trophy, Flame, History, Star, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GAME_CATEGORIES = ['All', 'Arcade', 'Racing', 'VR', 'Shooting', 'Bowling', 'Puzzle', 'Multiplayer'];

const GamesPage = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState(null);
  const [userHistory, setUserHistory] = useState([]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== 'All') params.category = category;
      const res = await api.get('/games', { params });
      setGames(res.data);
    } catch (err) {
      console.error('[GAMES ERROR]', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserHistory = async () => {
    try {
      const res = await api.get('/games/user/history');
      setUserHistory(res.data);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchGames();
    fetchUserHistory();
  }, [category]);

  const handleGamePlayed = () => {
    fetchGames();
    fetchUserHistory();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <Gamepad2 className="w-4 h-4" />
            <span>Arcade & VR Galaxy Zone</span>
          </div>
          <h1 className="font-gaming font-black text-3xl sm:text-4xl text-white">
            Playable Games & High Scores
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Play reflex, arcade, and VR games right here in your browser! Real scores & XP saved directly to the database.
          </p>
        </div>

        {/* User Mini Gaming Badge */}
        <div className="bg-white/5 border border-purple-500/30 px-4 py-2 rounded-2xl flex items-center gap-3 self-start md:self-auto">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Games Played</div>
            <div className="font-gaming font-black text-sm text-cyan-300">
              {userHistory.length} Sessions Logged
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {GAME_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-neon-cyan'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading arcade stations...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game._id} game={game} onPlayClick={(g) => setSelectedGame(g)} />
          ))}
        </div>
      )}

      {/* User Gameplay History Recorded from Database */}
      {userHistory.length > 0 && (
        <section className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white font-gaming font-bold text-lg">
            <History className="w-5 h-5 text-purple-400" />
            <h3>Your Recent Game Sessions in Database</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {userHistory.slice(0, 6).map((h) => (
              <div key={h._id} className="bg-black/30 p-3.5 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white">{h.gameTitle}</div>
                  <div className="text-[11px] text-slate-400">{new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="text-right">
                  <div className="font-gaming font-black text-yellow-400 text-base">{h.score} pts</div>
                  <div className="text-[10px] text-green-400 font-bold">+{h.xpEarned} XP</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Mini Game Modal */}
      {selectedGame && (
        <MiniGameModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          onGamePlayed={handleGamePlayed}
        />
      )}
    </div>
  );
};

export default GamesPage;
