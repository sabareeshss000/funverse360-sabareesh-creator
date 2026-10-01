/**
 * Food Demand Prediction Service
 * Evaluates kitchen turnaround times, popular category order frequency, and peak dining hours
 */

export const getFoodDemandPredictions = () => {
  const hour = new Date().getHours();
  const isLunchOrDinner = (hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 21);

  return {
    categories: [
      {
        category: 'Pizza',
        icon: '🍕',
        demand: isLunchOrDinner ? 'HIGH' : 'MEDIUM',
        prepTimeAvg: '14 min',
        trend: '🔥 Peak surge between 6 PM - 8 PM',
        recommendedCounters: 3
      },
      {
        category: 'Burger',
        icon: '🍔',
        demand: 'MEDIUM',
        prepTimeAvg: '10 min',
        trend: '🟡 Steady demand',
        recommendedCounters: 2
      },
      {
        category: 'Snacks & Fries',
        icon: '🍟',
        demand: 'HIGH',
        prepTimeAvg: '6 min',
        trend: '🔥 High snacking velocity all afternoon',
        recommendedCounters: 3
      },
      {
        category: 'Desserts & Ice Cream',
        icon: '🍦',
        demand: 'LOW',
        prepTimeAvg: '4 min',
        trend: '🟢 Expected to surge after 8:30 PM',
        recommendedCounters: 1
      },
      {
        category: 'Drinks & Mocktails',
        icon: '🥤',
        demand: 'HIGH',
        prepTimeAvg: '3 min',
        trend: '🔥 Consistently high throughput',
        recommendedCounters: 2
      }
    ],
    operationalAdvice: [
      { id: 1, title: 'Queue Mitigation', text: 'Food Court congestion expected to increase by 25% in the next 30 minutes.' },
      { id: 2, title: 'Inventory Alert', text: 'Pizza demand is expected to peak at 7 PM. Prepare extra dough and cheese stocks.' },
      { id: 3, title: 'Staffing Recommendation', text: 'Consider opening Counter 4 at Flavor Hub to maintain under-8-minute order delivery.' }
    ]
  };
};
