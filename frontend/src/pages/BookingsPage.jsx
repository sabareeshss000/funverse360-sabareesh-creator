import React, { useState, useEffect } from 'react';
import api from '../services/api';
import BookingPassModal from '../components/BookingPassModal';
import { Ticket, Calendar, Clock, CheckCircle2, QrCode, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BookingsPage = () => {
  const { updateWalletAndXp } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('[BOOKINGS ERROR]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking and refund the amount?')) return;
    try {
      const res = await api.post(`/bookings/${bookingId}/cancel`);
      alert(res.data.message);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
          <Ticket className="w-4 h-4" />
          <span>My Tickets & Passes</span>
        </div>
        <h1 className="font-gaming font-black text-3xl sm:text-4xl text-white">
          Active Bookings & Passes
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          View all digital entry passes, scannable QR turnstile codes, and ride reservations.
        </p>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading your passes...</div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl text-slate-400">
          No bookings yet! Book a thrill ride or live event to generate your digital QR pass.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className={`glass-panel p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                b.status === 'CANCELLED' ? 'border-white/5 opacity-60' : 'border-white/10 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xl shrink-0">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-white/10 text-cyan-400">
                      {b.itemType} PASS
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      #{b.ticketPassId}
                    </span>
                  </div>
                  <h3 className="font-gaming font-extrabold text-lg text-white">
                    {b.itemName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-pink-400" />
                      {b.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-yellow-400" />
                      {b.time}
                    </span>
                    <span>•</span>
                    <span>Qty: {b.quantity}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                {b.status !== 'CANCELLED' && (
                  <>
                    <button
                      onClick={() => setSelectedPass(b)}
                      className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-neon-cyan flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>
                    <button
                      onClick={() => handleCancelBooking(b._id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Cancel and Refund"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
                {b.status === 'CANCELLED' && (
                  <span className="text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-xl">
                    Cancelled & Refunded
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Pass Modal */}
      {selectedPass && (
        <BookingPassModal booking={selectedPass} onClose={() => setSelectedPass(null)} />
      )}
    </div>
  );
};

export default BookingsPage;
