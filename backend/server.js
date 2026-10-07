import express from 'express';
import http from 'http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import { seedDatabase } from './seed.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import plannerRoutes from './routes/plannerRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';

import { setSocketIO } from './services/notificationService.js';
import { pulseCrowdData, getLiveCrowdData } from './services/crowdPredictionService.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const frontendDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../frontend/dist');

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
setSocketIO(io);

// Middleware
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'FUNVERSE 360',
    tagline: 'Play • Eat • Explore • Connect • Win',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);

if (process.env.NODE_ENV === 'production' || fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path === '/api' || req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'), (error) => {
      if (error) next(error);
    });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Socket.IO Real-time Connection
io.on('connection', (socket) => {
  console.log(`[SOCKET] ⚡ Client connected: ${socket.id}`);
  
  // Immediately send current crowd pulse
  socket.emit('crowd:pulse', getLiveCrowdData());

  socket.on('disconnect', () => {
    console.log(`[SOCKET] Client disconnected: ${socket.id}`);
  });
});

// Real-time Crowd Simulation Pulse broadcast every 10 seconds
setInterval(() => {
  const currentCrowd = pulseCrowdData();
  io.emit('crowd:pulse', currentCrowd);
}, 10000);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is freshly initialized or empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[SERVER] 📦 Empty database detected. Auto-seeding initial demo data...');
      await seedDatabase();
    } else {
      console.log(`[SERVER] 📊 Database ready with ${userCount} registered users.`);
    }

    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 FUNVERSE 360 Backend running on port: ${PORT}`);
      console.log(`📡 REST API Base: http://localhost:${PORT}/api`);
      console.log(`⚡ WebSocket Server: Ready for real-time crowd sync`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('[FATAL ERROR]', error);
    process.exit(1);
  }
};

startServer();
