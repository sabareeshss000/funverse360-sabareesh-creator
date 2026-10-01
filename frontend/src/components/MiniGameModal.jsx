import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Trophy, Zap, Play, RotateCcw, Flame, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MiniGameModal = ({ game, onClose, onGamePlayed }) => {
  const { user, updateWalletAndXp } = useAuth();

  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [targetIndex, setTargetIndex] = useState(4);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  // Active game mode: reflex tap by default, or memory
  const isMemoryGame = game.category === 'Puzzle';

  // Timer loop
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Target relocation for Reflex Tap
  useEffect(() => {
    let targetTimer;
    if (isPlaying && !isMemoryGame) {
      targetTimer = setInterval(() => {
        setTargetIndex(Math.floor(Math.random() * 9));
      }, 850);
    }
    return () => clearInterval(targetTimer);
  }, [isPlaying, isMemoryGame]);

  const startGame = () => {
    setScore(0);
    setHits(0);
    setMisses(0);
    setTimeLeft(15);
    setGameOver(false);
    setGameResult(null);
    setIsPlaying(true);
    setTargetIndex(Math.floor(Math.random() * 9));
  };

  const handleTileClick = (index) => {
    if (!isPlaying) return;

    if (index === targetIndex) {
      const bonus = 100 + hits * 10;
      setScore((prev) => prev + bonus);
      setHits((prev) => prev + 1);
      setTargetIndex(Math.floor(Math.random() * 9));
    } else {
      setMisses((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - 25));
    }
  };

  const endGame = async () => {
    setIsPlaying(false);
    setGameOver(true);
    setSubmitting(true);

    try {
      const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 100;
      
      // Save game session directly to MongoDB
      const res = await api.post(`/games/${game._id}/play`, {
        score,
        accuracy,
        durationSeconds: 15
      });

      setGameResult(res.data);
      updateWalletAndXp(undefined, res.data.newTotalXp, res.data.newLevel);

      // Trigger Confetti Celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onGamePlayed) onGamePlayed(res.data);
    } catch (err) {
      console.error('[GAME ERROR]', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel bg-[#131838]/95 border border-purple-500/40 rounded-3xl p-6 shadow-2xl overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-pink-600/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-gaming font-extrabold text-xl text-white">
                {game.name}
              </h3>
              <p className="text-xs text-cyan-400 font-medium">
                {game.category} • Record: {game.highScore} pts ({game.topPlayer})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Game Status Bar */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white/5 rounded-2xl p-2.5 text-center border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Score</span>
            <div className="font-gaming font-black text-2xl text-yellow-400">
              {score}
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-2.5 text-center border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Time Left</span>
            <div className={`font-gaming font-black text-2xl ${timeLeft <= 5 ? 'text-red-400 animate-ping' : 'text-cyan-400'}`}>
              {timeLeft}s
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-2.5 text-center border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Streak</span>
            <div className="font-gaming font-black text-2xl text-pink-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              {hits}
            </div>
          </div>
        </div>

        {/* Playing Field: Cyber Reflex Matrix */}
        {!gameOver && (
          <div className="relative aspect-square max-w-[320px] mx-auto bg-black/40 border border-purple-500/30 rounded-2xl p-3 grid grid-cols-3 gap-3 mb-6">
            {!isPlaying ? (
              <div className="col-span-3 flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-3xl mb-3 shadow-neon-pink">
                  🎮
                </div>
                <h4 className="font-bold text-white mb-1">Cyber Reflex Challenge</h4>
                <p className="text-xs text-slate-400 mb-4 max-w-[240px]">
                  Tap the glowing neon energy nodes as quickly as possible. Higher streaks award massive bonus XP stored in database!
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white shadow-neon-pink hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  START GAME
                </button>
              </div>
            ) : (
              [0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                const isTarget = index === targetIndex;
                return (
                  <button
                    key={index}
                    onClick={() => handleTileClick(index)}
                    className={`rounded-2xl transition-all duration-150 flex items-center justify-center text-2xl font-black ${
                      isTarget
                        ? 'bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-400 text-white shadow-neon-pink scale-95 border-2 border-white animate-bounce'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95'
                    }`}
                  >
                    {isTarget ? '⚡' : ''}
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Game Over Screen with Live DB Results */}
        {gameOver && (
          <div className="bg-black/40 border border-purple-500/40 rounded-2xl p-5 text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-yellow-500/20 text-yellow-400 mb-2">
              <Trophy className="w-8 h-8" />
            </div>
            <h4 className="font-gaming font-extrabold text-2xl text-white mb-1">
              GAME COMPLETED!
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              Your session has been recorded into the Funverse MongoDB database.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4 text-left">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Final Score</span>
                <div className="text-xl font-black text-yellow-400">{score} pts</div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">XP Awarded</span>
                <div className="text-xl font-black text-green-400">
                  +{gameResult?.xpEarned || 80} XP
                </div>
              </div>
            </div>

            {gameResult?.isNewHighScore && (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-pink-600/30 to-purple-600/30 border border-pink-500/50 text-pink-300 text-xs font-bold mb-4 flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                🎉 NEW ALL-TIME HIGH SCORE FOR THIS GAME!
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl font-extrabold text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-pink hover:opacity-95 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            Scores immediately reflect on Global & Campus Leaderboards
          </span>
        </div>
      </div>
    </div>
  );
};

export default MiniGameModal;
