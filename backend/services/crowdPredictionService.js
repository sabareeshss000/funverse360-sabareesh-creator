/**
 * Crowd Prediction Service
 * Combines park zone occupancy models, peak operational hours, and active live events
 */

let liveCrowdState = {
  rides: { name: 'Thrill Rides Zone', percentage: 92, level: 'HIGH', trend: 'INCREASING', color: '#EF4444' },
  food: { name: 'Food Court & Dining', percentage: 87, level: 'HIGH', trend: 'STABLE', color: '#EF4444' },
  games: { name: 'Arcade & VR Galaxy', percentage: 34, level: 'LOW', trend: 'DECREASING', color: '#22C55E' },
  stage: { name: 'Starlight Main Arena', percentage: 60, level: 'MEDIUM', trend: 'INCREASING', color: '#FACC15' }
};

export const getLiveCrowdData = () => {
  return liveCrowdState;
};

export const pulseCrowdData = () => {
  // Add realistic micro-variations for live socket feeds
  const jitter = (val) => Math.min(99, Math.max(15, Math.round(val + (Math.random() * 4 - 2))));

  liveCrowdState.rides.percentage = jitter(liveCrowdState.rides.percentage);
  liveCrowdState.food.percentage = jitter(liveCrowdState.food.percentage);
  liveCrowdState.games.percentage = jitter(liveCrowdState.games.percentage);
  liveCrowdState.stage.percentage = jitter(liveCrowdState.stage.percentage);

  // Recalculate level tags
  const getLevel = (pct) => (pct > 75 ? 'HIGH' : pct > 45 ? 'MEDIUM' : 'LOW');
  liveCrowdState.rides.level = getLevel(liveCrowdState.rides.percentage);
  liveCrowdState.food.level = getLevel(liveCrowdState.food.percentage);
  liveCrowdState.games.level = getLevel(liveCrowdState.games.percentage);
  liveCrowdState.stage.level = getLevel(liveCrowdState.stage.percentage);

  return liveCrowdState;
};

export const predictCrowdForecast = () => {
  const currentHour = new Date().getHours();
  return [
    { time: 'Now', rides: liveCrowdState.rides.percentage, food: liveCrowdState.food.percentage, games: liveCrowdState.games.percentage },
    { time: '+30m', rides: Math.min(98, liveCrowdState.rides.percentage + 4), food: Math.min(95, liveCrowdState.food.percentage + 6), games: 38 },
    { time: '+60m', rides: 88, food: 92, games: 45 },
    { time: '+90m', rides: 79, food: 74, games: 60 },
    { time: '+120m', rides: 65, food: 60, games: 52 }
  ];
};

export const getZoneAlerts = () => {
  const alerts = [];
  if (liveCrowdState.rides.percentage >= 85) {
    alerts.push({
      zone: 'Thrill Rides Zone',
      message: 'High congestion. FastTrack passes recommended for Roller Coaster and SkyDrop.',
      severity: 'WARNING'
    });
  }
  if (liveCrowdState.food.percentage >= 80) {
    alerts.push({
      zone: 'Food Court & Dining',
      message: 'Lunch rush surge active. Use Mobile Pickup ordering to bypass queues.',
      severity: 'WARNING'
    });
  }
  return alerts;
};
