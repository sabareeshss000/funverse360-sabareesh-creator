import express from 'express';
import Reward from '../models/Reward.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import { sendNotification } from '../services/notificationService.js';

const router = express.Router();

// List all rewards
router.get('/', optionalAuth, async (req, res) => {
  try {
    const rewards = await Reward.find().sort({ xpRequired: 1 });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Claim Reward
router.post('/:id/claim', protect, async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) return res.status(404).json({ message: 'Reward not found' });

    const user = await User.findById(req.user._id);
    if (user.xp < reward.xpRequired) {
      return res.status(400).json({
        message: `Need ${reward.xpRequired} XP to unlock this perk. You have ${user.xp} XP.`
      });
    }

    reward.claimedCount += 1;
    await reward.save();

    // If it gives wallet cash:
    if (reward.type === 'WALLET_CASH') {
      const cashAmount = parseInt(reward.value.replace(/[^0-9]/g, '')) || 50;
      user.walletBalance += cashAmount;
      await user.save();

      await Wallet.findOneAndUpdate(
        { userId: user._id },
        {
          $inc: { balance: cashAmount },
          $push: {
            transactions: {
              type: 'CREDIT',
              amount: cashAmount,
              category: 'REWARD',
              title: `Reward Unlocked: ${reward.name}`,
              description: `Voucher Code: ${reward.code}`
            }
          }
        }
      );
    }

    await sendNotification({
      userId: user._id,
      title: '🎁 Reward Claimed!',
      message: `You claimed "${reward.name}"! Coupon: ${reward.code}`,
      type: 'REWARD'
    });

    res.json({
      message: 'Reward claimed successfully!',
      reward,
      couponCode: reward.code,
      newWalletBalance: user.walletBalance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin create reward
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const reward = await Reward.create(req.body);
    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
