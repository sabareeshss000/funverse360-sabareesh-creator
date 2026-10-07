import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    age: { type: Number, default: 20 },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    avatar: { type: String, default: 'https://api.dicebear.com/7.x/bottts/svg?seed=funverse' },
    interests: {
      type: [String],
      enum: ['Adventure', 'Food', 'Games', 'Music', 'Photography', 'Sports', 'Chill'],
      default: ['Adventure', 'Games', 'Food']
    },
    xp: { type: Number, default: 250 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 3 },
    walletBalance: { type: Number, default: 500 },
    totalSpent: { type: Number, default: 0 },
    badges: [
      {
        id: String,
        name: String,
        icon: String,
        unlockedAt: { type: Date, default: Date.now }
      }
    ],
    status: { type: String, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE' }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
