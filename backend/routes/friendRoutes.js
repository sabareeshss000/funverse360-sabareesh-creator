import express from 'express';
import User from '../models/User.js';
import Friendship from '../models/Friendship.js';
import { protect } from '../middleware/auth.js';
import { sendNotification } from '../services/notificationService.js';

const router = express.Router();

// Mock squad voting state for demo
let activeSquadPoll = {
  question: 'WHAT SHOULD WE DO NEXT?',
  votes: {
    ride: 9,
    food: 4,
    game: 6,
    event: 2
  },
  userVoted: {}
};

// Search users
router.get('/search', protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).select('name avatar level xp interests');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List friends
router.get('/', protect, async (req, res) => {
  try {
    const friendships = await Friendship.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
      status: 'ACCEPTED'
    }).populate('senderId receiverId', 'name avatar level xp interests');

    const friends = friendships.map(f => {
      const isSender = f.senderId._id.toString() === req.user._id.toString();
      return isSender ? f.receiverId : f.senderId;
    });

    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send friend request
router.post('/request', protect, async (req, res) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) return res.status(400).json({ message: 'Receiver ID is required' });

    const existing = await Friendship.findOne({
      $or: [
        { senderId: req.user._id, receiverId },
        { senderId: receiverId, receiverId: req.user._id }
      ]
    });

    if (existing) {
      return res.status(400).json({ message: 'Friend request already exists or you are already friends' });
    }

    const friendship = await Friendship.create({
      senderId: req.user._id,
      receiverId,
      status: 'PENDING'
    });

    await sendNotification({
      userId: receiverId,
      title: '👥 New Friend Request!',
      message: `${req.user.name} sent you a squad invitation!`,
      type: 'FRIEND'
    });

    res.status(201).json({ message: 'Friend request sent', friendship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Squad Poll
router.get('/squad/poll', protect, (req, res) => {
  const total = Object.values(activeSquadPoll.votes).reduce((a, b) => a + b, 0) || 1;
  const percentages = {
    ride: Math.round((activeSquadPoll.votes.ride / total) * 100),
    food: Math.round((activeSquadPoll.votes.food / total) * 100),
    game: Math.round((activeSquadPoll.votes.game / total) * 100),
    event: Math.round((activeSquadPoll.votes.event / total) * 100)
  };

  res.json({
    question: activeSquadPoll.question,
    votes: activeSquadPoll.votes,
    percentages,
    totalVotes: total,
    userVote: activeSquadPoll.userVoted[req.user._id.toString()] || null,
    aiRecommendation: '🎢 Thrill Rides has highest squad consensus (45%)! Head to HyperCoaster.'
  });
});

// Cast Squad Vote
router.post('/squad/vote', protect, (req, res) => {
  const { option } = req.body;
  if (!['ride', 'food', 'game', 'event'].includes(option)) {
    return res.status(400).json({ message: 'Invalid vote option' });
  }

  const userId = req.user._id.toString();
  const previousVote = activeSquadPoll.userVoted[userId];
  if (previousVote && activeSquadPoll.votes[previousVote] > 0) {
    activeSquadPoll.votes[previousVote] -= 1;
  }

  activeSquadPoll.votes[option] += 1;
  activeSquadPoll.userVoted[userId] = option;

  const total = Object.values(activeSquadPoll.votes).reduce((a, b) => a + b, 0);
  const percentages = {
    ride: Math.round((activeSquadPoll.votes.ride / total) * 100),
    food: Math.round((activeSquadPoll.votes.food / total) * 100),
    game: Math.round((activeSquadPoll.votes.game / total) * 100),
    event: Math.round((activeSquadPoll.votes.event / total) * 100)
  };

  res.json({
    message: 'Vote registered!',
    percentages,
    userVote: option
  });
});

export default router;
