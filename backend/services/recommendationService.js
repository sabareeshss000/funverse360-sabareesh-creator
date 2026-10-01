import Ride from '../models/Ride.js';
import Food from '../models/Food.js';
import Game from '../models/Game.js';
import Event from '../models/Event.js';

/**
 * Multi-Criteria Rule-Based Intelligent Recommendation Engine
 * Architecture is modular and can be backed or swapped with an ML model.
 * 
 * Formula:
 * Score = (w1 * InterestMatch) + (w2 * BudgetMatch) + (w3 * TimeMatch) 
 *         + (w4 * Popularity) - (w5 * CrowdPenalty) - (w6 * QueuePenalty)
 */
export const generatePlan = async ({ timeMinutes = 180, budget = 500, mood = 'Adventure', partyType = 'Friends' }) => {
  // Fetch candidate pools
  const [rides, foods, games, events] = await Promise.all([
    Ride.find({ status: 'OPEN' }),
    Food.find({ stock: { $gt: 0 } }),
    Game.find({ availability: 'AVAILABLE' }),
    Event.find({ status: { $in: ['LIVE', 'STARTING_SOON', 'AVAILABLE'] } })
  ]);

  const itinerary = [];
  let remainingBudget = Number(budget);
  let remainingTime = Number(timeMinutes);

  // Heuristic weights based on mood
  const weights = {
    Adventure: { ride: 1.5, game: 1.1, food: 0.9, event: 0.8 },
    Foodie: { food: 1.8, ride: 0.8, game: 0.9, event: 0.7 },
    Gaming: { game: 1.8, ride: 0.9, food: 1.0, event: 0.8 },
    Chill: { event: 1.4, food: 1.3, game: 0.9, ride: 0.6 },
    Music: { event: 1.9, food: 1.1, game: 0.7, ride: 0.7 },
    Photography: { event: 1.3, ride: 1.4, food: 1.0, game: 0.8 }
  }[mood] || { ride: 1.0, food: 1.0, game: 1.0, event: 1.0 };

  // Helper score calculator
  const scoreItem = (item, type) => {
    let base = item.rating ? item.rating * 15 : 60;
    let popularity = item.popularity || 80;
    let queuePenalty = (item.estimatedWait || 0) * 0.8;
    let costAffordability = item.price <= remainingBudget ? 20 : -50;
    let typeMultiplier = weights[type] || 1.0;

    return (base + popularity * 0.3 + costAffordability - queuePenalty) * typeMultiplier;
  };

  // Rank rides
  const scoredRides = rides
    .map(r => ({ item: r, type: 'ride', score: scoreItem(r, 'ride'), duration: 25 + (r.estimatedWait || 15) }))
    .sort((a, b) => b.score - a.score);

  // Rank foods
  const scoredFoods = foods
    .map(f => ({ item: f, type: 'food', score: scoreItem(f, 'food'), duration: 20 + (f.preparationTime || 10) }))
    .sort((a, b) => b.score - a.score);

  // Rank games
  const scoredGames = games
    .map(g => ({ item: g, type: 'game', score: scoreItem(g, 'game'), duration: 30 }))
    .sort((a, b) => b.score - a.score);

  // Rank events
  const scoredEvents = events
    .map(e => ({ item: e, type: 'event', score: scoreItem(e, 'event'), duration: 45 }))
    .sort((a, b) => b.score - a.score);

  // Construct balanced, progressive itinerary (Action -> Food/Refuel -> Game/Thrill -> Chill/Event)
  const candidateLists = [scoredRides, scoredFoods, scoredGames, scoredEvents];
  
  // Custom preference order based on Mood
  let orderOfTypes = ['ride', 'food', 'game', 'event'];
  if (mood === 'Foodie') orderOfTypes = ['food', 'ride', 'game', 'food'];
  if (mood === 'Gaming') orderOfTypes = ['game', 'food', 'game', 'ride'];
  if (mood === 'Music') orderOfTypes = ['event', 'food', 'ride', 'game'];
  if (mood === 'Chill') orderOfTypes = ['event', 'food', 'game', 'ride'];

  for (const preferredType of orderOfTypes) {
    let pool = [];
    if (preferredType === 'ride') pool = scoredRides;
    else if (preferredType === 'food') pool = scoredFoods;
    else if (preferredType === 'game') pool = scoredGames;
    else if (preferredType === 'event') pool = scoredEvents;

    for (const candidate of pool) {
      const alreadyIn = itinerary.some(it => it.id === candidate.item._id.toString());
      if (!alreadyIn && candidate.item.price <= remainingBudget && candidate.duration <= remainingTime) {
        itinerary.push({
          id: candidate.item._id.toString(),
          type: candidate.type,
          name: candidate.item.name || candidate.item.title,
          image: candidate.item.image,
          price: candidate.item.price,
          duration: candidate.duration,
          location: candidate.item.location || { zone: 'Amusement Hub' },
          waitOrPrepTime: candidate.item.estimatedWait || candidate.item.preparationTime || 10,
          highlight: candidate.type === 'ride' ? `Queue: ${candidate.item.estimatedWait || 15}m` :
                     candidate.type === 'food' ? `Prep: ${candidate.item.preparationTime || 12}m` :
                     candidate.type === 'game' ? `Arcade Play • +${candidate.item.xpReward || 50} XP` :
                     `Status: ${candidate.item.status || 'LIVE'}`
        });

        remainingBudget -= candidate.item.price;
        remainingTime -= candidate.duration;
        break; // Pick top candidate for this slot
      }
    }
  }

  // Calculate totals
  const totalCost = itinerary.reduce((sum, it) => sum + it.price, 0);
  const totalDuration = itinerary.reduce((sum, it) => sum + it.duration, 0);

  return {
    itinerary,
    totalCost,
    totalDurationMinutes: totalDuration,
    formattedDuration: `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`,
    remainingBudget,
    targetMood: mood,
    partyType,
    summary: `Curated ${itinerary.length} highlight activities perfectly matched for ${mood} and ${partyType}!`
  };
};

export const getTopRecommendations = async (limit = 6) => {
  const [rides, foods, games, events] = await Promise.all([
    Ride.find({ status: 'OPEN' }).sort({ rating: -1, popularity: -1 }).limit(2),
    Food.find({ popular: true }).sort({ rating: -1 }).limit(2),
    Game.find({ availability: 'AVAILABLE' }).sort({ rating: -1 }).limit(2),
    Event.find({ status: { $in: ['LIVE', 'STARTING_SOON'] } }).limit(2)
  ]);

  return {
    rides,
    foods,
    games,
    events
  };
};
