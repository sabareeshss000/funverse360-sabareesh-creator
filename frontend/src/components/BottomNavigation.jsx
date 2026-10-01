import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, MapPin, Utensils, Gamepad2, Compass } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-white/10 px-2 py-2 flex items-center justify-around">
      <Link
        to="/dashboard"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-xl transition-all ${
          isActive('/dashboard') ? 'text-pink-400 bg-pink-500/10' : 'text-slate-400'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>

      <Link
        to="/planner"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-xl transition-all ${
          isActive('/planner') ? 'text-yellow-400 bg-yellow-500/10' : 'text-slate-400'
        }`}
      >
        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
        <span>Plan</span>
      </Link>

      <Link
        to="/map"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-xl transition-all ${
          isActive('/map') ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'
        }`}
      >
        <MapPin className="w-4 h-4" />
        <span>Map</span>
      </Link>

      <Link
        to="/food"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-xl transition-all ${
          isActive('/food') ? 'text-purple-400 bg-purple-500/10' : 'text-slate-400'
        }`}
      >
        <Utensils className="w-4 h-4" />
        <span>Food</span>
      </Link>

      <Link
        to="/games"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-xl transition-all ${
          isActive('/games') ? 'text-green-400 bg-green-500/10' : 'text-slate-400'
        }`}
      >
        <Gamepad2 className="w-4 h-4" />
        <span>Games</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation;
