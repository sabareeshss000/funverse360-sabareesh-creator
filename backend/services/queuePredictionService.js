import Ride from '../models/Ride.js';

/**
 * Queue Prediction Service
 * Calculates current throughput vs predicted wait times in 30 minutes
 */
export const predictRideQueues = async () => {
  const rides = await Ride.find({ status: 'OPEN' });

  const predictions = rides.map(ride => {
    const currentWait = ride.estimatedWait || 15;
    const capacity = ride.capacity || 40;
    
    // Heuristic projection factor based on ride popularity and time of day
    const hour = new Date().getHours();
    const isPeakHour = (hour >= 11 && hour <= 14) || (hour >= 17 && hour <= 21);
    const surgeMultiplier = isPeakHour ? (ride.popularity > 80 ? 1.4 : 1.2) : 0.85;

    const predictedWait = Math.round(currentWait * surgeMultiplier);
    const difference = predictedWait - currentWait;

    let advice = 'Normal waiting conditions.';
    let adviceType = 'INFO';

    if (difference >= 10) {
      advice = '⚠️ Visit now — queue expected to increase significantly!';
      adviceType = 'ALERT';
    } else if (difference <= -5) {
      advice = '💡 Queue expected to ease shortly.';
      adviceType = 'SAVINGS';
    }

    return {
      rideId: ride._id,
      rideName: ride.name,
      image: ride.image,
      currentQueueCount: ride.currentQueue,
      currentWaitMinutes: currentWait,
      predictedWaitMinutes30m: predictedWait,
      trend: difference > 0 ? 'RISING' : difference < 0 ? 'FALLING' : 'STABLE',
      advice,
      adviceType
    };
  });

  return predictions;
};
