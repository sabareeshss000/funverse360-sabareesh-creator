import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Racing', 'Shooting', 'VR', 'Arcade', 'Bowling', 'Puzzle', 'Multiplayer'],
      required: true
    },
    image: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, default: 50 },
    duration: { type: String, default: '15 mins' },
    highScore: { type: Number, default: 12500 },
    topPlayer: { type: String, default: 'NeonShadow' },
    availability: { type: String, enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'], default: 'AVAILABLE' },
    xpReward: { type: Number, default: 80 },
    rating: { type: Number, default: 4.9 },
    location: {
      lat: { type: Number, default: 12.9720 },
      lng: { type: Number, default: 77.5950 },
      zone: { type: String, default: 'Zone C - Arcade Galaxy' }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Game', gameSchema);
