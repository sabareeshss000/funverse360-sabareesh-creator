import express from 'express';
import User from '../models/User.js';
import Ride from '../models/Ride.js';
import Food from '../models/Food.js';
import Game from '../models/Game.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import Order from '../models/Order.js';
import GamePlay from '../models/GamePlay.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { getLiveCrowdData, predictCrowdForecast, getZoneAlerts } from '../services/crowdPredictionService.js';
import { predictRideQueues } from '../services/queuePredictionService.js';
import { getFoodDemandPredictions } from '../services/foodDemandService.js';

const router = express.Router();

// Admin Analytics Summary
router.get('/analytics', protect, adminOnly, async (req, res) => {
  try {
    const [userCount, bookingCount, orderCount, gamePlayCount, rides, foods] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Order.countDocuments(),
      GamePlay.countDocuments(),
      Ride.find(),
      Food.find()
    ]);

    // Simulated baseline + real DB activity for realistic hackathon presentation
    const totalUsers = 4820 + userCount;
    const totalBookings = 1240 + bookingCount;
    const totalOrders = 2850 + orderCount;
    const totalGamePlays = 920 + gamePlayCount;
    const totalRevenue = 482500 + (totalBookings * 120) + (totalOrders * 150);

    const liveCrowd = getLiveCrowdData();
    const crowdForecast = predictCrowdForecast();
    const zoneAlerts = getZoneAlerts();

    // Attendance & Revenue time chart series
    const hourlyAnalytics = [
      { hour: '10 AM', visitors: 1200, revenue: 45000, ridesWait: 15 },
      { hour: '12 PM', visitors: 2800, revenue: 110000, ridesWait: 28 },
      { hour: '02 PM', visitors: 3900, revenue: 190000, ridesWait: 35 },
      { hour: '04 PM', visitors: 4600, revenue: 295000, ridesWait: 42 },
      { hour: '06 PM', visitors: 4820, revenue: 380000, ridesWait: 45 },
      { hour: '08 PM (Proj)', visitors: 4200, revenue: 482500, ridesWait: 30 }
    ];

    res.json({
      metrics: {
        totalUsers,
        totalBookings,
        totalOrders,
        totalGamePlays,
        totalRevenue
      },
      liveCrowd,
      crowdForecast,
      zoneAlerts,
      hourlyAnalytics
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin AI Insights
router.get('/ai-insights', protect, adminOnly, async (req, res) => {
  try {
    const queuePredictions = await predictRideQueues();
    const foodDemand = getFoodDemandPredictions();
    const liveCrowd = getLiveCrowdData();

    const criticalInsights = [
      {
        id: 'INS-1',
        type: 'WARNING',
        badge: 'CROWD SURGE',
        title: 'Food Court Congestion Surge',
        description: 'Food Court occupancy is currently at ' + liveCrowd.food.percentage + '%. Congestion is expected to increase by 25% in the next 30 minutes.',
        action: 'Consider opening Counter 4 & deploying mobile pickup marshals.'
      },
      {
        id: 'INS-2',
        type: 'TREND',
        badge: 'DEMAND FORECAST',
        title: 'Pizza Demand Peak Alert',
        description: 'Pizza demand is projected to remain HIGH between 6:00 PM – 8:30 PM across all dining kiosks.',
        action: 'Notify kitchen supervisors to pre-bake high velocity margherita bases.'
      },
      {
        id: 'INS-3',
        type: 'ALERT',
        badge: 'QUEUE BOTTLENECK',
        title: 'Roller Coaster Queue Spike',
        description: 'Roller Coaster queue currently 28 min, projected to reach 45+ minutes as visitors exit afternoon parade.',
        action: 'Activate Express Queue diversion & announce VR Zone open availability.'
      },
      {
        id: 'INS-4',
        type: 'OPPORTUNITY',
        badge: 'RESOURCE BALANCING',
        title: 'Arcade Zone Underutilized',
        description: 'Arcade & VR Galaxy is running at only 34% capacity. Great candidate for student quest incentives.',
        action: 'Trigger flash +50 XP bonus push notification for Arcade games.'
      }
    ];

    res.json({
      criticalInsights,
      queuePredictions,
      foodDemand,
      liveCrowd
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: User list & management
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    }
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Toggle user status (Block/Unblock)
router.put('/users/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    await user.save();
    res.json({ message: `User status changed to ${user.status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
