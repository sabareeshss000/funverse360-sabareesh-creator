import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
  amount: { type: Number, required: true },
  category: {
    type: String,
    enum: ['RIDE', 'FOOD', 'GAME', 'TOPUP', 'REWARD', 'EVENT'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  referenceId: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const walletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    totalBudget: { type: Number, default: 1000 },
    balance: { type: Number, default: 500 },
    totalSpent: { type: Number, default: 0 },
    transactions: [transactionSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Wallet', walletSchema);
