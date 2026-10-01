import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import BookingPassModal from '../components/BookingPassModal';
import { Calendar, Music, Sparkles, Filter, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EVENT_CATEGORIES = ['All', 'Music', 'DJ', 'Dance', 'Competitions', 'Shows', 'Open Mic'];

const EventsPage = () => {
  const { updateWalletAndXp } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await api.get('/events', { params });
      setEvents(res.data);
    } catch (err) {
      console.error('[EVENTS FETCH ERROR]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, statusFilter]);

  const handleRsvp = async (event) => {
    try {
      const res = await api.post(`/events/${event._id}/rsvp`);
      updateWalletAndXp(undefined, res.data.newXp, res.data.newLevel);
      setConfirmedBooking(res.data.booking);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'RSVP failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-pink-400 text-xs font-black uppercase tracking-wider mb-1">
          <Music className="w-4 h-4" />
          <span>Live Entertainment & Festivals</span>
        </div>
        <h1 className="font-gaming font-black text-3xl sm:text-4xl text-white">
          Campus & Park Live Events
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          EDM stages, beatbox competitions, fireworks, and open mic comedy. RSVP for instant QR access passes!
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {EVENT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-neon-pink'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="h-6 w-[1px] bg-white/20 mx-2 shrink-0"></div>

        <button
          onClick={() => setStatusFilter(statusFilter === 'LIVE' ? 'All' : 'LIVE')}
          className={`px-3 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
            statusFilter === 'LIVE'
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-white/5 border border-white/10 text-red-400 hover:bg-white/10'
          }`}
        >
          🔴 LIVE NOW ONLY
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading festival line-up...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} onRsvpClick={handleRsvp} />
          ))}
        </div>
      )}

      {/* QR Pass Modal */}
      {confirmedBooking && (
        <BookingPassModal booking={confirmedBooking} onClose={() => setConfirmedBooking(null)} />
      )}
    </div>
  );
};

export default EventsPage;
