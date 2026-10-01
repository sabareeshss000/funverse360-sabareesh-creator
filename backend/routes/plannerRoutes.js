import express from 'express';
import { generatePlan, getTopRecommendations } from '../services/recommendationService.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Generate Personalized AI Itinerary: "What should I do next?"
router.post('/generate', optionalAuth, async (req, res) => {
  try {
    const { timeMinutes, budget, mood, partyType } = req.body;

    const plan = await generatePlan({
      timeMinutes: timeMinutes || 180,
      budget: budget || 500,
      mood: mood || 'Adventure',
      partyType: partyType || 'Friends'
    });

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Trending recommendations
router.get('/trending', async (req, res) => {
  try {
    const trending = await getTopRecommendations(6);
    res.json(trending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
