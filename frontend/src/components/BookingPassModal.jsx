import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle2, Ticket, Clock, MapPin, Calendar } from 'lucide-react';

const BookingPassModal = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel bg-[#131838]/95 border border-cyan-500/40 rounded-3xl p-6 shadow-neon-cyan overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Ticket className="w-5 h-5" />
            <h3 className="font-gaming font-extrabold text-lg text-white">
              Official Funverse Pass
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket Body */}
        <div className="bg-black/50 border border-white/10 rounded-2xl p-5 text-center mb-4">
          <div className="inline-block bg-white p-3 rounded-2xl mb-4 shadow-xl">
            {booking.qrCode && booking.qrCode.startsWith('data:image') ? (
              <img src={booking.qrCode} alt="Ticket QR" className="w-40 h-40 object-contain" />
            ) : (
              <QRCodeSVG value={booking.qrCode || booking.ticketPassId || 'FUNVERSE-PASS'} size={160} />
            )}
          </div>

          <div className="text-xs font-mono text-cyan-400 font-bold mb-1">
            PASS ID: {booking.ticketPassId}
          </div>
          <h4 className="text-xl font-gaming font-black text-white mb-2">
            {booking.itemName}
          </h4>

          <div className="grid grid-cols-2 gap-2 text-left text-xs bg-white/5 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              <span>{booking.time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Ticket className="w-3.5 h-3.5 text-purple-400" />
              <span>Qty: {booking.quantity}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400 font-bold">{booking.status}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-center text-slate-400 mb-4">
          Present this digital QR ticket pass at the park entrance or turnstile scanner.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl font-extrabold text-xs bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-neon-cyan hover:opacity-90 transition-all"
        >
          Close Pass
        </button>
      </div>
    </div>
  );
};

export default BookingPassModal;
