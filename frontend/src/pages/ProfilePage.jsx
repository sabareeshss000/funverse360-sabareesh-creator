import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Award, Flame, Wallet, Sparkles, Shield, Heart } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-purple-600/30 border-2 border-pink-500 p-1 shrink-0 shadow-neon-pink">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`}
            alt=""
            className="w-full h-full rounded-[22px] bg-[#131838]"
          />
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h1 className="font-gaming font-black text-2xl sm:text-3xl text-white">
              {user?.name}
            </h1>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
              Level {user?.level || 1}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mb-3">{user?.email}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1 text-yellow-300">
              <Sparkles className="w-3.5 h-3.5" />
              {user?.xp || 250} Total XP
            </span>
            <span className="flex items-center gap-1 text-orange-400">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              {user?.streak || 3} Day Streak
            </span>
            <span className="flex items-center gap-1 text-green-400">
              <Wallet className="w-3.5 h-3.5" />
              ₹{user?.walletBalance || 500} Wallet
            </span>
          </div>
        </div>
      </div>

      {/* Selected Interests */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
        <h3 className="font-gaming font-bold text-base text-white flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-400" />
          My Entertainment Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {user?.interests?.map((interest) => (
            <span
              key={interest}
              className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/40 text-purple-300"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Unlocked Badges */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="font-gaming font-bold text-base text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-400" />
          Unlocked Badges & Honors
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Fun Pioneer', icon: '🚀', desc: 'First sign-up bonus badge' },
            { name: 'Thrill Seeker', icon: '🎢', desc: 'Rode a high thrill roller coaster' },
            { name: 'Arcade Legend', icon: '🎮', desc: 'Set a game score in DB' },
            { name: 'Foodie Explorer', icon: '🍔', desc: 'Ordered at the Food Court' }
          ].map((badge) => (
            <div
              key={badge.name}
              className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center hover:border-yellow-400/40 transition-all"
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h4 className="font-gaming font-bold text-xs text-white mb-0.5">{badge.name}</h4>
              <p className="text-[10px] text-slate-400">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
