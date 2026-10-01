import express from 'express';
import User from '../models/User.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get Leaderboards (Global, Campus, Friends)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { type = 'global', period = 'all' } = req.query;

    // Fetch users sorted by XP
    const users = await User.find({ status: 'ACTIVE' })
      .select('name avatar xp level streak badges')
      .sort({ xp: -1 })
      .limit(50);

    const currentUserId = req.user ? req.user._id.toString() : null;

    // Add rankings and medals
    const leaderboard = users.map((u, index) => {
      const rank = index + 1;
      let badgeIcon = '';
      if (rank === 1) badgeIcon = '🥇';
      else if (rank === 2) badgeIcon = '🥈';
      else if (rank === 3) badgeIcon = '🥉';

      return {
        rank,
        badgeIcon,
        _id: u._id,
        name: u.name,
        avatar: u.avatar,
        xp: u.xp,
        level: u.level,
        streak: u.streak,
        isCurrentUser: currentUserId === u._id.toString()
      };
    });

    // Find current user's exact ranking
    let currentUserRank = null;
    if (currentUserId) {
      currentUserRank = leaderboard.find(l => l.isCurrentUser);
    }

    res.json({
      type,
      period,
      leaderboard,
      currentUserRank
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
