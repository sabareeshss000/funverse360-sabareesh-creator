import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String }
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['RECEIVED', 'PREPARING', 'READY', 'PICKED_UP'],
      default: 'RECEIVED'
    },
    pickupCounter: { type: String, default: 'Counter 3' },
    estimatedMinutes: { type: Number, default: 10 }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
