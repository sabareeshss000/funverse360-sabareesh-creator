import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Search, UserPlus, Check, Vote, Sparkles, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SquadPage = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [poll, setPoll] = useState(null);
  const [voting, setVoting] = useState(false);
  const [requestSentMap, setRequestSentMap] = useState({});

  const fetchFriendsAndPoll = async () => {
    try {
      const [friendsRes, pollRes] = await Promise.all([
        api.get('/friends'),
        api.get('/friends/squad/poll')
      ]);
      setFriends(friendsRes.data);
      setPoll(pollRes.data);
    } catch (err) {
      console.error('[SQUAD ERROR]', err.message);
    }
  };

  useEffect(() => {
    fetchFriendsAndPoll();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const res = await api.get('/friends/search', { params: { q: searchQuery } });
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendRequest = async (receiverId) => {
    try {
      await api.post('/friends/request', { receiverId });
      setRequestSentMap({ ...requestSentMap, [receiverId]: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending request');
    }
  };

  const handleVote = async (option) => {
    setVoting(true);
    try {
      const res = await api.post('/friends/squad/vote', { option });
      setPoll(prev => ({
        ...prev,
        percentages: res.data.percentages,
        userVote: res.data.userVote
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-pink-400 text-xs font-black uppercase tracking-wider mb-1">
          <Users className="w-4 h-4" />
          <span>Squad Social & Group Democracy</span>
        </div>
        <h1 className="font-gaming font-black text-3xl sm:text-4xl text-white">
          Amusement Squad & Activity Voting
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Add campus friends, form your amusement alliance, and vote together on what to do next!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Live Squad Voting Poll */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SQUAD POLL CARD */}
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/40 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-yellow-400" />
                <h3 className="font-gaming font-extrabold text-lg text-white">
                  Live Squad Vote: {poll?.question || 'WHAT SHOULD WE DO NEXT?'}
                </h3>
              </div>
              <span className="text-[11px] text-pink-400 font-bold bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
                Squad Consensus Active
              </span>
            </div>

            {/* Voting Options & Percentage Bars */}
            <div className="space-y-3 mb-6">
              {[
                { key: 'ride', label: '🎢 Thrill Rides & Coasters', color: 'from-pink-500 to-purple-500' },
                { key: 'food', label: '🍔 Food Court & Dining', color: 'from-yellow-400 to-orange-500' },
                { key: 'game', label: '🎮 Arcade & VR Galaxy', color: 'from-cyan-400 to-blue-500' },
                { key: 'event', label: '🎤 Main Stage Live Event', color: 'from-purple-500 to-pink-500' }
              ].map((opt) => {
                const pct = poll?.percentages?.[opt.key] || 0;
                const isSelected = poll?.userVote === opt.key;

                return (
                  <div
                    key={opt.key}
                    onClick={() => handleVote(opt.key)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-500/20 shadow-neon-pink'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-white mb-2">
                      <span>{opt.label}</span>
                      <span className="font-gaming font-black text-sm text-yellow-400">{pct}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${opt.color} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Group Compatibility Recommendation */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/40 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-gaming font-bold text-xs uppercase text-yellow-300">
                  AI Group Decision Engine
                </div>
                <p className="text-xs text-slate-200 mt-0.5">
                  {poll?.aiRecommendation || 'Thrill Rides has the highest squad compatibility (45%)! Recommending HyperCoaster 360.'}
                </p>
              </div>
            </div>
          </div>

          {/* Current Friends List */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-gaming font-bold text-lg text-white">
              My Amusement Squad Members ({friends.length})
            </h3>

            {friends.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">
                You haven't added squad members yet. Search for students on the right to invite them!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {friends.map((f) => (
                  <div key={f._id} className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                    <img src={f.avatar} alt="" className="w-10 h-10 rounded-xl bg-purple-900/40" />
                    <div>
                      <div className="font-bold text-sm text-white">{f.name}</div>
                      <div className="text-[11px] text-cyan-400 font-semibold">
                        Level {f.level} • {f.xp} XP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Search Students & Add Friend */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-gaming font-bold text-lg text-white">
              Find & Add Students
            </h3>

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white"
              >
                Search
              </button>
            </form>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {searchResults.map((usr) => (
                <div
                  key={usr._id}
                  className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={usr.avatar} alt="" className="w-8 h-8 rounded-lg bg-white/5" />
                    <div>
                      <div className="font-bold text-xs text-white">{usr.name}</div>
                      <div className="text-[10px] text-slate-400">Level {usr.level}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendRequest(usr._id)}
                    disabled={requestSentMap[usr._id]}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      requestSentMap[usr._id]
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-purple-600 hover:bg-purple-500 text-white'
                    }`}
                  >
                    {requestSentMap[usr._id] ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Sent</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SquadPage;
