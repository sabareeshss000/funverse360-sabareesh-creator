import express from 'express';
import Challenge from '../models/Challenge.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { protect, optionalAuth, adminOnly } from '../middleware/auth.js';
import { sendNotification } from '../services/notificationService.js';

const router = express.Router();

// List challenges with user's progress
router.get('/', optionalAuth, async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ type: 1, xpReward: -1 });

    if (!req.user) {
      return res.json(challenges.map(c => ({ ...c.toObject(), completed: false, progressCount: 0 })));
    }

    const progresses = await Progress.find({ userId: req.user._id });
    const progressMap = new Map();
    progresses.forEach(p => progressMap.set(p.challengeId.toString(), p));

    const result = challenges.map(c => {
      const prog = progressMap.get(c._id.toString());
      return {
        ...c.toObject(),
        completed: prog ? prog.completed : false,
        progressCount: prog ? prog.progressCount : 0
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Complete or claim a challenge
router.post('/:id/complete', protect, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    let progress = await Progress.findOne({ userId: req.user._id, challengeId: challenge._id });
    if (progress && progress.completed) {
      return res.status(400).json({ message: 'Challenge already completed and claimed' });
    }

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        challengeId: challenge._id
      });
    }

    progress.completed = true;
    progress.progressCount = challenge.requirementCount;
    progress.xpEarned = challenge.xpReward;
    progress.completedAt = new Date();
    await progress.save();

    // Award XP to user
    const user = await User.findById(req.user._id);
    user.xp += challenge.xpReward;
    user.streak += 1;
    const oldLevel = user.level;
    if (user.xp >= user.level * 300) user.level += 1;
    await user.save();

    await sendNotification({
      userId: user._id,
      title: '🎯 Challenge Completed!',
      message: `You completed "${challenge.title}" and earned +${challenge.xpReward} XP! Streak is now ${user.streak} days! 🔥`,
      type: 'CHALLENGE'
    });

    res.json({
      message: 'Challenge completed successfully!',
      progress,
      xpAwarded: challenge.xpReward,
      newTotalXp: user.xp,
      newLevel: user.level,
      newStreak: user.streak,
      leveledUp: user.level > oldLevel
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: CRUD
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Challenge.findByIdAndDelete(req.params.id);
    res.json({ message: 'Challenge deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
