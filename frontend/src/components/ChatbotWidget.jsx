import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ChevronDown,
  Clock,
  Flame,
  ShieldCheck,
  Ticket,
  Maximize2,
  Minimize2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingPassModal from './BookingPassModal';

const AGE_PILLS = [
  { id: 'kids', label: '🎈 Kids (<12 yrs)', query: 'What are the best rides for kids under 12?' },
  { id: 'teens', label: '⚡ Teens (13–17 yrs)', query: 'Show high-thrill rides suitable for teenagers' },
  { id: 'college', label: '🔥 College (18–25 yrs)', query: 'Give me extreme adrenaline coasters for college students' },
  { id: 'family', label: '👨‍👩‍👧 Family (All Ages)', query: 'Plan a safe family-friendly ride route for all ages' }
];

const ChatbotWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `👋 Hey ${user ? user.name.split(' ')[0] : 'there'}! I'm **FunBot 360**, your AI Ride & Thrill Concierge! 🎢\n\nI can plan the best rides tailored to your **age category**, thrill tolerance, and safety needs. Pick an age group below or ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rides: [],
      suggestions: [
        '🎈 Rides for Kids (<12)',
        '⚡ High thrill for Teens (13-17)',
        '🔥 Extreme adrenaline for College (18-25)',
        '👨‍👩‍👧 Family combo plan'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend, explicitCategory = null) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMessage = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.post('/chatbot/chat', {
        message: text,
        ageCategory: explicitCategory
      });

      const botMessage = {
        sender: 'bot',
        text: res.data.reply,
        safetyAdvice: res.data.safetyAdvice,
        rides: res.data.recommendedRides || [],
        suggestions: res.data.followUpSuggestions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: '⚠️ Oops! I had trouble connecting to the park ride telemetry. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookDirect = async (ride) => {
    try {
      const res = await api.post(`/rides/${ride._id}/book`, { quantity: 1 });
      setSelectedBooking(res.data.booking);
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-20 xl:bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white shadow-neon-pink hover:scale-105 transition-all duration-300 border border-white/20"
            title="Open FunBot 360 AI Ride Concierge"
          >
            <div className="relative">
              <Bot className="w-6 h-6 animate-bounce" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#0B1026] animate-ping"></span>
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-gaming font-extrabold text-xs tracking-wider">AI Ride Concierge</div>
              <div className="text-[10px] text-yellow-300 font-semibold">Plan by Age Category</div>
            </div>
          </button>
        )}
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 xl:bottom-6 right-4 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] glass-panel bg-[#131838]/95 border border-purple-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-fadeIn">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-900/80 via-[#131838] to-pink-900/80 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-neon-purple relative">
                <Bot className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-[#131838] rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-gaming font-extrabold text-sm text-white">FunBot 360</h3>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">
                    AI Concierge
                  </span>
                </div>
                <p className="text-[10px] text-cyan-300 font-medium">
                  Smart Age-Categorized Ride Planner
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Age Filter Pills */}
          <div className="px-3 py-2 bg-white/5 border-b border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {AGE_PILLS.map((pill) => (
              <button
                key={pill.id}
                onClick={() => handleSendMessage(pill.query, pill.id)}
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none shadow-md font-medium'
                      : 'bg-white/10 text-slate-100 rounded-bl-none border border-white/10'
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">
                    {msg.text}
                  </div>

                  {/* Safety Advice Box */}
                  {msg.safetyAdvice && (
                    <div className="mt-2.5 p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-[11px] text-yellow-300 flex items-start gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                      <span>{msg.safetyAdvice}</span>
                    </div>
                  )}

                  {/* Recommended Ride Cards Inline */}
                  {msg.rides && msg.rides.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-[10px] font-extrabold uppercase text-cyan-400 tracking-wider">
                        🎡 Recommended Rides for this Age Category:
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.rides.map((ride) => (
                          <div
                            key={ride._id}
                            className="bg-black/40 border border-white/10 rounded-xl p-2.5 flex items-center justify-between gap-2.5 hover:border-pink-500/40 transition-colors"
                          >
                            <img
                              src={ride.image}
                              alt={ride.name}
                              className="w-12 h-12 rounded-lg object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-gaming font-bold text-xs text-white truncate">
                                {ride.name}
                              </h5>
                              <div className="text-[10px] text-slate-300 flex items-center gap-2 mt-0.5">
                                <span className="text-yellow-400 font-bold">
                                  {ride.price === 0 ? 'FREE' : `₹${ride.price}`}
                                </span>
                                <span>•</span>
                                <span className="text-pink-400 flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5" />
                                  {ride.estimatedWait}m wait
                                </span>
                              </div>
                              <div className="text-[9px] text-slate-400 truncate">
                                Min: {ride.minHeight} • {ride.adventureLevel} Thrill
                              </div>
                            </div>

                            <button
                              onClick={() => handleBookDirect(ride)}
                              className="px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm shrink-0 hover:opacity-90"
                            >
                              Book
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-500 px-1 mt-1 font-mono">
                  {msg.timestamp}
                </span>

                {/* Follow-up suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sug)}
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-cyan-300 max-w-[70%] animate-pulse">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>FunBot is calculating age thrills & safety...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 bg-white/5 border-t border-white/10 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask for rides by age, thrill, or budget..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0 shadow-neon-pink"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Direct Booking Pass Modal */}
      {selectedBooking && (
        <BookingPassModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
};

export default ChatbotWidget;
