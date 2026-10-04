import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import BottomNavigation from './components/BottomNavigation';
import ChatbotWidget from './components/ChatbotWidget';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FunPlannerPage from './pages/FunPlannerPage';
import RidesPage from './pages/RidesPage';
import FoodPage from './pages/FoodPage';
import GamesPage from './pages/GamesPage';
import EventsPage from './pages/EventsPage';
import SmartMapPage from './pages/SmartMapPage';
import ChallengesPage from './pages/ChallengesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SquadPage from './pages/SquadPage';
import WalletPage from './pages/WalletPage';
import BookingsPage from './pages/BookingsPage';
import RewardsPage from './pages/RewardsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400">
        Loading Funverse Universe...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B1026] text-slate-100">
      <Navbar />
      <main className="flex-1 pb-20 xl:pb-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/planner" element={<FunPlannerPage />} />
          <Route path="/rides" element={<RidesPage />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/map" element={<SmartMapPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/squad" element={<SquadPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNavigation />
      <ChatbotWidget />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
