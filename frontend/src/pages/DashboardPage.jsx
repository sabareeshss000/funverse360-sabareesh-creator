import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import RideCard from '../components/RideCard';
import FoodCard from '../components/FoodCard';
import GameCard from '../components/GameCard';
import EventCard from '../components/EventCard';
import ChallengeCard from '../components/ChallengeCard';
import MiniGameModal from '../components/MiniGameModal';
import BookingPassModal from '../components/BookingPassModal';

import {
  Sparkles,
  Rocket,
  Flame,
  Wallet,
  Trophy,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Zap,
  Activity
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { liveCrowd } = useSocket();
  const navigate = useNavigate();

  const [trending, setTrending] = useState({ rides: [], foods: [], games: [], events: [] });
  const [challenges, setChallenges] = useState([]);
  const [activeTab, setActiveTab] = useState('rides');
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedGameToPlay, setSelectedGameToPlay] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [trendingRes, challengesRes] = await Promise.all([
          api.get('/planner/trending'),
          api.get('/challenges')
        ]);
        setTrending(trendingRes.data);
        setChallenges(challengesRes.data.slice(0, 4));
      } catch (err) {
        console.error('[DASHBOARD ERROR]', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleBookRide = async (ride) => {
    try {
      const res = await api.post(`/rides/${ride._id}/book`, { quantity: 1 });
      setConfirmedBooking(res.data.booking);
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleRsvpEvent = async (event) => {
    try {
      const res = await api.post(`/events/${event._id}/rsvp`);
      setConfirmedBooking(res.data.booking);
    } catch (err) {
      alert(err.response?.data?.message || 'RSVP failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. STUDENT GAMING HERO HEADER */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            <span>Student Adventure Hub</span>
          </div>
          <h1 className="font-gaming font-black text-3xl sm:text-4xl text-white">
            Hey, {user ? user.name : 'Adventurer'}! 👋
          </h1>
          <p className="text-sm font-semibold text-cyan-300 mt-1">
            Ready for some <span className="text-pink-400 font-extrabold uppercase">FUN?</span>
          </p>
        </div>

        {/* Gamification Stats Row */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* XP Bar */}
          <div className="bg-white/5 border border-purple-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 flex items-center justify-center text-lg shadow-neon-purple">
              ⭐
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Total XP</div>
              <div className="font-gaming font-black text-base text-yellow-300">
                {user?.xp || 250} XP
              </div>
            </div>
          </div>

          {/* Level */}
          <div className="bg-white/5 border border-pink-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-600/30 flex items-center justify-center text-lg shadow-neon-pink">
              🏆
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Rank Level</div>
              <div className="font-gaming font-black text-base text-pink-400">
                Level {user?.level || 1}
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-white/5 border border-orange-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/30 flex items-center justify-center text-lg">
              <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Streak</div>
              <div className="font-gaming font-black text-base text-orange-400">
                {user?.streak || 3} Days
              </div>
            </div>
          </div>

          {/* Wallet */}
          <Link
            to="/wallet"
            className="bg-white/5 border border-yellow-500/40 hover:border-yellow-400 px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-yellow-600/20 flex items-center justify-center text-lg">
              💰
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Wallet</div>
              <div className="font-gaming font-black text-base text-yellow-300">
                ₹{user?.walletBalance || 500}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 2. MAIN HERO CARD: "🤖 PLAN MY FUN" */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-yellow-500/40 bg-gradient-to-r from-purple-900/40 via-[#131838] to-pink-900/40 shadow-2xl overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-pink-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-yellow-500/20 text-yellow-300 text-xs font-black uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Recommendation Engine</span>
          </div>

          <h2 className="font-gaming font-black text-3xl sm:text-4xl text-white mb-2">
            “What should I do next?”
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-medium mb-4">
            Example: <span className="text-yellow-300 font-bold">«₹500 • 3 Hours • Adventure + Food»</span>
          </p>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-xl">
            Our modular AI engine evaluates real-time queue times, food preparation queues, crowd density, and your budget to build your perfect custom itinerary.
          </p>

          <Link
            to="/planner"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-gaming font-extrabold text-sm bg-gradient-to-r from-yellow-500 via-pink-600 to-purple-600 text-white shadow-neon-pink hover:scale-105 transition-all"
          >
            <Rocket className="w-4 h-4" />
            <span>START JOURNEY (AI PLANNER)</span>
          </Link>
        </div>
      </div>

      {/* 3. REAL-TIME CROWD PULSE SUMMARY */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="font-gaming font-bold text-sm uppercase text-slate-200 tracking-wider">
              Live Park Crowd Density
            </h3>
          </div>
          <span className="text-[11px] text-green-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
            Syncing via Socket.IO
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>🎢 Rides Zone</span>
              <span className="text-red-400 font-extrabold">{liveCrowd.rides.percentage}%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: `${liveCrowd.rides.percentage}%` }}></div>
            </div>
          </div>

          <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>🍔 Food Court</span>
              <span className="text-red-400 font-extrabold">{liveCrowd.food.percentage}%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: `${liveCrowd.food.percentage}%` }}></div>
            </div>
          </div>

          <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>🎮 Game Zone</span>
              <span className="text-green-400 font-extrabold">{liveCrowd.games.percentage}%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full rounded-full" style={{ width: `${liveCrowd.games.percentage}%` }}></div>
            </div>
          </div>

          <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>🎤 Main Arena</span>
              <span className="text-yellow-400 font-extrabold">{liveCrowd.stage.percentage}%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${liveCrowd.stage.percentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TODAY'S CHALLENGES (3-5 CARDS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h2 className="font-gaming font-black text-2xl text-white">
              Today's Challenges & Quests
            </h2>
          </div>
          <Link to="/challenges" className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1">
            View All Quests <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((c) => (
            <ChallengeCard key={c._id} challenge={c} />
          ))}
        </div>
      </section>

      {/* 5. TRENDING NOW SECTION */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pink-400" />
            <h2 className="font-gaming font-black text-2xl text-white">
              Trending Now
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('rides')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'rides' ? 'bg-purple-600 text-white shadow-neon-purple' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎢 Rides
            </button>
            <button
              onClick={() => setActiveTab('food')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'food' ? 'bg-purple-600 text-white shadow-neon-purple' : 'text-slate-400 hover:text-white'
              }`}
            >
              🍔 Food
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'games' ? 'bg-purple-600 text-white shadow-neon-purple' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎮 Games
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'events' ? 'bg-purple-600 text-white shadow-neon-purple' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎤 Events
            </button>
          </div>
        </div>

        {/* Tab Content Cards */}
        {activeTab === 'rides' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.rides?.map((r) => (
              <RideCard key={r._id} ride={r} onBookClick={handleBookRide} />
            ))}
          </div>
        )}

        {activeTab === 'food' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.foods?.map((f) => (
              <FoodCard key={f._id} food={f} />
            ))}
          </div>
        )}

        {activeTab === 'games' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.games?.map((g) => (
              <GameCard key={g._id} game={g} onPlayClick={(game) => setSelectedGameToPlay(game)} />
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.events?.map((e) => (
              <EventCard key={e._id} event={e} onRsvpClick={handleRsvpEvent} />
            ))}
          </div>
        )}
      </section>

      {/* Interactive Playable Game Modal */}
      {selectedGameToPlay && (
        <MiniGameModal
          game={selectedGameToPlay}
          onClose={() => setSelectedGameToPlay(null)}
          onGamePlayed={(result) => {
            // refresh
          }}
        />
      )}

      {/* Booking Pass Modal with QR */}
      {confirmedBooking && (
        <BookingPassModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
