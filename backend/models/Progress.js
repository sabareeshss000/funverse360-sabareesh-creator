import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    progressCount: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    xpEarned: { type: Number, default: 0 },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

export default mongoose.model('Progress', progressSchema);
