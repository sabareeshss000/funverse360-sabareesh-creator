import mongoose from 'mongoose';

const friendshipSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING'
    },
    squadName: { type: String, default: 'Neon Avengers' }
  },
  { timestamps: true }
);

friendshipSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

export default mongoose.model('Friendship', friendshipSchema);
