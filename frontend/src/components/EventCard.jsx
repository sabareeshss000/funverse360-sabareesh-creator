import React from 'react';
import { Calendar, Clock, MapPin, Users, Ticket } from 'lucide-react';

const EventCard = ({ event, onRsvpClick }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'LIVE':
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-red-600 text-white shadow-lg animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            LIVE NOW
          </span>
        );
      case 'STARTING_SOON':
        return (
          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-yellow-500 text-black shadow-lg">
            🟡 STARTING SOON
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-green-500/20 text-green-400 border border-green-500/40">
            🟢 AVAILABLE
          </span>
        );
    }
  };

  return (
    <div className="glass-panel glass-card-hover rounded-3xl overflow-hidden flex flex-col group border border-white/10 hover:border-pink-500/50">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131838] via-transparent to-black/40"></div>

        <div className="absolute top-3 left-3">
          {getStatusBadge(event.status)}
        </div>

        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-slate-200">
          {event.category}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-gaming font-extrabold text-base text-white group-hover:text-pink-400 transition-colors mb-1.5">
            {event.title}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 mb-3">
            {event.description}
          </p>

          <div className="space-y-1.5 text-xs text-slate-400 mb-4 bg-white/5 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              <span>{event.date} • {event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{event.location?.name || 'Main Amphitheater'}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
              <span className="flex items-center gap-1 text-slate-300">
                <Users className="w-3 h-3 text-purple-400" />
                {event.attendees} / {event.capacity} attending
              </span>
              <span className="text-yellow-400 font-bold">
                {event.price === 0 ? 'FREE ENTRY' : `₹${event.price}`}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onRsvpClick(event)}
          className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-neon-pink flex items-center justify-center gap-1.5 transition-all"
        >
          <Ticket className="w-4 h-4" />
          <span>RSVP / GET PASS (+100 XP)</span>
        </button>
      </div>
    </div>
  );
};

export default EventCard;
