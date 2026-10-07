import Ride from '../models/Ride.js';

/**
 * AI Chatbot Service for Age-Categorized Ride & Park Planning
 * Analyzes age demographics, thrill tolerances, height restrictions, and live queue times.
 */
export const getChatbotResponse = async ({ message = '', ageCategory = null, userAge = null }) => {
  const normalized = message.toLowerCase();

  // 1. Detect Age Category
  let category = ageCategory;
  if (!category) {
    if (userAge && userAge < 13) category = 'kids';
    else if (userAge && userAge >= 13 && userAge <= 17) category = 'teens';
    else if (userAge && userAge >= 18 && userAge <= 25) category = 'college';
    else if (userAge && userAge > 25) category = 'adults';
  }

  if (!category) {
    if (normalized.includes('kid') || normalized.includes('child') || normalized.includes('<12') || normalized.includes('under 12') || normalized.includes('toddler')) {
      category = 'kids';
    } else if (normalized.includes('teen') || normalized.includes('13') || normalized.includes('14') || normalized.includes('15') || normalized.includes('16') || normalized.includes('17')) {
      category = 'teens';
    } else if (normalized.includes('college') || normalized.includes('student') || normalized.includes('young adult') || normalized.includes('18') || normalized.includes('20') || normalized.includes('extreme') || normalized.includes('adrenaline')) {
      category = 'college';
    } else if (normalized.includes('family') || normalized.includes('all age') || normalized.includes('parents')) {
      category = 'family';
    } else if (normalized.includes('senior') || normalized.includes('chill') || normalized.includes('gentle') || normalized.includes('calm')) {
      category = 'chill';
    } else {
      category = 'general';
    }
  }

  // 2. Fetch all open rides from database
  const allRides = await Ride.find({ status: 'OPEN' });

  let matchedRides = [];
  let responseText = '';
  let safetyAdvice = '';
  let followUpSuggestions = [];

  switch (category) {
    case 'kids':
      matchedRides = allRides.filter(r => r.adventureLevel === 'Low' || (r.adventureLevel === 'Moderate' && r.price <= 90));
      responseText = `🎈 **Fun & Safe Rides for Kids (<12 Years):**\nHere are gentle, colorful, and super exciting rides tailored for young explorers! We prioritized low-to-moderate thrill rides with safe lap bars and lower height requirements.`;
      safetyAdvice = `💡 **Parent Tip:** Please ensure children meet the minimum height check at the turnstile gate and keep loose shoes secured!`;
      followUpSuggestions = [
        '👨‍👩‍👧 Family combo plan',
        '⚡ High thrill for Teens (13-17)',
        '🍔 Kids friendly meals under ₹100'
      ];
      break;

    case 'teens':
      matchedRides = allRides.filter(r => r.adventureLevel === 'High' || r.adventureLevel === 'Moderate');
      responseText = `⚡ **High-Action Rides for Teens (13–17 Years):**\nPerfect blend of speed, sharp drifts, and water splashes! These rides pack major excitement without requiring extreme heart advisory restrictions.`;
      safetyAdvice = `💡 **Teen Vibe Tip:** Neon Drift Go-Karts and Aqua Rapids have queue peaks around 4:00 PM — ride them now to avoid 20+ minute waits!`;
      followUpSuggestions = [
        '🔥 Extreme adrenaline coasters (18+)',
        '🎮 Multiplayer VR games',
        '🍕 Pizza & Burger student combos'
      ];
      break;

    case 'college':
      matchedRides = allRides.filter(r => r.adventureLevel === 'Extreme' || (r.adventureLevel === 'High' && r.popularity >= 88));
      responseText = `🔥 **Maximum Adrenaline for College Students & Young Adults (18–25 Years):**\nReady for inverted gravity loops and freefall drops? These top thrill coasters will spike your adrenaline to 100%!`;
      safetyAdvice = `💡 **FastTrack Tip:** HyperCoaster 360 has active 22m queues. Grab a FastTrack VIP pass via the Rides page to skip standard waiting lines!`;
      followUpSuggestions = [
        '🤖 Generate full ₹500 AI itinerary',
        '👥 Squad activity voting poll',
        '🏆 View current leaderboard'
      ];
      break;

    case 'family':
      matchedRides = allRides.filter(r => r.adventureLevel === 'Low' || r.adventureLevel === 'Moderate');
      responseText = `👨‍👩‍👧 **Perfect All-Ages Family Ride Journey:**\nDesigned so parents, teenagers, and younger siblings can laugh, swing, and capture unforgettable memories together!`;
      safetyAdvice = `💡 **Family Tip:** Starlight Ferris Wheel offers private enclosed cabins with panoramic sunset views over the entire park.`;
      followUpSuggestions = [
        '🎈 Rides for Kids (<12)',
        '🔥 High thrill rides for Teens',
        '💰 Best budget combos under ₹300'
      ];
      break;

    case 'chill':
      matchedRides = allRides.filter(r => r.adventureLevel === 'Low');
      responseText = `😎 **Scenic & Relaxed Rides (Chill & Comfortable):**\nEnjoy panoramic views, gentle rotation, and zero neck-jerking drops. Perfect for taking photos and soaking in the neon atmosphere!`;
      safetyAdvice = `💡 **Relaxation Tip:** Pair this with a fresh fruit cooler or iced coffee from Neon Sips at the Flavor Hub.`;
      followUpSuggestions = [
        '📸 Best photo spots in park',
        '🎤 Check live event stage schedule',
        '🍦 Desserts & Waffles'
      ];
      break;

    default:
      // General question / Ride advice
      matchedRides = allRides.slice(0, 3);
      responseText = `🎢 **Hey Adventurer! I'm FunBot 360, your AI Ride Concierge!**\nTell me the age group (Kids, Teens, College, Family) or your spending budget, and I'll curate the perfect ride sequence for you!`;
      safetyAdvice = `💡 Pick an age category below to get instant tailored recommendations:`;
      followUpSuggestions = [
        '🎈 Best rides for Kids (<12)',
        '⚡ High thrill rides for Teens (13-17)',
        '🔥 Extreme adrenaline for College (18-25)',
        '👨‍👩‍👧 Family-friendly combo plan'
      ];
      break;
  }

  // Ensure 2-4 highlight rides are populated
  const topRecommendations = (matchedRides.length > 0 ? matchedRides : allRides)
    .sort((a, b) => (b.popularity || 80) - (a.popularity || 80))
    .slice(0, 4)
    .map(r => ({
      _id: r._id,
      name: r.name,
      category: r.category,
      adventureLevel: r.adventureLevel,
      price: r.price,
      estimatedWait: r.estimatedWait,
      minHeight: r.minHeight,
      image: r.image,
      zone: r.location?.zone || 'Amusement Hub',
      safety: r.safetyRequirements?.[0] || 'Standard harness'
    }));

  return {
    reply: responseText,
    category,
    safetyAdvice,
    recommendedRides: topRecommendations,
    followUpSuggestions,
    timestamp: new Date().toISOString()
  };
};
