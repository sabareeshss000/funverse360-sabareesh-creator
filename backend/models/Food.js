import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Pizza', 'Burger', 'Snacks', 'Meals', 'Desserts', 'Drinks'],
      required: true
    },
    image: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    rating: { type: Number, default: 4.7 },
    reviewsCount: { type: Number, default: 85 },
    preparationTime: { type: Number, default: 12 }, // minutes
    stock: { type: Number, default: 50 },
    vendorId: { type: String, default: 'Stall-101' },
    vendorName: { type: String, default: 'Galaxy Diner' },
    isVeg: { type: Boolean, default: true },
    popular: { type: Boolean, default: false },
    demandLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
    location: {
      lat: { type: Number, default: 12.9716 },
      lng: { type: Number, default: 77.5946 },
      zone: { type: String, default: 'Zone B - Flavor Hub' }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Food', foodSchema);
