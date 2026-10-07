import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemType: { type: String, enum: ['RIDE', 'EVENT', 'GAME'], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['CONFIRMED', 'COMPLETED', 'CANCELLED'],
      default: 'CONFIRMED'
    },
    qrCode: { type: String, required: true },
    ticketPassId: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
