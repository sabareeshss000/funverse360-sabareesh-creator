import express from 'express';
import Food from '../models/Food.js';
import Order from '../models/Order.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { sendNotification } from '../services/notificationService.js';

const router = express.Router();

// List food items with filters
router.get('/', async (req, res) => {
  try {
    const { category, under100, fastest, search } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (under100 === 'true') query.price = { $lte: 100 };
    if (search) query.name = { $regex: search, $options: 'i' };

    let sortOption = { popular: -1, rating: -1 };
    if (fastest === 'true') sortOption = { preparationTime: 1 };

    const foodItems = await Food.find(query).sort(sortOption);
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Single food item
router.get('/:id', async (req, res) => {
  try {
    const item = await Food.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Food item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User Checkout: Place food order
router.post('/order', protect, async (req, res) => {
  try {
    const { items, pickupCounter = 'Counter 2 (Galaxy Diner)' } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalAmount = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    const user = await User.findById(req.user._id);
    if (user.walletBalance < totalAmount) {
      return res.status(400).json({ message: `Insufficient wallet balance. Total: ₹${totalAmount}, Balance: ₹${user.walletBalance}` });
    }

    // Deduct user wallet
    user.walletBalance -= totalAmount;
    user.xp += Math.round(totalAmount * 0.2); // 20% of bill as XP!
    if (user.xp >= user.level * 300) user.level += 1;
    await user.save();

    const orderNumber = `FD-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await Order.create({
      userId: user._id,
      orderNumber,
      items: items.map(i => ({
        foodId: i._id || i.foodId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image
      })),
      totalAmount,
      status: 'RECEIVED',
      pickupCounter,
      estimatedMinutes: 12
    });

    // Record transaction
    await Wallet.findOneAndUpdate(
      { userId: user._id },
      {
        $inc: { balance: -totalAmount, totalSpent: totalAmount },
        $push: {
          transactions: {
            type: 'DEBIT',
            amount: totalAmount,
            category: 'FOOD',
            title: `Food Court Order #${orderNumber}`,
            description: `${items.length} item(s) • Pick up at ${pickupCounter}`
          }
        }
      },
      { upsert: true }
    );

    // Notification
    await sendNotification({
      userId: user._id,
      title: '🍔 Food Order Placed!',
      message: `Order #${orderNumber} received. Est. pickup time: 12 mins at ${pickupCounter}. Earned +${Math.round(totalAmount * 0.2)} XP!`,
      type: 'ORDER'
    });

    res.status(201).json({
      order,
      newWalletBalance: user.walletBalance,
      newXp: user.xp,
      newLevel: user.level
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User orders
router.get('/orders/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: All orders
router.get('/admin/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update order status
router.put('/orders/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (order) {
      await sendNotification({
        userId: order.userId,
        title: `🍔 Order Update: #${order.orderNumber}`,
        message: `Your food order is now ${status}! Head to ${order.pickupCounter}.`,
        type: 'ORDER'
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create food item
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update food
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete food
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
