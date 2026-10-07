import express from 'express';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user's wallet
router.get('/', protect, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({
        userId: req.user._id,
        totalBudget: 1000,
        balance: 500,
        totalSpent: 0,
        transactions: []
      });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Top-up wallet (Demo funds)
router.post('/topup', protect, async (req, res) => {
  try {
    const { amount = 200 } = req.body;
    const addAmt = Number(amount);

    const user = await User.findById(req.user._id);
    user.walletBalance += addAmt;
    await user.save();

    const wallet = await Wallet.findOneAndUpdate(
      { userId: req.user._id },
      {
        $inc: { balance: addAmt },
        $push: {
          transactions: {
            type: 'CREDIT',
            amount: addAmt,
            category: 'TOPUP',
            title: 'Wallet Top-Up',
            description: 'Demo balance recharge'
          }
        }
      },
      { new: true, upsert: true }
    );

    res.json({
      message: `Successfully added ₹${addAmt} to your wallet!`,
      wallet,
      newBalance: user.walletBalance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Budget Limit
router.post('/budget', protect, async (req, res) => {
  try {
    const { budget } = req.body;
    const wallet = await Wallet.findOneAndUpdate(
      { userId: req.user._id },
      { totalBudget: Number(budget) },
      { new: true, upsert: true }
    );

    res.json({ message: 'Budget limit updated', wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
