import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['DAILY', 'WEEKLY', 'SQUAD'], default: 'DAILY' },
    xpReward: { type: Number, required: true, default: 100 },
    category: { type: String, default: 'Adventure' },
    icon: { type: String, default: '🎯' },
    requirementCount: { type: Number, default: 1 },
    actionType: { type: String, default: 'PHOTO_RIDE' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
  },
  { timestamps: true }
);

export default mongoose.model('Challenge', challengeSchema);
