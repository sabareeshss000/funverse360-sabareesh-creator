import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSocket } from '../context/SocketContext';
import {
  Compass,
  Sparkles,
  ShoppingBag,
  Wallet as WalletIcon,
  Flame,
  Award,
  Bell,
  Menu,
  X,
  Shield,
  User as UserIcon,
  LogOut,
  MapPin
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, demoLogin } = useAuth();
  const { itemCount } = useCart();
  const { liveCrowd, notifications } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleDemo = async (role) => {
    await demoLogin(role);
    if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-[2px] shadow-neon-pink group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B1026] rounded-[10px] flex items-center justify-center text-xl">
              🎢
            </div>
          </div>
          <div>
            <span className="font-gaming font-extrabold text-xl tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
              FUNVERSE<span className="text-pink-500">360</span>
            </span>
            <span className="hidden md:block text-[10px] text-cyan-400 font-semibold tracking-widest uppercase">
              Play • Eat • Explore • Win
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
          <Link to="/dashboard" className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isActive('/dashboard') ? 'bg-purple-600 text-white shadow-neon-purple' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
            Dashboard
          </Link>
          <Link to="/planner" className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${isActive('/planner') ? 'bg-pink-600 text-white shadow-neon-pink' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            Fun Planner
          </Link>
          <Link to="/rides" className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isActive('/rides') ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
            Rides
          </Link>
          <Link to="/food" className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isActive('/food') ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
            Food
          </Link>
          <Link to="/games" className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isActive('/games') ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
            Games
          </Link>
          <Link to="/events" className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isActive('/events') ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
            Events
          </Link>
          <Link to="/map" className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${isActive('/map') ? 'bg-cyan-600 text-white shadow-neon-cyan' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
            <MapPin className="w-3.5 h-3.5 text-cyan-300" />
            Smart Map
          </Link>
          <Link to="/challenges" className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isActive('/challenges') ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
            Quests
          </Link>
          <Link to="/leaderboard" className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isActive('/leaderboard') ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
            Rankings
          </Link>
          <Link to="/squad" className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isActive('/squad') ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
            Squad
          </Link>
        </nav>

        {/* Right Section: Stats, Quick Demo Buttons, Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Demo Switchers for Hackathon Judges */}
          <div className="hidden lg:flex items-center gap-1 bg-[#131838] p-1 rounded-xl border border-purple-500/30">
            <button
              onClick={() => handleDemo('USER')}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 shadow-sm transition-all"
              title="Instant login as Student Demo User"
            >
              🚀 Demo Student
            </button>
            <button
              onClick={() => handleDemo('ADMIN')}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90 shadow-sm transition-all"
              title="Instant login as Park Administrator"
            >
              🛡️ Demo Admin
            </button>
          </div>

          {user ? (
            <>
              {/* Wallet Widget */}
              <Link
                to="/wallet"
                className="flex items-center gap-1.5 bg-funverse-card/90 hover:bg-funverse-card border border-yellow-500/40 px-2.5 py-1.5 rounded-xl text-xs font-bold text-yellow-300 transition-all shadow-sm"
              >
                <WalletIcon className="w-4 h-4 text-yellow-400" />
                <span>₹{user.walletBalance}</span>
              </Link>

              {/* XP & Level Widget */}
              <div className="hidden sm:flex items-center gap-2 bg-funverse-card/80 border border-purple-500/30 px-2.5 py-1 rounded-xl">
                <div className="flex items-center gap-1 text-xs font-bold text-pink-400">
                  <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-bounce" />
                  <span>{user.streak || 1}d</span>
                </div>
                <div className="w-[1px] h-3 bg-white/20"></div>
                <div className="text-xs font-extrabold text-cyan-300">
                  Lvl {user.level || 1}
                </div>
                <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, ((user.xp % 300) / 300) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Food Cart Icon */}
              <Link
                to="/food"
                className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-colors"
                title="Food Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-neon-pink">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Profile Avatar / Dropdown */}
              <div className="relative">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-1.5 p-1 rounded-xl bg-purple-950/60 border border-purple-500/40 hover:border-purple-400 transition-all"
                  title="My Profile"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg bg-purple-900/50"
                  />
                  <span className="hidden md:block text-xs font-bold text-slate-200 max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
              </div>

              {/* Admin Link if admin */}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-cyan-900/50 border border-cyan-400 text-cyan-300 hover:bg-cyan-900 transition-all"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-neon-pink transition-all"
              >
                Join Now
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs font-semibold">
          <Link onClick={() => setMobileMenuOpen(false)} to="/dashboard" className="p-2 rounded-xl bg-white/5 text-slate-200">📊 Dashboard</Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/planner" className="p-2 rounded-xl bg-pink-500/20 text-pink-300 font-bold">🤖 Fun Planner</Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/rides" className="p-2 rounded-xl bg-white/5 text-slate-200">🎢 Rides</Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/food" className="p-2 rounded-xl bg-white/5 text-slate-200">🍔 Food Court</Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/games" className="p-2 rounded-xl bg-white/5 text-slate-200">🎮 Game Zone</Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/events" className="p-2 rounded-xl bg-white/5 text-slate-200">🎤 Live Events</Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/map" className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">🗺️ Smart Map</Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/challenges" className="p-2 rounded-xl bg-white/5 text-slate-200">🎯 Quests & XP</Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/leaderboard" className="p-2 rounded-xl bg-white/5 text-slate-200">🏆 Leaderboard</Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/squad" className="p-2 rounded-xl bg-white/5 text-slate-200">👥 Squad Polls</Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/rewards" className="p-2 rounded-xl bg-white/5 text-slate-200">🎁 Rewards</Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/wallet" className="p-2 rounded-xl bg-yellow-500/20 text-yellow-300">💰 Smart Wallet</Link>
          
          <div className="col-span-2 pt-2 flex gap-2">
            <button
              onClick={() => { handleDemo('USER'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-xs font-bold rounded-xl bg-purple-600 text-white"
            >
              Demo Student
            </button>
            <button
              onClick={() => { handleDemo('ADMIN'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-xs font-bold rounded-xl bg-cyan-600 text-white"
            >
              Demo Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
