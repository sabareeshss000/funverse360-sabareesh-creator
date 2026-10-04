import express from 'express';
import { getChatbotResponse } from '../services/chatbotService.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Chatbot conversation endpoint
router.post('/chat', optionalAuth, async (req, res) => {
  try {
    const { message, ageCategory } = req.body;
    const userAge = req.user?.age || null;

    const botResponse = await getChatbotResponse({
      message: message || '',
      ageCategory: ageCategory || null,
      userAge
    });

    res.json(botResponse);
  } catch (error) {
    console.error('[CHATBOT ERROR]', error.message);
    res.status(500).json({ message: 'Error processing chatbot advice', error: error.message });
  }
});

// Age category metadata
router.get('/categories', (req, res) => {
  res.json([
    {
      id: 'kids',
      label: 'Kids (<12 yrs)',
      emoji: '🎈',
      vibe: 'Gentle, scenic & magical',
      sampleRides: ['Starlight Ferris Wheel', 'Cyber Vortex Swings', 'Neon Bumper Pods']
    },
    {
      id: 'teens',
      label: 'Teens (13–17 yrs)',
      emoji: '⚡',
      vibe: 'High-speed drifts & water rapids',
      sampleRides: ['Neon Drift Go-Karts', 'Aqua Rapids Canyon', 'Phantasm Dark Ride']
    },
    {
      id: 'college',
      label: 'College (18–25 yrs)',
      emoji: '🔥',
      vibe: 'Extreme inverted loops & zero-g drops',
      sampleRides: ['HyperCoaster 360', 'Quantum Drop Tower', 'Sky Glider Zip Coaster']
    },
    {
      id: 'family',
      label: 'Family (All Ages)',
      emoji: '👨‍👩‍👧',
      vibe: 'Balanced fun for parents & kids together',
      sampleRides: ['Starlight Ferris Wheel', 'Solar Flare Galleon', 'Bumper Pods']
    }
  ]);
});

export default router;
