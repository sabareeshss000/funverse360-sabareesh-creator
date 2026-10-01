import React from 'react';
import { Star, Clock, Users, ArrowRight } from 'lucide-react';

const RideCard = ({ ride, onBookClick }) => {
  const getAdventureBadge = (level) => {
    switch (level) {
      case 'Extreme':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'High':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/40';
      case 'Moderate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
    }
  };

  return (
    <div className="glass-panel glass-card-hover rounded-3xl overflow-hidden flex flex-col group border border-white/10 hover:border-purple-500/50">
      {/* Ride Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={ride.image}
          alt={ride.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131838] via-transparent to-black/40"></div>

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-xl border backdrop-blur-md ${getAdventureBadge(ride.adventureLevel)}`}>
            {ride.adventureLevel} Thrill
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-black/60 text-white backdrop-blur-md border border-white/10 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            {ride.rating}
          </span>
        </div>

        {/* Wait time badge */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-xl flex items-center gap-1 text-xs font-bold text-yellow-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{ride.estimatedWait}m wait</span>
        </div>
      </div>

      {/* Ride Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-gaming font-extrabold text-lg text-white group-hover:text-pink-400 transition-colors">
              {ride.name}
            </h3>
            <span className="text-base font-black text-cyan-400">
              {ride.price === 0 ? 'FREE' : `₹${ride.price}`}
            </span>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
            {ride.description}
          </p>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 mb-4 py-2 border-y border-white/5">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Queue: {ride.currentQueue} ppl</span>
            </div>
            <div>•</div>
            <div>Min: {ride.minHeight}</div>
            <div>•</div>
            <div>{ride.duration}</div>
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={() => onBookClick(ride)}
          className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-neon-purple flex items-center justify-center gap-2 transition-all"
        >
          <span>BOOK NOW</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default RideCard;
