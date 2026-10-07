import mongoose from 'mongoose';

const gamePlaySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    gameTitle: { type: String, required: true },
    gameType: { type: String, default: 'Arcade' },
    score: { type: Number, required: true },
    xpEarned: { type: Number, required: true, default: 0 },
    accuracy: { type: Number, default: 100 },
    durationSeconds: { type: Number, default: 30 }
  },
  { timestamps: true }
);

export default mongoose.model('GamePlay', gamePlaySchema);
