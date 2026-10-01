import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Sparkles, Shield, Rocket, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      const data = await demoLogin(role);
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Demo login error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-purple-500/30 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-purple-600/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 mx-auto flex items-center justify-center text-2xl shadow-neon-pink mb-3">
            🎢
          </div>
          <h2 className="font-gaming font-extrabold text-2xl text-white">
            Welcome to FUNVERSE 360
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to unlock personalized rides, games, and squad challenges.
          </p>
        </div>

        {/* 1-Click Demo Buttons for Hackathon */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-6">
          <div className="text-[11px] font-bold text-center text-pink-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            Hackathon 1-Click Evaluation
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('USER')}
              disabled={loading}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm hover:scale-102 transition-transform flex items-center justify-center gap-1.5"
            >
              <Rocket className="w-3.5 h-3.5" />
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleDemo('ADMIN')}
              disabled={loading}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm hover:scale-102 transition-transform flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Demo Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@funverse.com"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-gaming font-extrabold text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-neon-pink transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'SIGNING IN...' : 'LOG IN'}</span>
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-400">
          New to Funverse 360?{' '}
          <Link to="/register" className="text-pink-400 font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
