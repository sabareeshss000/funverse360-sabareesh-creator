import express from 'express';
import QRCode from 'qrcode';
import Ride from '../models/Ride.js';
import Booking from '../models/Booking.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { sendNotification } from '../services/notificationService.js';

const router = express.Router();

// List all rides with filters
router.get('/', async (req, res) => {
  try {
    const { adventureLevel, maxPrice, maxWait, status, search } = req.query;
    const query = {};

    if (adventureLevel) query.adventureLevel = adventureLevel;
    if (status) query.status = status;
    if (maxPrice) query.price = { $lte: Number(maxPrice) };
    if (maxWait) query.estimatedWait = { $lte: Number(maxWait) };
    if (search) query.name = { $regex: search, $options: 'i' };

    const rides = await Ride.find(query).sort({ popularity: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Single ride detail
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    const similarRides = await Ride.find({
      _id: { $ne: ride._id },
      adventureLevel: ride.adventureLevel
    }).limit(3);

    res.json({ ride, similarRides });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book a ride
router.post('/:id/book', protect, async (req, res) => {
  try {
    const { quantity = 1, timeSlot = 'Next Available' } = req.body;
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    const totalAmount = ride.price * Number(quantity);

    // Check user wallet
    const user = await User.findById(req.user._id);
    if (user.walletBalance < totalAmount) {
      return res.status(400).json({ message: `Insufficient wallet balance. Required: ₹${totalAmount}, Available: ₹${user.walletBalance}` });
    }

    // Deduct wallet balance
    user.walletBalance -= totalAmount;
    user.xp += 60 * Number(quantity);
    if (user.xp >= user.level * 300) {
      user.level += 1;
    }
    await user.save();

    // Log wallet transaction
    await Wallet.findOneAndUpdate(
      { userId: user._id },
      {
        $inc: { balance: -totalAmount, totalSpent: totalAmount },
        $push: {
          transactions: {
            type: 'DEBIT',
            amount: totalAmount,
            category: 'RIDE',
            title: `Ride Pass: ${ride.name}`,
            description: `${quantity}x Ticket(s) • Slot: ${timeSlot}`
          }
        }
      },
      { upsert: true }
    );

    const ticketPassId = `TK-RIDE-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const qrDataPayload = JSON.stringify({
      passId: ticketPassId,
      userId: user._id,
      rideId: ride._id,
      rideName: ride.name,
      quantity,
      validUntil: 'Today 22:00'
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrDataPayload);

    const booking = await Booking.create({
      userId: user._id,
      itemType: 'RIDE',
      itemId: ride._id,
      itemName: ride.name,
      date: new Date().toISOString().split('T')[0],
      time: timeSlot,
      quantity,
      amount: totalAmount,
      status: 'CONFIRMED',
      ticketPassId,
      qrCode: qrCodeDataUrl
    });

    // Send in-app notification
    await sendNotification({
      userId: user._id,
      title: '🎢 Ride Ticket Confirmed!',
      message: `Your pass for ${ride.name} (${quantity} tickets) is confirmed! QR code generated. +${60 * quantity} XP earned!`,
      type: 'BOOKING'
    });

    res.status(201).json({
      booking,
      newWalletBalance: user.walletBalance,
      newXp: user.xp,
      newLevel: user.level
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create ride
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const ride = await Ride.create(req.body);
    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update ride (status, queue time, etc.)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete ride
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Ride.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ride deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
