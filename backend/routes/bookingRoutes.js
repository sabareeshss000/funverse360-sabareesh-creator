import express from 'express';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// List user bookings
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Single booking pass
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel booking & refund
router.post('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'CANCELLED') return res.status(400).json({ message: 'Booking already cancelled' });

    booking.status = 'CANCELLED';
    await booking.save();

    // Refund wallet
    if (booking.amount > 0) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { walletBalance: booking.amount } });
      await Wallet.findOneAndUpdate(
        { userId: req.user._id },
        {
          $inc: { balance: booking.amount, totalSpent: -booking.amount },
          $push: {
            transactions: {
              type: 'CREDIT',
              amount: booking.amount,
              category: 'RIDE',
              title: `Refund: ${booking.itemName}`,
              description: `Cancelled booking #${booking.ticketPassId}`
            }
          }
        }
      );
    }

    res.json({ message: 'Booking cancelled and refunded', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
