import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    xpRequired: { type: Number, required: true, default: 300 },
    type: {
      type: String,
      enum: ['DISCOUNT', 'FREE_PASS', 'BADGE', 'WALLET_CASH', 'MERCH'],
      default: 'DISCOUNT'
    },
    value: { type: String, default: '20% OFF' },
    icon: { type: String, default: '🎁' },
    claimedCount: { type: Number, default: 0 },
    code: { type: String, default: 'FUNVERSE-SUPER' }
  },
  { timestamps: true }
);

export default mongoose.model('Reward', rewardSchema);
