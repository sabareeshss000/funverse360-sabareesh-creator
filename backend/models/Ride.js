import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, default: 'Thrill' },
    price: { type: Number, required: true, default: 0 },
    adventureLevel: { type: String, enum: ['Low', 'Moderate', 'High', 'Extreme'], default: 'High' },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      zone: { type: String, default: 'Zone A - Thrill Peaks' }
    },
    capacity: { type: Number, default: 40 },
    currentQueue: { type: Number, default: 25 },
    estimatedWait: { type: Number, default: 15 }, // minutes
    status: { type: String, enum: ['OPEN', 'MAINTENANCE', 'CLOSED'], default: 'OPEN' },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 120 },
    popularity: { type: Number, default: 90 }, // 0 - 100
    duration: { type: String, default: '3 mins' },
    minHeight: { type: String, default: '120 cm' },
    safetyRequirements: [String]
  },
  { timestamps: true }
);

export default mongoose.model('Ride', rideSchema);
