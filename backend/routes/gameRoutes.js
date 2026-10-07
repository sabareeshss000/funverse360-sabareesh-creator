import express from 'express';
import Game from '../models/Game.js';
import GamePlay from '../models/GamePlay.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { sendNotification } from '../services/notificationService.js';

const router = express.Router();

// List all games
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const games = await Game.find(query).sort({ rating: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Single game detail
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record a Game Play Session (Score, XP, DB Persistence)
router.post('/:id/play', protect, async (req, res) => {
  try {
    const { score = 0, accuracy = 100, durationSeconds = 30 } = req.body;
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });

    const user = await User.findById(req.user._id);

    // Calculate XP earned from gameplay
    const baseReward = game.xpReward || 50;
    const scoreBonus = Math.floor(Number(score) / 100);
    const xpEarned = Math.min(300, baseReward + scoreBonus);

    // Persist GamePlay log to MongoDB
    const playSession = await GamePlay.create({
      userId: user._id,
      gameId: game._id,
      gameTitle: game.name,
      gameType: game.category,
      score: Number(score),
      xpEarned,
      accuracy: Number(accuracy),
      durationSeconds: Number(durationSeconds)
    });

    // Check if new High Score
    let isNewHighScore = false;
    if (Number(score) > (game.highScore || 0)) {
      game.highScore = Number(score);
      game.topPlayer = user.name;
      await game.save();
      isNewHighScore = true;
    }

    // Award XP to user
    user.xp += xpEarned;
    const oldLevel = user.level;
    if (user.xp >= user.level * 300) {
      user.level += 1;
    }
    await user.save();

    // Send notification
    await sendNotification({
      userId: user._id,
      title: isNewHighScore ? '🏆 NEW RECORD HIGH SCORE!' : '🎮 Arcade Score Saved!',
      message: `You scored ${score} in ${game.name}! Earned +${xpEarned} XP.${user.level > oldLevel ? ` 🎉 LEVEL UP TO LEVEL ${user.level}!` : ''}`,
      type: 'CHALLENGE'
    });

    res.status(201).json({
      playSession,
      xpEarned,
      newTotalXp: user.xp,
      newLevel: user.level,
      isNewHighScore,
      currentHighScore: game.highScore,
      topPlayer: game.topPlayer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User's game history
router.get('/user/history', protect, async (req, res) => {
  try {
    const history = await GamePlay.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Game Leaderboard
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const topPlays = await GamePlay.find({ gameId: req.params.id })
      .populate('userId', 'name avatar level')
      .sort({ score: -1 })
      .limit(10);
    res.json(topPlays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Game CRUD
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: 'Game removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
