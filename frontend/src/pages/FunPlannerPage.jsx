import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Clock,
  Wallet,
  Smile,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Rocket,
  MapPin,
  Flame,
  Calendar
} from 'lucide-react';
import api from '../services/api';
import BookingPassModal from '../components/BookingPassModal';

const TIME_OPTIONS = [
  { label: '30 mins', value: 30, icon: '⚡' },
  { label: '1 hour', value: 60, icon: '⏱️' },
  { label: '2 hours', value: 120, icon: '⏳' },
  { label: '3 hours', value: 180, icon: '🕒' },
  { label: '4 hours', value: 240, icon: '🎢' }
];

const BUDGET_OPTIONS = [
  { label: '₹100 (Pocket Friendly)', value: 100, icon: '🪙' },
  { label: '₹250 (Student Combo)', value: 250, icon: '💵' },
  { label: '₹500 (Full Experience)', value: 500, icon: '💰' },
  { label: '₹1000 (VIP Baller)', value: 1000, icon: '👑' }
];

const MOOD_OPTIONS = [
  { label: 'Adventure', icon: '🔥', desc: 'Thrill rides, coasters & extreme excitement' },
  { label: 'Foodie', icon: '🍔', desc: 'Gourmet street food, burgers, desserts & shakes' },
  { label: 'Gaming', icon: '🎮', desc: 'VR arenas, arcades, high scores & multiplayer' },
  { label: 'Chill', icon: '😎', desc: 'Scenic observation wheel, lounges & relaxing' },
  { label: 'Music', icon: '🎵', desc: 'Live DJ sets, festivals & open mic stages' },
  { label: 'Photography', icon: '📸', desc: 'Aesthetic photo quests, neon lights & vistas' }
];

const COMPANION_OPTIONS = [
  { label: 'Alone', icon: '🚶', desc: 'Solo explorer mission' },
  { label: 'Friends', icon: '👫', desc: 'Casual hangout' },
  { label: 'Family', icon: '👨‍👩‍👧', desc: 'All ages fun' },
  { label: 'Squad', icon: '👥', desc: 'Full squad team gaming & voting' }
];

