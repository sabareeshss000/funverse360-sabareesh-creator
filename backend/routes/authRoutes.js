import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'funverse_secret_key_super_secure_360_gamified_2025', {
    expiresIn: '30d'
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age, interests } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      age: age || 20,
      interests: interests && interests.length > 0 ? interests : ['Adventure', 'Games', 'Food'],
      xp: 150,
      level: 1,
      streak: 1,
      walletBalance: 500
    });

    // Create linked wallet
    await Wallet.create({
      userId: user._id,
      totalBudget: 1000,
      balance: 500,
      totalSpent: 0,
      transactions: [
        {
          type: 'CREDIT',
          amount: 500,
          category: 'TOPUP',
          title: 'Welcome Gift',
          description: 'Initial student sign-up bonus credits!'
        }
      ]
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      walletBalance: user.walletBalance,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        walletBalance: user.walletBalance,
        interests: user.interests,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Instant Demo Login (for Hackathon Evaluation)
router.post('/demo-login', async (req, res) => {
  try {
    const { role = 'USER' } = req.body;
    const targetEmail = role === 'ADMIN' ? 'admin@funverse.com' : 'demo@funverse.com';
    
    let user = await User.findOne({ email: targetEmail });
    if (!user) {
      user = await User.findOne({ role: role === 'ADMIN' ? 'ADMIN' : 'USER' });
    }

    if (!user) {
      // Fallback create demo user on the fly if DB was empty
      user = await User.create({
        name: role === 'ADMIN' ? 'Command Admin' : 'Alex Rivers',
        email: targetEmail,
        password: 'password123',
        role: role === 'ADMIN' ? 'ADMIN' : 'USER',
        age: 21,
        xp: role === 'ADMIN' ? 5000 : 780,
        level: role === 'ADMIN' ? 10 : 3,
        streak: 5,
        walletBalance: 420,
        interests: ['Adventure', 'Games', 'Food']
      });

      await Wallet.create({
        userId: user._id,
        balance: 420,
        totalBudget: 1000,
        transactions: []
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      walletBalance: user.walletBalance,
      interests: user.interests,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Current User Profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Profile
router.put('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.interests = req.body.interests || user.interests;
      user.age = req.body.age || user.age;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
