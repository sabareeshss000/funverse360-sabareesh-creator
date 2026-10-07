import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import {
  Users,
  Ticket,
  ShoppingBag,
  Gamepad2,
  DollarSign,
  Activity,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Search,
  Shield,
  Layers,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const AdminDashboard = () => {
  const { liveCrowd } = useSocket();
  const [activeTab, setActiveTab] = useState('analytics');

  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [ridesList, setRidesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search filter for users
  const [userSearch, setUserSearch] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, insightsRes, usersRes, ordersRes, ridesRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/ai-insights'),
        api.get('/admin/users'),
        api.get('/food/admin/orders'),
        api.get('/rides')
      ]);

      setAnalytics(analyticsRes.data);
      setInsights(insightsRes.data);
      setUsersList(usersRes.data);
      setOrdersList(ordersRes.data);
      setRidesList(ridesRes.data);
    } catch (err) {
      console.error('[ADMIN FETCH ERROR]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/status`);
      fetchAdminData();
    } catch (err) {
      alert('Error updating user');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/food/orders/${orderId}/status`, { status: newStatus });
      fetchAdminData();
    } catch (err) {
      alert('Error updating order');
    }
  };

  const handleUpdateRideQueue = async (rideId, currentQueue, estimatedWait) => {
    try {
      await api.put(`/rides/${rideId}`, { currentQueue, estimatedWait });
      fetchAdminData();
    } catch (err) {
      alert('Error updating ride queue');
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Mission Control & Analytics</span>
          </div>
          <h1 className="font-gaming font-black text-3xl sm:text-4xl text-white">
            Park Administrator Command Center
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time telemetry, AI crowd forecasts, revenue graphs, and attraction dispatch.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-neon-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Analytics
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'insights'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-pink'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🤖 AI Insights
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'management'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚙️ Operations
          </button>
        </div>
      </div>

      {/* 1. TOP METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
            <span>Total Users</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-gaming font-black text-2xl text-white">
            {analytics?.metrics?.totalUsers?.toLocaleString() || '4,820'}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
            <span>Ride Bookings</span>
            <Ticket className="w-4 h-4 text-pink-400" />
          </div>
          <div className="font-gaming font-black text-2xl text-pink-400">
            {analytics?.metrics?.totalBookings?.toLocaleString() || '1,240'}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
            <span>Food Orders</span>
            <ShoppingBag className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="font-gaming font-black text-2xl text-yellow-400">
            {analytics?.metrics?.totalOrders?.toLocaleString() || '2,850'}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
            <span>Game Plays</span>
            <Gamepad2 className="w-4 h-4 text-green-400" />
          </div>
          <div className="font-gaming font-black text-2xl text-green-400">
            {analytics?.metrics?.totalGamePlays?.toLocaleString() || '920'}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
            <span>Park Revenue</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-gaming font-black text-2xl text-cyan-400">
            ₹{analytics?.metrics?.totalRevenue?.toLocaleString() || '4,82,500'}
          </div>
        </div>
      </div>

      {/* TAB 1: ANALYTICS & CHARTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Live Crowd Gauges */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-pink-400 animate-pulse" />
                <h3 className="font-gaming font-bold text-lg text-white">
                  Live Crowd Saturation Gauges
                </h3>
              </div>
              <span className="text-xs text-green-400 font-bold">
                ⚡ Real-time Socket.IO Stream
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-black/40 p-4 rounded-2xl border border-red-500/30">
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>🎢 Thrill Rides Zone</span>
                  <span className="text-red-400 font-black">🔴 {liveCrowd.rides.percentage}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${liveCrowd.rides.percentage}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 block mt-2">Congestion: Extreme. FastTrack recommended.</span>
              </div>

              <div className="bg-black/40 p-4 rounded-2xl border border-red-500/30">
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>🍔 Food Court & Dining</span>
                  <span className="text-red-400 font-black">🔴 {liveCrowd.food.percentage}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${liveCrowd.food.percentage}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 block mt-2">Surge active. Mobile pickup open.</span>
              </div>

              <div className="bg-black/40 p-4 rounded-2xl border border-green-500/30">
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>🎮 Arcade & VR Galaxy</span>
                  <span className="text-green-400 font-black">🟢 {liveCrowd.games.percentage}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: `${liveCrowd.games.percentage}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 block mt-2">Open availability. Low wait times.</span>
              </div>

              <div className="bg-black/40 p-4 rounded-2xl border border-yellow-500/30">
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>🎤 Starlight Main Arena</span>
                  <span className="text-yellow-400 font-black">🟡 {liveCrowd.stage.percentage}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${liveCrowd.stage.percentage}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 block mt-2">Concert attendees gathering.</span>
              </div>
            </div>
          </div>

          {/* Recharts Area Curve: Hourly Visitors & Revenue */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/10">
              <h3 className="font-gaming font-bold text-base text-white mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Hourly Attendance Flow (Visitors)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.hourlyAnalytics || []}>
                    <defs>
                      <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#131838', borderColor: '#ffffff20', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="visitors" stroke="#06B6D4" fillOpacity={1} fill="url(#visitorGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/10">
              <h3 className="font-gaming font-bold text-base text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-pink-400" />
                Cumulative Revenue Velocity (₹)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.hourlyAnalytics || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#131838', borderColor: '#ffffff20', borderRadius: '12px' }} />
                    <Bar dataKey="revenue" fill="#EC4899" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI OPERATIONAL INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights?.criticalInsights?.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-6 rounded-3xl border border-purple-500/30 flex flex-col justify-between hover:border-pink-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-purple-600/30 text-pink-300 border border-purple-500/40">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="font-gaming font-bold text-lg text-white mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-start gap-2 text-xs">
                  <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span className="text-yellow-300 font-semibold">
                    Action: {item.action}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Queue Predictions Table */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-gaming font-bold text-lg text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              Ride Queue Throughput & 30-Minute Predictions
            </h3>

            <div className="divide-y divide-white/5">
              {insights?.queuePredictions?.map((qp) => (
                <div key={qp.rideId} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-sm text-white">{qp.rideName}</h5>
                    <div className="text-xs text-pink-400 mt-0.5">{qp.advice}</div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Current</div>
                      <div className="font-gaming font-black text-sm text-white">{qp.currentWaitMinutes} min</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">In 30 Mins</div>
                      <div className="font-gaming font-black text-sm text-yellow-400">{qp.predictedWaitMinutes30m} min</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PARK MANAGEMENT & OPERATIONS */}
      {activeTab === 'management' && (
        <div className="space-y-6">
          
          {/* User Directory */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-gaming font-bold text-lg text-white">
                Student & User Directory ({filteredUsers.length})
              </h3>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none w-52"
                />
              </div>
            </div>

            <div className="divide-y divide-white/5 max-h-72 overflow-y-auto pr-1">
              {filteredUsers.map((u) => (
                <div key={u._id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt="" className="w-8 h-8 rounded-lg bg-white/5" />
                    <div>
                      <div className="font-bold text-xs text-white">{u.name} ({u.role})</div>
                      <div className="text-[11px] text-slate-400">{u.email} • Level {u.level}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleUserStatus(u._id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      u.status === 'BLOCKED'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {u.status === 'BLOCKED' ? 'Blocked' : 'Active'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Ride Queue Control */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-gaming font-bold text-lg text-white">
              Live Ride Status & Queue Adjuster
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ridesList.map((r) => (
                <div key={r._id} className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="font-bold text-sm text-white">{r.name}</div>
                  <div className="text-xs text-slate-400">Current Queue: {r.currentQueue} ppl • {r.estimatedWait}m wait</div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleUpdateRideQueue(r._id, r.currentQueue + 5, r.estimatedWait + 5)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/15 text-white"
                    >
                      +5m Queue
                    </button>
                    <button
                      onClick={() => handleUpdateRideQueue(r._id, Math.max(0, r.currentQueue - 5), Math.max(0, r.estimatedWait - 5))}
                      className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/15 text-white"
                    >
                      -5m Queue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
