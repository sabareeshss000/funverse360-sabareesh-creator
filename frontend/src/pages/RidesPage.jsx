import React, { useState, useEffect } from 'react';
import api from '../services/api';
import RideCard from '../components/RideCard';
import BookingPassModal from '../components/BookingPassModal';
import { Search, Filter, Clock, Flame, Ticket, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RidesPage = () => {
  const { user, updateWalletAndXp } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Booking Modal
  const [selectedRide, setSelectedRide] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [timeSlot, setTimeSlot] = useState('Next Available (10 min)');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (level) params.adventureLevel = level;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/rides', { params });
      setRides(res.data);
    } catch (err) {
      console.error('[RIDES FETCH ERROR]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [level, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRides();
  };

  const handleOpenBooking = (ride) => {
    setSelectedRide(ride);
    setQuantity(1);
  };

  const handleConfirmBooking = async () => {
    if (!selectedRide) return;
    setBookingLoading(true);

    try {
      const res = await api.post(`/rides/${selectedRide._id}/book`, {
        quantity,
        timeSlot
      });

      updateWalletAndXp(res.data.newWalletBalance, res.data.newXp, res.data.newLevel);
      setConfirmedBooking(res.data.booking);
      setSelectedRide(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-pink-400 text-xs font-black uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Adrenaline & Attractions</span>
          </div>
          <h1 className="font-gaming font-black text-3xl sm:text-4xl text-white">
            Amusement & Thrill Rides
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Browse queue times, book FastTrack passes, and scan digital passes at the turnstiles.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search roller coasters, swings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-pink-500 w-64"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <span className="text-xs text-slate-400 font-bold mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Thrill:
        </span>
        {['', 'Extreme', 'High', 'Moderate', 'Low'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              level === lvl
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-pink'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            {lvl === '' ? 'All Thrills' : lvl}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">Max Price:</span>
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="bg-[#131838] border border-white/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none"
          >
            <option value="">Any Price</option>
            <option value="80">Under ₹80</option>
            <option value="100">Under ₹100</option>
            <option value="150">Under ₹150</option>
          </select>
        </div>
      </div>

      {/* Rides Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading thrilling rides...</div>
      ) : rides.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl text-slate-400">
          No rides match your filter criteria. Try resetting filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rides.map((ride) => (
            <RideCard key={ride._id} ride={ride} onBookClick={handleOpenBooking} />
          ))}
        </div>
      )}

      {/* Booking Checkout Modal */}
      {selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel bg-[#131838] border border-purple-500/40 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-gaming font-extrabold text-xl text-white mb-1">
              Book Ride Pass
            </h3>
            <p className="text-xs text-cyan-400 mb-4">{selectedRide.name}</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Ticket Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white/10 font-bold text-white"
                  >
                    -
                  </button>
                  <span className="font-gaming font-extrabold text-base text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white/10 font-bold text-white"
                  >
                    +
                  </button>
                  <span className="text-xs text-slate-400 ml-auto">
                    ₹{selectedRide.price} each
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Select Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                >
                  <option value="Next Available (10 min)">Next Available (10 min)</option>
                  <option value="Today 17:30">Today 17:30</option>
                  <option value="Today 18:30">Today 18:30</option>
                  <option value="Today 19:30">Today 19:30</option>
                  <option value="Night Express 20:30">Night Express 20:30</option>
                </select>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                <span className="text-slate-300">Total Deduction:</span>
                <span className="font-gaming font-black text-lg text-yellow-400">
                  ₹{selectedRide.price * quantity}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedRide(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white/5 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={bookingLoading}
                className="flex-1 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-pink"
              >
                {bookingLoading ? 'Confirming...' : 'Confirm & Generate QR'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmed QR Pass Modal */}
      {confirmedBooking && (
        <BookingPassModal booking={confirmedBooking} onClose={() => setConfirmedBooking(null)} />
      )}
    </div>
  );
};

export default RidesPage;
