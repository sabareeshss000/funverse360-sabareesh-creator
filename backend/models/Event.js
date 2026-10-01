import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ['Music', 'Dance', 'DJ', 'Open Mic', 'Competitions', 'Shows'],
      default: 'Music'
    },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: {
      name: { type: String, default: 'Starlight Main Arena' },
      lat: { type: Number, default: 12.9730 },
      lng: { type: Number, default: 77.5960 },
      zone: { type: String, default: 'Zone D - Festival Grounds' }
    },
    capacity: { type: Number, default: 500 },
    attendees: { type: Number, default: 180 },
    price: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['LIVE', 'STARTING_SOON', 'AVAILABLE', 'ENDED'],
      default: 'AVAILABLE'
    },
    featuredArtist: { type: String, default: '' },
    tags: [String]
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