const FunPlannerPage = () => {
  const navigate = useNavigate();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState(180);
  const [selectedBudget, setSelectedBudget] = useState(500);
  const [selectedMood, setSelectedMood] = useState('Adventure');
  const [selectedParty, setSelectedParty] = useState('Friends');

  // AI Generation State
  const [generating, setGenerating] = useState(false);
  const [aiPlan, setAiPlan] = useState(null);
  const [bookingPass, setBookingPass] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setAiPlan(null);

    try {
      const res = await api.post('/planner/generate', {
        timeMinutes: selectedTime,
        budget: selectedBudget,
        mood: selectedMood,
        partyType: selectedParty
      });

      setAiPlan(res.data);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('[PLANNER ERROR]', err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleStartJourney = () => {
    // Navigate to Smart Map with active journey state
    navigate('/map', { state: { plannedItinerary: aiPlan?.itinerary || [] } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-yellow-500/20 text-yellow-300 text-xs font-black uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>AI-Powered Personal Fun Concierge</span>
        </div>
        <h1 className="font-gaming font-black text-3xl sm:text-5xl text-white mb-2">
          “What should I do next?”
        </h1>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Tell our AI your time, budget, and vibe. We'll instantly compute queue forecasts, kitchen throughput, and recommend the ultimate sequence!
        </p>
      </div>

      {/* STEP PROGRESS BAR */}
      {!aiPlan && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 mb-2">
            <span className={currentStep >= 1 ? 'text-pink-400' : ''}>1. Time</span>
            <span className={currentStep >= 2 ? 'text-pink-400' : ''}>2. Budget</span>
            <span className={currentStep >= 3 ? 'text-pink-400' : ''}>3. Mood</span>
            <span className={currentStep >= 4 ? 'text-pink-400' : ''}>4. Squad</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* WIZARD CARD */}
      {!aiPlan && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative">
          
          {/* STEP 1: TIME */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white font-gaming font-extrabold text-xl">
                <Clock className="w-5 h-5 text-yellow-400" />
                <h3>How much time do you have?</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TIME_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setSelectedTime(t.value)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedTime === t.value
                        ? 'bg-purple-600/30 border-purple-400 shadow-neon-purple scale-102'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-1">{t.icon}</div>
                    <div className="font-gaming font-extrabold text-white text-base">{t.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: BUDGET */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white font-gaming font-extrabold text-xl">
                <Wallet className="w-5 h-5 text-green-400" />
                <h3>What is your budget?</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUDGET_OPTIONS.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => setSelectedBudget(b.value)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedBudget === b.value
                        ? 'bg-pink-600/30 border-pink-400 shadow-neon-pink scale-102'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-1">{b.icon}</div>
                    <div className="font-gaming font-extrabold text-white text-base">{b.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: MOOD */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white font-gaming font-extrabold text-xl">
                <Smile className="w-5 h-5 text-pink-400" />
                <h3>What is your mood today?</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.label}
                    onClick={() => setSelectedMood(m.label)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedMood === m.label
                        ? 'bg-cyan-600/30 border-cyan-400 shadow-neon-cyan scale-102'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-1">{m.icon}</div>
                    <div className="font-gaming font-extrabold text-white text-base">{m.label}</div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: COMPANION */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white font-gaming font-extrabold text-xl">
                <Users className="w-5 h-5 text-purple-400" />
                <h3>Who are you with?</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                {COMPANION_OPTIONS.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setSelectedParty(c.label)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedParty === c.label
                        ? 'bg-purple-600/30 border-purple-400 shadow-neon-purple scale-102'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-1">{c.icon}</div>
                    <div className="font-gaming font-extrabold text-white text-base">{c.label}</div>
                    <p className="text-[11px] text-slate-400 mt-1">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div></div>}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 rounded-xl font-extrabold text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-pink flex items-center gap-1.5 hover:opacity-95 transition-all"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="px-8 py-3 rounded-xl font-gaming font-extrabold text-sm bg-gradient-to-r from-yellow-500 via-pink-600 to-purple-600 text-white shadow-neon-pink flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                {generating ? 'ANALYZING PARK CONDITIONS...' : 'GENERATE PERFECT PLAN'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* GENERATED ITINERARY VIEW */}
      {aiPlan && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Plan Header Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-yellow-500/40 bg-gradient-to-r from-purple-950/40 to-pink-950/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
              <div>
                <span className="text-[11px] font-black uppercase text-yellow-400 tracking-wider">
                  AI Personalized Recommendation
                </span>
                <h2 className="font-gaming font-black text-2xl sm:text-3xl text-white">
                  YOUR PERFECT FUN PLAN
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Matched for: <strong className="text-pink-400">{aiPlan.targetMood}</strong> • Party of: <strong className="text-cyan-400">{aiPlan.partyType}</strong>
                </p>
              </div>

              {/* Summary Stats */}
              <div className="flex gap-4">
                <div className="bg-white/5 p-3 rounded-xl text-center border border-white/5">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total Cost</div>
                  <div className="text-xl font-black text-yellow-400">₹{aiPlan.totalCost}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl text-center border border-white/5">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Duration</div>
                  <div className="text-xl font-black text-cyan-400">{aiPlan.formattedDuration}</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              💡 {aiPlan.summary}
            </p>
          </div>

          {/* Timeline Sequence */}
          <div className="space-y-4">
            {aiPlan.itinerary?.map((item, index) => (
              <div
                key={item.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-pink-500/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center font-gaming font-black text-white text-lg shrink-0 shadow-neon-purple">
                    {index + 1}
                  </div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 hidden sm:block"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-white/10 text-cyan-400">
                        {item.type}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.location?.zone || 'Central Park'}
                      </span>
                    </div>
                    <h3 className="font-gaming font-bold text-lg text-white">
                      {item.name}
                    </h3>
                    <div className="text-xs text-pink-400 font-semibold mt-0.5">
                      {item.highlight}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="text-right">
                    <div className="text-sm font-black text-yellow-400">
                      {item.price === 0 ? 'FREE' : `₹${item.price}`}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      ~{item.duration} mins
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleStartJourney}
              className="flex-1 py-4 rounded-2xl font-gaming font-extrabold text-base bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white shadow-neon-pink flex items-center justify-center gap-2 hover:scale-102 transition-all"
            >
              <Rocket className="w-5 h-5" />
              <span>START MY JOURNEY ON MAP</span>
            </button>
            <button
              onClick={() => { setAiPlan(null); setCurrentStep(1); }}
              className="py-4 px-6 rounded-2xl font-bold text-xs bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            >
              Customize Criteria
            </button>
          </div>
        </div>
      )}

      {/* QR Modal if needed */}
      {bookingPass && (
        <BookingPassModal booking={bookingPass} onClose={() => setBookingPass(null)} />
      )}
    </div>
  );
};

export default FunPlannerPage;
