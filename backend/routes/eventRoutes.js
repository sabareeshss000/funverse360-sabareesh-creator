import express from 'express';
import QRCode from 'qrcode';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { sendNotification } from '../services/notificationService.js';

const router = express.Router();

// List events
router.get('/', async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };

    const events = await Event.find(query).sort({ date: 1, startTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// RSVP / Book Event Pass
router.post('/:id/rsvp', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.attendees >= event.capacity) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    const user = await User.findById(req.user._id);

    // Increment attendees
    event.attendees += 1;
    await event.save();

    // Reward XP
    user.xp += 100;
    if (user.xp >= user.level * 300) user.level += 1;
    await user.save();

    const passId = `EV-${Date.now().toString(36).toUpperCase()}`;
    const qrData = JSON.stringify({
      passId,
      type: 'EVENT_VIP_ENTRY',
      eventId: event._id,
      title: event.title,
      user: user.name
    });
    const qrCode = await QRCode.toDataURL(qrData);

    const booking = await Booking.create({
      userId: user._id,
      itemType: 'EVENT',
      itemId: event._id,
      itemName: event.title,
      date: event.date,
      time: event.startTime,
      quantity: 1,
      amount: event.price || 0,
      status: 'CONFIRMED',
      ticketPassId: passId,
      qrCode
    });

    await sendNotification({
      userId: user._id,
      title: '🎤 Event Pass Confirmed!',
      message: `You are booked for "${event.title}"! Show your QR pass at the entrance. +100 XP gained!`,
      type: 'EVENT'
    });

    res.status(201).json({
      booking,
      newXp: user.xp,
      newLevel: user.level
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin CRUD
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
