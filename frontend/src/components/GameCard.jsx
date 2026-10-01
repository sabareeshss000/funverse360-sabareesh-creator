import React from 'react';
import { Gamepad2, Trophy, Zap, Star } from 'lucide-react';

const GameCard = ({ game, onPlayClick }) => {
  return (
    <div className="glass-panel glass-card-hover rounded-3xl overflow-hidden flex flex-col group border border-white/10 hover:border-cyan-500/50">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131838] via-transparent to-black/30"></div>

        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-cyan-600/80 text-white backdrop-blur-md">
            {game.category}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/40 backdrop-blur-md">
            +{game.xpReward || 80} XP
          </span>
        </div>

        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs text-yellow-400 font-bold">
          <Trophy className="w-3.5 h-3.5" />
          <span>High: {game.highScore} ({game.topPlayer})</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="font-gaming font-bold text-base text-white group-hover:text-cyan-400 transition-colors">
              {game.name}
            </h3>
            <span className="text-sm font-black text-cyan-400">
              {game.price === 0 ? 'FREE' : `₹${game.price}`}
            </span>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 mb-3">
            {game.description || 'Fast-paced arcade challenge. Set your high score and level up your XP!'}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 py-1 border-t border-white/5">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              {game.rating}
            </span>
            <span>Duration: {game.duration}</span>
          </div>
        </div>

        <button
          onClick={() => onPlayClick(game)}
          className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-neon-cyan flex items-center justify-center gap-2 transition-all"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>PLAY NOW & EARN XP</span>
        </button>
      </div>
    </div>
  );
};

export default GameCard;
