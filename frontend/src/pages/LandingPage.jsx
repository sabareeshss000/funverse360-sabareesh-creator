import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Rocket,
  Compass,
  Zap,
  Flame,
  Award,
  Users,
  ShieldCheck,
  ChevronRight,
  Star,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleQuickStart = async (role = 'USER') => {
    if (!user) {
      await demoLogin(role);
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0B1026] text-slate-100 overflow-hidden">
      
      {/* Background Neon Elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-purple-600/20 via-pink-600/20 to-cyan-400/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-pink-500/30 text-pink-300 text-xs font-bold mb-8 animate-float">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Next-Gen Student Amusement & Social Metaverse</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-gaming text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-none">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-300 bg-clip-text text-transparent">
            FUNVERSE 360
          </span>
        </h1>

        <p className="text-xl sm:text-2xl font-extrabold text-cyan-300 mb-4 tracking-wide uppercase">
          Play • Eat • Explore • Connect • Win
        </p>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          «Your personalized entertainment universe.» One single dynamic platform where students discover what to do, where to go, what to eat, which games to play, and what their squad is up to.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-gaming font-extrabold text-base bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-neon-pink hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Rocket className="w-5 h-5" />
            <span>START EXPLORING</span>
          </Link>

          <Link
            to="/planner"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-gaming font-extrabold text-base glass-panel border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10 hover:border-yellow-400 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span>PLAN MY FUN (AI)</span>
          </Link>
        </div>

        {/* Live Metrics Showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <div className="font-gaming font-black text-2xl sm:text-3xl text-pink-400">10+</div>
            <div className="text-xs text-slate-400 font-bold uppercase mt-1">Extreme Rides</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <div className="font-gaming font-black text-2xl sm:text-3xl text-yellow-400">20+</div>
            <div className="text-xs text-slate-400 font-bold uppercase mt-1">Food Court Delights</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <div className="font-gaming font-black text-2xl sm:text-3xl text-cyan-400">100%</div>
            <div className="text-xs text-slate-400 font-bold uppercase mt-1">Real-time Wait Times</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <div className="font-gaming font-black text-2xl sm:text-3xl text-purple-400">AI</div>
            <div className="text-xs text-slate-400 font-bold uppercase mt-1">Smart Fun Engine</div>
          </div>
        </div>
      </section>

      {/* "FUNVERSE EXPERIENCE" SHOWCASE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-gaming font-extrabold text-3xl sm:text-5xl text-white mb-4">
            THE <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">FUNVERSE 360</span> EXPERIENCE
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Not your everyday website. Designed from the ground up for high adrenaline, social games, smart maps, and instant mobile ticketing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Thrill Rides */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden group hover:border-pink-500/50 transition-all">
            <div className="text-4xl mb-4">🎢</div>
            <h3 className="font-gaming font-black text-xl text-white mb-2">
              Next-Gen Rides & Queues
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Real-time crowd telemetry. View live queue wait times, explore 360 thrills, and generate digital QR passes in seconds.
            </p>
            <Link to="/rides" className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1">
              Explore Rides <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: AI Fun Planner */}
          <div className="glass-panel rounded-3xl p-6 border border-yellow-500/30 relative overflow-hidden group hover:border-yellow-400 transition-all bg-gradient-to-b from-yellow-500/5 to-transparent">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="font-gaming font-black text-xl text-yellow-300 mb-2">
              “What Should I Do Next?”
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              AI itinerary creator. Choose your available time (30m to 4h), budget (₹100 to ₹500), and mood. Get a step-by-step personalized journey!
            </p>
            <Link to="/planner" className="text-xs font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
              Try Fun Planner <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Interactive Arcade */}
          <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 relative overflow-hidden group hover:border-cyan-400 transition-all">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="font-gaming font-black text-xl text-cyan-300 mb-2">
              Live Playable Games & XP
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Play real arcade and reflex minigames right in your browser! All scores, high-scores, and XP gains persist permanently into MongoDB.
            </p>
            <Link to="/games" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Play Games <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 4: Food Court & Mobile Pickup */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden group hover:border-purple-500/50 transition-all">
            <div className="text-4xl mb-4">🍔</div>
            <h3 className="font-gaming font-black text-xl text-white mb-2">
              Food Court Discovery
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Browse pizza, burgers, shakes and desserts. Filter under ₹100 or fastest pickup. Real-time kitchen turnaround and wallet checkout.
            </p>
            <Link to="/food" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
              Order Food <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 5: Smart Interactive Map */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="font-gaming font-black text-xl text-white mb-2">
              Leaflet 360 Smart Map
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              OpenStreetMap powered campus & amusement navigation with crowd heatmaps (🟢 Low, 🟡 Med, 🔴 High) and route drawing.
            </p>
            <Link to="/map" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Open Smart Map <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 6: Squad Polls & Democracy */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden group hover:border-pink-500/50 transition-all">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="font-gaming font-black text-xl text-white mb-2">
              Squad Voting & Social
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Can't decide what to do? Launch a squad poll with friends. AI evaluates group consensus and suggests the perfect activity!
            </p>
            <Link to="/squad" className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1">
              Squad Hub <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 px-4 max-w-5xl mx-auto text-center">
        <div className="glass-panel p-10 rounded-3xl border border-purple-500/40 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl"></div>
          <h3 className="font-gaming font-black text-3xl sm:text-4xl text-white mb-3">
            Ready to dive into the Funverse?
          </h3>
          <p className="text-slate-300 text-sm max-w-lg mx-auto mb-6">
            Get instant access with our Demo Mode or register with your college interests in seconds!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleQuickStart('USER')}
              className="px-6 py-3 rounded-xl font-gaming font-bold text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-pink hover:scale-105 transition-all"
            >
              🚀 Launch Demo Student
            </button>
            <button
              onClick={() => handleQuickStart('ADMIN')}
              className="px-6 py-3 rounded-xl font-gaming font-bold text-sm bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-neon-cyan hover:scale-105 transition-all"
            >
              🛡️ Launch Demo Admin
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-xs text-slate-500">
        <p>FUNVERSE 360 — Play • Eat • Explore • Connect • Win</p>
        <p className="mt-1">“Your Fun. Your Squad. Your Universe.”</p>
        <p className="mt-3 text-slate-400">Created by sabareesh creator</p>
      </footer>
    </div>
  );
};

export default LandingPage;
