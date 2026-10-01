import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Ride from './models/Ride.js';
import Food from './models/Food.js';
import Game from './models/Game.js';
import Event from './models/Event.js';
import Challenge from './models/Challenge.js';
import Reward from './models/Reward.js';
import Wallet from './models/Wallet.js';
import Booking from './models/Booking.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import { connectDB } from './config/db.js';

dotenv.config();

export const seedDatabase = async () => {
  console.log('[SEED] 🌱 Starting comprehensive database seeding...');

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    Ride.deleteMany({}),
    Food.deleteMany({}),
    Game.deleteMany({}),
    Event.deleteMany({}),
    Challenge.deleteMany({}),
    Reward.deleteMany({}),
    Wallet.deleteMany({}),
    Booking.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({})
  ]);

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('password123', salt);

  // 1. Create 20 Users
  const userPresets = [
    { name: 'Alex Rivers', email: 'demo@funverse.com', role: 'USER', age: 20, xp: 850, level: 3, streak: 5, walletBalance: 420, interests: ['Adventure', 'Food', 'Games'] },
    { name: 'Director Marcus', email: 'admin@funverse.com', role: 'ADMIN', age: 34, xp: 5200, level: 12, streak: 18, walletBalance: 2500, interests: ['Adventure', 'Music'] },
    { name: 'Maya Chen', email: 'maya@funverse.com', role: 'USER', age: 19, xp: 1450, level: 5, streak: 9, walletBalance: 310, interests: ['Games', 'Photography'] },
    { name: 'Devon Patel', email: 'devon@funverse.com', role: 'USER', age: 21, xp: 1220, level: 4, streak: 6, walletBalance: 180, interests: ['Adventure', 'Food'] },
    { name: 'Zara Al-Mansoor', email: 'zara@funverse.com', role: 'USER', age: 22, xp: 980, level: 3, streak: 4, walletBalance: 560, interests: ['Music', 'Chill'] },
    { name: 'Leo Vance', email: 'leo@funverse.com', role: 'USER', age: 20, xp: 890, level: 3, streak: 7, walletBalance: 220, interests: ['Games', 'Sports'] },
    { name: 'Chloe Kim', email: 'chloe@funverse.com', role: 'USER', age: 18, xp: 1680, level: 6, streak: 12, walletBalance: 490, interests: ['Photography', 'Music'] },
    { name: 'Rohan Sharma', email: 'rohan@funverse.com', role: 'USER', age: 23, xp: 1100, level: 4, streak: 5, walletBalance: 340, interests: ['Adventure', 'Games'] },
    { name: 'Elena Rostova', email: 'elena@funverse.com', role: 'USER', age: 20, xp: 750, level: 2, streak: 3, walletBalance: 280, interests: ['Food', 'Chill'] },
    { name: 'Kai Tanaka', email: 'kai@funverse.com', role: 'USER', age: 22, xp: 1340, level: 4, streak: 8, walletBalance: 610, interests: ['Games', 'Adventure'] },
    { name: 'Aria Stark', email: 'aria@funverse.com', role: 'USER', age: 19, xp: 620, level: 2, streak: 2, walletBalance: 150, interests: ['Music', 'Photography'] },
    { name: 'Noah Miller', email: 'noah@funverse.com', role: 'USER', age: 21, xp: 940, level: 3, streak: 4, walletBalance: 390, interests: ['Food', 'Sports'] },
    { name: 'Sora Takahashi', email: 'sora@funverse.com', role: 'USER', age: 20, xp: 1820, level: 6, streak: 14, walletBalance: 720, interests: ['Games', 'Music'] },
    { name: 'Priya Nair', email: 'priya@funverse.com', role: 'USER', age: 21, xp: 1150, level: 4, streak: 6, walletBalance: 440, interests: ['Food', 'Chill'] },
    { name: 'Lucas Scott', email: 'lucas@funverse.com', role: 'USER', age: 22, xp: 870, level: 3, streak: 4, walletBalance: 260, interests: ['Adventure', 'Sports'] },
    { name: 'Sofia Martinez', email: 'sofia@funverse.com', role: 'USER', age: 19, xp: 1020, level: 3, streak: 5, walletBalance: 380, interests: ['Music', 'Food'] },
    { name: 'Jin Woo', email: 'jin@funverse.com', role: 'USER', age: 23, xp: 2100, level: 7, streak: 16, walletBalance: 850, interests: ['Games', 'Adventure'] },
    { name: 'Ananya Roy', email: 'ananya@funverse.com', role: 'USER', age: 20, xp: 790, level: 2, streak: 3, walletBalance: 310, interests: ['Photography', 'Food'] },
    { name: 'Jordan Reed', email: 'jordan@funverse.com', role: 'USER', age: 22, xp: 1280, level: 4, streak: 7, walletBalance: 510, interests: ['Sports', 'Games'] },
    { name: 'Emma Watson', email: 'emma@funverse.com', role: 'USER', age: 21, xp: 950, level: 3, streak: 5, walletBalance: 400, interests: ['Chill', 'Music'] }
  ];

  const createdUsers = [];
  for (const u of userPresets) {
    const user = await User.create({
      ...u,
      password: defaultPasswordHash,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${u.name.replace(' ', '')}`,
      badges: [
        { id: 'b1', name: 'Fun Pioneer', icon: '🚀', unlockedAt: new Date() },
        { id: 'b2', name: 'Thrill Seeker', icon: '🎢', unlockedAt: new Date() }
      ]
    });

    await Wallet.create({
      userId: user._id,
      totalBudget: 1000,
      balance: user.walletBalance,
      totalSpent: 1000 - user.walletBalance,
      transactions: [
        {
          type: 'CREDIT',
          amount: 500,
          category: 'TOPUP',
          title: 'Welcome Student Credit',
          description: 'Funverse onboarding grant'
        }
      ]
    });

    createdUsers.push(user);
  }

  // 2. Create 10 Rides
  const ridesData = [
    {
      name: 'HyperCoaster 360',
      description: 'Dual inverted gravity loops reaching speeds of 110 km/h with neon night luminescence.',
      image: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800&auto=format&fit=crop&q=80',
      category: 'Extreme Thrill',
      price: 140,
      adventureLevel: 'Extreme',
      location: { lat: 12.9718, lng: 77.5935, zone: 'Zone A - Thrill Peaks' },
      capacity: 36,
      currentQueue: 32,
      estimatedWait: 22,
      status: 'OPEN',
      rating: 4.9,
      reviewsCount: 340,
      popularity: 98,
      duration: '3 mins',
      minHeight: '140 cm',
      safetyRequirements: ['Harness Lock', 'No Loose Items', 'Heart Health Warning']
    },
    {
      name: 'Quantum Drop Tower',
      description: '70-meter zero-gravity freefall plunge with laser synchronized soundscape.',
      image: 'https://images.unsplash.com/photo-1561085739-16629ec2e48e?w=800&auto=format&fit=crop&q=80',
      category: 'Extreme Thrill',
      price: 120,
      adventureLevel: 'Extreme',
      location: { lat: 12.9725, lng: 77.5940, zone: 'Zone A - Thrill Peaks' },
      capacity: 24,
      currentQueue: 20,
      estimatedWait: 15,
      status: 'OPEN',
      rating: 4.8,
      reviewsCount: 220,
      popularity: 92,
      duration: '2 mins',
      minHeight: '135 cm',
      safetyRequirements: ['Safety Vest', 'Secured Footwear']
    },
    {
      name: 'Cyber Vortex Swings',
      description: 'High-altitude illuminated swing carousel rotating 40 meters above the central plaza.',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
      category: 'Thrill',
      price: 80,
      adventureLevel: 'Moderate',
      location: { lat: 12.9712, lng: 77.5948, zone: 'Zone A - Thrill Peaks' },
      capacity: 48,
      currentQueue: 14,
      estimatedWait: 8,
      status: 'OPEN',
      rating: 4.6,
      reviewsCount: 180,
      popularity: 84,
      duration: '4 mins',
      minHeight: '115 cm',
      safetyRequirements: ['Seatbelt Clasp']
    },
    {
      name: 'Starlight Ferris Wheel',
      description: 'Panoramic glass-cabin giant observation wheel with customized student party cabins.',
      image: 'https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?w=800&auto=format&fit=crop&q=80',
      category: 'Scenic & Chill',
      price: 90,
      adventureLevel: 'Low',
      location: { lat: 12.9705, lng: 77.5955, zone: 'Zone B - Skyline Vista' },
      capacity: 80,
      currentQueue: 18,
      estimatedWait: 10,
      status: 'OPEN',
      rating: 4.7,
      reviewsCount: 410,
      popularity: 91,
      duration: '12 mins',
      minHeight: 'None',
      safetyRequirements: ['Cabin Door Secure']
    },
    {
      name: 'Neon Drift Go-Karts',
      description: 'Electric drifting track equipped with LED headlights, boost pads, and real-time timing lap screens.',
      image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop&q=80',
      category: 'Racing',
      price: 110,
      adventureLevel: 'High',
      location: { lat: 12.9735, lng: 77.5930, zone: 'Zone C - Nitro Circuit' },
      capacity: 16,
      currentQueue: 26,
      estimatedWait: 18,
      status: 'OPEN',
      rating: 4.8,
      reviewsCount: 290,
      popularity: 95,
      duration: '8 mins',
      minHeight: '130 cm',
      safetyRequirements: ['Helmet Required', 'Closed Shoes']
    },
    {
      name: 'Aqua Rapids Canyon',
      description: 'High-speed raft river expedition splashing through misty canyon caverns and whirlpools.',
      image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&auto=format&fit=crop&q=80',
      category: 'Water Adventure',
      price: 100,
      adventureLevel: 'High',
      location: { lat: 12.9740, lng: 77.5952, zone: 'Zone D - Aqua Splash' },
      capacity: 32,
      currentQueue: 28,
      estimatedWait: 20,
      status: 'OPEN',
      rating: 4.6,
      reviewsCount: 195,
      popularity: 88,
      duration: '6 mins',
      minHeight: '120 cm',
      safetyRequirements: ['Life Vest Provided']
    },
    {
      name: 'Solar Flare Pirate Galleon',
      description: 'Huge pendulum swinging pirate vessel tilting 85 degrees backwards and forwards into the sky.',
      image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80',
      category: 'Thrill',
      price: 75,
      adventureLevel: 'Moderate',
      location: { lat: 12.9708, lng: 77.5962, zone: 'Zone B - Skyline Vista' },
      capacity: 50,
      currentQueue: 10,
      estimatedWait: 6,
      status: 'OPEN',
      rating: 4.5,
      reviewsCount: 140,
      popularity: 76,
      duration: '3 mins',
      minHeight: '120 cm',
      safetyRequirements: ['Lap Bar Secure']
    },
    {
      name: 'Phantasm Dark Ride',
      description: 'Interactive laser blaster dark ride through an alien futuristic research laboratory.',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      category: 'Interactive Dark Ride',
      price: 95,
      adventureLevel: 'Moderate',
      location: { lat: 12.9728, lng: 77.5925, zone: 'Zone C - Arcade Galaxy' },
      capacity: 28,
      currentQueue: 16,
      estimatedWait: 12,
      status: 'OPEN',
      rating: 4.7,
      reviewsCount: 175,
      popularity: 82,
      duration: '5 mins',
      minHeight: '110 cm',
      safetyRequirements: ['3D Glasses Included']
    },
    {
      name: 'Sky Glider Zip Coaster',
      description: 'Suspended roller coaster weaving beneath forest canopies with gentle zero-g rollaways.',
      image: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800&auto=format&fit=crop&q=80',
      category: 'Thrill',
      price: 130,
      adventureLevel: 'High',
      location: { lat: 12.9715, lng: 77.5920, zone: 'Zone A - Thrill Peaks' },
      capacity: 24,
      currentQueue: 22,
      estimatedWait: 16,
      status: 'OPEN',
      rating: 4.8,
      reviewsCount: 210,
      popularity: 89,
      duration: '3 mins',
      minHeight: '130 cm',
      safetyRequirements: ['Overhead Harness']
    },
    {
      name: 'Neon Bumper Pods',
      description: 'Hovercraft bumper cars with reactive lights, bass vibrations, and retro arcade soundtrack.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
      category: 'Fun & Casual',
      price: 60,
      adventureLevel: 'Low',
      location: { lat: 12.9722, lng: 77.5958, zone: 'Zone C - Arcade Galaxy' },
      capacity: 30,
      currentQueue: 8,
      estimatedWait: 5,
      status: 'OPEN',
      rating: 4.6,
      reviewsCount: 155,
      popularity: 79,
      duration: '5 mins',
      minHeight: '100 cm',
      safetyRequirements: ['Seatbelt On']
    }
  ];

  const createdRides = await Ride.insertMany(ridesData);

  // 3. Create 20 Food Items
  const foodData = [
    { name: 'Neon Smash Cheeseburger', category: 'Burger', price: 140, rating: 4.9, preparationTime: 10, stock: 80, vendorId: 'Stall-1', vendorName: 'Galaxy Diner', isVeg: false, popular: true, demandLevel: 'HIGH', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80', description: 'Double crispy patty, molten cheddar, caramelized onions, smoked chipotle sauce.' },
    { name: 'Firestorm Pepperoni Pizza', category: 'Pizza', price: 210, rating: 4.8, preparationTime: 14, stock: 65, vendorId: 'Stall-2', vendorName: 'Pizza Inferno', isVeg: false, popular: true, demandLevel: 'HIGH', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=80', description: 'Wood-fired sourdough base loaded with artisanal pepperoni and hot honey glaze.' },
    { name: 'Margherita Fresca Pizza', category: 'Pizza', price: 160, rating: 4.7, preparationTime: 12, stock: 70, vendorId: 'Stall-2', vendorName: 'Pizza Inferno', isVeg: true, popular: true, demandLevel: 'HIGH', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80', description: 'San Marzano tomato puree, buffalo mozzarella pearls, fresh basil leaves.' },
    { name: 'Crispy Truffle Fries', category: 'Snacks', price: 90, rating: 4.9, preparationTime: 5, stock: 120, vendorId: 'Stall-3', vendorName: 'Fries & Co', isVeg: true, popular: true, demandLevel: 'HIGH', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80', description: 'Hand-cut golden fries tossed in aromatic white truffle oil and aged parmesan.' },
    { name: 'Spicy Paneer Crunch Burger', category: 'Burger', price: 120, rating: 4.7, preparationTime: 9, stock: 60, vendorId: 'Stall-1', vendorName: 'Galaxy Diner', isVeg: true, popular: false, demandLevel: 'MEDIUM', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80', description: 'Crispy spiced paneer slab, crunchy coleslaw, tangy peri-peri garlic mayo.' },
    { name: 'Loaded Mexican Nachos', category: 'Snacks', price: 110, rating: 4.6, preparationTime: 7, stock: 85, vendorId: 'Stall-4', vendorName: 'Baja Cantina', isVeg: true, popular: true, demandLevel: 'MEDIUM', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&auto=format&fit=crop&q=80', description: 'Tortilla chips drowned in warm queso, jalapenos, salsa fresca, guacamole.' },
    { name: 'Electric Blue Slush Mocktail', category: 'Drinks', price: 70, rating: 4.8, preparationTime: 3, stock: 150, vendorId: 'Stall-5', vendorName: 'Neon Sips', isVeg: true, popular: true, demandLevel: 'HIGH', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80', description: 'Chilled blue curaçao, lime, mint, sparkling soda with edible neon glitter.' },
    { name: 'Mango Berry Smoothie Bowl', category: 'Desserts', price: 130, rating: 4.7, preparationTime: 6, stock: 40, vendorId: 'Stall-5', vendorName: 'Neon Sips', isVeg: true, popular: false, demandLevel: 'LOW', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=80', description: 'Thick mango puree topped with chia seeds, fresh blueberries, and coconut chips.' },
    { name: 'Galaxy Swirl Waffle Cone', category: 'Desserts', price: 80, rating: 4.9, preparationTime: 4, stock: 100, vendorId: 'Stall-6', vendorName: 'Sugar Nebula', isVeg: true, popular: true, demandLevel: 'MEDIUM', image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&auto=format&fit=crop&q=80', description: 'Double scoop black vanilla and dragonfruit swirl in a charcoal waffle cone.' },
    { name: 'Tokyo Teriyaki Chicken Rice Bowl', category: 'Meals', price: 180, rating: 4.8, preparationTime: 12, stock: 50, vendorId: 'Stall-7', vendorName: 'Umami Street', isVeg: false, popular: true, demandLevel: 'MEDIUM', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80', description: 'Grilled chicken glazed with sticky teriyaki on jasmine rice and steamed broccoli.' },
    { name: 'Paneer Tikka Roll', category: 'Snacks', price: 95, rating: 4.6, preparationTime: 8, stock: 90, vendorId: 'Stall-8', vendorName: 'Kathi Express', isVeg: true, popular: true, demandLevel: 'HIGH', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80', description: 'Charred tandoori paneer wrapped in flaky laccha paratha with mint chutney.' },
    { name: 'Chicken Shawarma Wrap', category: 'Meals', price: 130, rating: 4.8, preparationTime: 8, stock: 75, vendorId: 'Stall-8', vendorName: 'Kathi Express', isVeg: false, popular: true, demandLevel: 'HIGH', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&auto=format&fit=crop&q=80', description: 'Shredded roasted chicken, garlic toum, pickles, wrapped in pita bread.' },
    { name: 'Caramel Macchiato Iced Coffee', category: 'Drinks', price: 85, rating: 4.7, preparationTime: 4, stock: 110, vendorId: 'Stall-9', vendorName: 'Pixel Brews', isVeg: true, popular: false, demandLevel: 'MEDIUM', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80', description: 'Fresh espresso shot layered with chilled creamy milk and golden caramel drizzle.' },
    { name: 'BBQ Chicken Wings (6 pcs)', category: 'Snacks', price: 160, rating: 4.7, preparationTime: 11, stock: 55, vendorId: 'Stall-1', vendorName: 'Galaxy Diner', isVeg: false, popular: false, demandLevel: 'MEDIUM', image: 'https://images.unsplash.com/photo-1527477378332-ef2898fcba7b?w=800&auto=format&fit=crop&q=80', description: 'Crispy fried wings smothered in smokey honey hickory barbecue sauce.' },
    { name: 'Veg Hakka Noodles Box', category: 'Meals', price: 110, rating: 4.5, preparationTime: 9, stock: 65, vendorId: 'Stall-7', vendorName: 'Umami Street', isVeg: true, popular: false, demandLevel: 'MEDIUM', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80', description: 'Wok-tossed noodles with shredded bell peppers, cabbage, scallions and soy.' },
    { name: 'Warm Churros with Dulce De Leche', category: 'Desserts', price: 95, rating: 4.9, preparationTime: 6, stock: 70, vendorId: 'Stall-6', vendorName: 'Sugar Nebula', isVeg: true, popular: true, demandLevel: 'HIGH', image: 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=800&auto=format&fit=crop&q=80', description: 'Four crispy cinnamon-sugar dusted churro batons served with warm dipping dip.' },
    { name: 'Classic Fresh Lemonade', category: 'Drinks', price: 40, rating: 4.4, preparationTime: 2, stock: 200, vendorId: 'Stall-5', vendorName: 'Neon Sips', isVeg: true, popular: true, demandLevel: 'HIGH', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80', description: 'Freshly squeezed lemons, mint sprig, rock salt and chilled spring water.' },
    { name: 'Butter Chicken Rice Platter', category: 'Meals', price: 190, rating: 4.9, preparationTime: 10, stock: 45, vendorId: 'Stall-8', vendorName: 'Kathi Express', isVeg: false, popular: true, demandLevel: 'HIGH', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80', description: 'Velvety makhani gravy with tender tandoori chicken chunks and cumin basmati rice.' },
    { name: 'Molten Choco Lava Cake', category: 'Desserts', price: 110, rating: 4.8, preparationTime: 5, stock: 60, vendorId: 'Stall-6', vendorName: 'Sugar Nebula', isVeg: true, popular: true, demandLevel: 'MEDIUM', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80', description: 'Warm Belgian dark chocolate cake with an erupting molten fudge core.' },
    { name: 'Watermelon Basil Cooler', category: 'Drinks', price: 65, rating: 4.6, preparationTime: 3, stock: 90, vendorId: 'Stall-5', vendorName: 'Neon Sips', isVeg: true, popular: false, demandLevel: 'LOW', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&auto=format&fit=crop&q=80', description: 'Hydrating cold-pressed watermelon juice muddled with Thai holy basil.' }
  ];

  const createdFood = await Food.insertMany(foodData);

  // 4. Create 10 Games
  const gamesData = [
    {
      name: 'Cyber Reflex Tap',
      category: 'Arcade',
      price: 0,
      duration: '30 sec',
      highScore: 4800,
      topPlayer: 'Alex Rivers',
      availability: 'AVAILABLE',
      xpReward: 80,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
      description: 'Rapid reflex clicker test! Tap glowing neon nodes before they vanish. Earn real XP!',
      location: { lat: 12.9720, lng: 77.5950, zone: 'Zone C - Arcade Galaxy' }
    },
    {
      name: 'Neon Velocity Racer',
      category: 'Racing',
      price: 60,
      duration: '15 mins',
      highScore: 92400,
      topPlayer: 'Sora Takahashi',
      availability: 'AVAILABLE',
      xpReward: 120,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1552824796-039c36c64ba8?w=800&auto=format&fit=crop&q=80',
      description: 'Force feedback hydraulic simulator cockpit drifting down cyber highway tracks.',
      location: { lat: 12.9722, lng: 77.5952, zone: 'Zone C - Arcade Galaxy' }
    },
    {
      name: 'Zero-G VR Space Raider',
      category: 'VR',
      price: 90,
      duration: '20 mins',
      highScore: 34500,
      topPlayer: 'Jin Woo',
      availability: 'AVAILABLE',
      xpReward: 150,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=800&auto=format&fit=crop&q=80',
      description: 'Full body 360-degree wireless VR headset battling orbital drones with haptic feedback.',
      location: { lat: 12.9725, lng: 77.5948, zone: 'Zone C - Arcade Galaxy' }
    },
    {
      name: 'Quantum Laser Sniper',
      category: 'Shooting',
      price: 50,
      duration: '10 mins',
      highScore: 18200,
      topPlayer: 'Chloe Kim',
      availability: 'AVAILABLE',
      xpReward: 90,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
      description: 'Precision recoil light guns targeting moving holographic targets across three stages.',
      location: { lat: 12.9718, lng: 77.5945, zone: 'Zone C - Arcade Galaxy' }
    },
    {
      name: 'Retro Pinball Nova',
      category: 'Arcade',
      price: 30,
      duration: '10 mins',
      highScore: 560000,
      topPlayer: 'Devon Patel',
      availability: 'AVAILABLE',
      xpReward: 60,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      description: 'Authentic 90s mechanical pinball table with multi-ball mayhem and jackpot chimes.',
      location: { lat: 12.9720, lng: 77.5942, zone: 'Zone C - Arcade Galaxy' }
    },
    {
      name: 'Cosmic Bowling Alley',
      category: 'Bowling',
      price: 80,
      duration: '30 mins',
      highScore: 288,
      topPlayer: 'Leo Vance',
      availability: 'AVAILABLE',
      xpReward: 110,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80',
      description: 'Glow-in-the-dark 10-pin bowling lanes with interactive floor graphics and squad scoring.',
      location: { lat: 12.9730, lng: 77.5965, zone: 'Zone C - Arcade Galaxy' }
    },
    {
      name: 'Cyber Strike Air Hockey',
      category: 'Multiplayer',
      price: 40,
      duration: '10 mins',
      highScore: 42,
      topPlayer: 'Maya Chen',
      availability: 'AVAILABLE',
      xpReward: 70,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
      description: 'Ultrasonic air cushion table with curved goals and high-speed puck trajectory.',
      location: { lat: 12.9723, lng: 77.5940, zone: 'Zone C - Arcade Galaxy' }
    },
    {
      name: 'Synthwave Rhythm Beat Saber',
      category: 'VR',
      price: 70,
      duration: '15 mins',
      highScore: 89000,
      topPlayer: 'Kai Tanaka',
      availability: 'AVAILABLE',
      xpReward: 130,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80',
      description: 'Slash neon music cubes to the beat of heavy EDM drops and electronic bass.',
      location: { lat: 12.9727, lng: 77.5950, zone: 'Zone C - Arcade Galaxy' }
    },
    {
      name: 'Escape Matrix Chamber',
      category: 'Puzzle',
      price: 150,
      duration: '45 mins',
      highScore: 1840,
      topPlayer: 'Alex Rivers',
      availability: 'AVAILABLE',
      xpReward: 250,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      description: 'Collaborative squad puzzle escape room. Decode cryptographic terminal riddles.',
      location: { lat: 12.9732, lng: 77.5945, zone: 'Zone C - Arcade Galaxy' }
    },
    {
      name: 'Basketball Shootout Mania',
      category: 'Arcade',
      price: 35,
      duration: '5 mins',
      highScore: 142,
      topPlayer: 'Jordan Reed',
      availability: 'AVAILABLE',
      xpReward: 65,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
      description: 'Double hoops with moving backboard. Sink as many 3-pointers as you can in 60 seconds.',
      location: { lat: 12.9719, lng: 77.5938, zone: 'Zone C - Arcade Galaxy' }
    }
  ];

  const createdGames = await Game.insertMany(gamesData);

  // 5. Create 10 Live Events
  const eventsData = [
    {
      title: 'Neon Horizon EDM Festival',
      description: 'Headlined by DJ KRYPTON. Pulsating bass, pyrotechnics, laser light matrix, and glow sticks.',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
      category: 'DJ',
      date: 'Today',
      startTime: '19:30',
      endTime: '22:00',
      location: { name: 'Starlight Main Arena', lat: 12.9730, lng: 77.5960, zone: 'Zone D - Festival Grounds' },
      capacity: 600,
      attendees: 380,
      price: 0,
      status: 'LIVE',
      featuredArtist: 'DJ Krypton & SoundWave Collective'
    },
    {
      title: 'Campus Beatbox Championship',
      description: 'Electrifying 1-on-1 vocal percussion battle featuring top college talents.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
      category: 'Competitions',
      date: 'Today',
      startTime: '20:15',
      endTime: '21:30',
      location: { name: 'Amphitheater Stage', lat: 12.9715, lng: 77.5965, zone: 'Zone D - Festival Grounds' },
      capacity: 300,
      attendees: 210,
      price: 0,
      status: 'STARTING_SOON',
      featuredArtist: 'MC Echo'
    },
    {
      title: 'Cosmic Drone & Fireworks Display',
      description: '500 synchronized LED drones painting celestial animations across the night sky.',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80',
      category: 'Shows',
      date: 'Today',
      startTime: '21:45',
      endTime: '22:15',
      location: { name: 'Skyline Vista Overlook', lat: 12.9705, lng: 77.5955, zone: 'Zone B - Skyline Vista' },
      capacity: 1200,
      attendees: 850,
      price: 0,
      status: 'AVAILABLE',
      featuredArtist: 'Funverse Pyro Tech Team'
    },
    {
      title: 'Midnight Stand-Up Comedy Slam',
      description: 'Hilarious punchlines, crowd work, and campus roasts by trending student comedians.',
      image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop&q=80',
      category: 'Open Mic',
      date: 'Tomorrow',
      startTime: '18:00',
      endTime: '19:30',
      location: { name: 'The Laughing Pod', lat: 12.9722, lng: 77.5935, zone: 'Zone B - Flavor Hub' },
      capacity: 150,
      attendees: 90,
      price: 50,
      status: 'AVAILABLE',
      featuredArtist: 'Rahul Dua & Friends'
    },
    {
      title: 'K-Pop & Urban Dance Showdown',
      description: 'High-octane synchronized choreography contest with live audience voting.',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
      category: 'Dance',
      date: 'Tomorrow',
      startTime: '17:00',
      endTime: '19:00',
      location: { name: 'Starlight Main Arena', lat: 12.9730, lng: 77.5960, zone: 'Zone D - Festival Grounds' },
      capacity: 500,
      attendees: 310,
      price: 0,
      status: 'AVAILABLE',
      featuredArtist: 'Nova Dance Crew'
    },
    {
      title: 'Acoustic Sunset Unplugged',
      description: 'Chill indie folk covers under the glowing fairy-lit canopy by the lake.',
      image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
      category: 'Music',
      date: 'Tomorrow',
      startTime: '18:30',
      endTime: '20:00',
      location: { name: 'Lakeside Pavilion', lat: 12.9745, lng: 77.5950, zone: 'Zone B - Skyline Vista' },
      capacity: 250,
      attendees: 140,
      price: 0,
      status: 'AVAILABLE',
      featuredArtist: 'Tara & The Waves'
    },
    {
      title: 'Retro Gaming Cosplay Parade',
      description: 'Walk with your favorite video game characters, take photos, and win best costume prizes.',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
      category: 'Shows',
      date: 'This Weekend',
      startTime: '16:00',
      endTime: '17:30',
      location: { name: 'Central Boulevard', lat: 12.9720, lng: 77.5945, zone: 'Amusement Hub' },
      capacity: 800,
      attendees: 420,
      price: 0,
      status: 'AVAILABLE',
      featuredArtist: 'Funverse Cosplay Guild'
    },
    {
      title: 'Hypnotic Illusionist Stage Show',
      description: 'Mind reading, levitation stunts, and audience interaction illusions.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      category: 'Shows',
      date: 'This Weekend',
      startTime: '19:00',
      endTime: '20:30',
      location: { name: 'Amphitheater Stage', lat: 12.9715, lng: 77.5965, zone: 'Zone D - Festival Grounds' },
      capacity: 350,
      attendees: 290,
      price: 40,
      status: 'AVAILABLE',
      featuredArtist: 'Illusionist Xavier'
    },
    {
      title: 'Rap Cypher & Freestyle Battle',
      description: 'Underground freestyle rhyming duel on open mics with crowd judged eliminations.',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=80',
      category: 'Open Mic',
      date: 'This Weekend',
      startTime: '20:30',
      endTime: '22:00',
      location: { name: 'The Laughing Pod', lat: 12.9722, lng: 77.5935, zone: 'Zone B - Flavor Hub' },
      capacity: 180,
      attendees: 150,
      price: 0,
      status: 'AVAILABLE',
      featuredArtist: 'Street Cypher Crew'
    },
    {
      title: 'Latin Fiesta Salsa Social',
      description: 'Free beginner salsa workshop followed by open social dancing under the lanterns.',
      image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&auto=format&fit=crop&q=80',
      category: 'Dance',
      date: 'This Weekend',
      startTime: '18:00',
      endTime: '20:00',
      location: { name: 'Baja Cantina Terrace', lat: 12.9716, lng: 77.5946, zone: 'Zone B - Flavor Hub' },
      capacity: 120,
      attendees: 80,
      price: 0,
      status: 'AVAILABLE',
      featuredArtist: 'Salsa Bros'
    }
  ];

  const createdEvents = await Event.insertMany(eventsData);

  // 6. Create 20 Challenges
  const challengesData = [
    { title: '📸 Photo Quest at Ferris Wheel', description: 'Take a creative photo at the Starlight Ferris Wheel and tag your squad.', type: 'DAILY', xpReward: 100, category: 'Photography', icon: '📸', requirementCount: 1 },
    { title: '🎢 Adrenaline Addict', description: 'Ride the HyperCoaster 360 or Quantum Drop Tower today.', type: 'DAILY', xpReward: 150, category: 'Adventure', icon: '🎢', requirementCount: 1 },
    { title: '🍔 Flavor Explorer', description: 'Order any meal or burger from the Food Court.', type: 'DAILY', xpReward: 120, category: 'Food', icon: '🍔', requirementCount: 1 },
    { title: '🎮 Arcade High Scorer', description: 'Score over 1,000 points in Cyber Reflex Tap.', type: 'DAILY', xpReward: 100, category: 'Games', icon: '🎮', requirementCount: 1 },
    { title: '🎤 Stage Cheerleader', description: 'RSVP and attend the Neon Horizon EDM Festival.', type: 'DAILY', xpReward: 130, category: 'Music', icon: '🎤', requirementCount: 1 },
    { title: '🥤 Refreshment Recharge', description: 'Try the Electric Blue Slush or Lemonade.', type: 'DAILY', xpReward: 80, category: 'Food', icon: '🥤', requirementCount: 1 },
    { title: '🤖 AI Journey Starter', description: 'Generate a personalized plan using PLAN MY FUN.', type: 'DAILY', xpReward: 100, category: 'Explorer', icon: '🤖', requirementCount: 1 },
    
    // Weekly Challenges
    { title: '🎢 Ride Master', description: 'Complete 3 different thrilling rides in one week.', type: 'WEEKLY', xpReward: 500, category: 'Adventure', icon: '🏆', requirementCount: 3 },
    { title: '🍕 Gourmet Tour', description: 'Order food from 3 different food stalls.', type: 'WEEKLY', xpReward: 400, category: 'Food', icon: '🍕', requirementCount: 3 },
    { title: '🕹️ Retro Gamer Legend', description: 'Play 5 different games in Arcade Galaxy.', type: 'WEEKLY', xpReward: 450, category: 'Games', icon: '🕹️', requirementCount: 5 },
    { title: '🗺️ Park Explorer 360', description: 'Check-in to all 4 zones on the interactive Smart Map.', type: 'WEEKLY', xpReward: 550, category: 'Explorer', icon: '🗺️', requirementCount: 4 },
    { title: '🌟 Social Butterfly', description: 'Add 3 new friends to your amusement squad.', type: 'WEEKLY', xpReward: 350, category: 'Social', icon: '🌟', requirementCount: 3 },
    { title: '💰 Smart Budgeteer', description: 'Complete 2 activities without exceeding ₹250.', type: 'WEEKLY', xpReward: 300, category: 'Budget', icon: '💰', requirementCount: 2 },
    { title: '🔥 5-Day Streak Hero', description: 'Log in and play for 5 consecutive days.', type: 'WEEKLY', xpReward: 600, category: 'Streak', icon: '🔥', requirementCount: 5 },

    // Squad Challenges
    { title: '👥 Team Challenge', description: 'Complete 5 activities together with your squad.', type: 'SQUAD', xpReward: 1000, category: 'Squad', icon: '👥', requirementCount: 5 },
    { title: '🏁 Nitro Grand Prix Squad', description: 'Race with your squad members on Neon Drift Go-Karts.', type: 'SQUAD', xpReward: 800, category: 'Squad', icon: '🏁', requirementCount: 1 },
    { title: '🍕 Squad Feast Extravaganza', description: 'Place a group food order of ₹400 or more.', type: 'SQUAD', xpReward: 750, category: 'Squad', icon: '🍕', requirementCount: 1 },
    { title: '🧩 Escape Room Hackers', description: 'Escape the Matrix Chamber with your full squad.', type: 'SQUAD', xpReward: 1200, category: 'Squad', icon: '🧩', requirementCount: 1 },
    { title: '🗳️ Squad Democracy', description: 'Participate in a squad vote for What Should We Do?', type: 'SQUAD', xpReward: 500, category: 'Squad', icon: '🗳️', requirementCount: 1 },
    { title: '🎉 Night Festival VIPs', description: 'Attend the EDM Main Stage show together with 2 friends.', type: 'SQUAD', xpReward: 900, category: 'Squad', icon: '🎉', requirementCount: 1 }
  ];

  await Challenge.insertMany(challengesData);

  // 7. Create 20 Rewards
  const rewardsData = [
    { name: '₹50 Wallet Bonus Cash', description: 'Instant ₹50 bonus credits added directly to your smart wallet!', xpRequired: 300, type: 'WALLET_CASH', value: '₹50', icon: '💰', code: 'CASH50-XPDROP' },
    { name: '₹100 Wallet Bonus Cash', description: 'Instant ₹100 bonus credits for rides, games, or food court snacks.', xpRequired: 600, type: 'WALLET_CASH', value: '₹100', icon: '💵', code: 'CASH100-VIP' },
    { name: '25% OFF Any Thrill Ride', description: 'Get 25% discount voucher on HyperCoaster or Quantum Drop.', xpRequired: 400, type: 'DISCOUNT', value: '25% OFF', icon: '🎢', code: 'RIDE25-PERK' },
    { name: 'Free Truffle Fries Voucher', description: 'Claim a piping hot portion of Crispy Truffle Fries at Fries & Co.', xpRequired: 450, type: 'DISCOUNT', value: 'FREE FRIES', icon: '🍟', code: 'FREEFRIES-HOT' },
    { name: 'Buy 1 Get 1 Pizza Slice', description: 'Valid at Pizza Inferno on Firestorm Pepperoni or Margherita.', xpRequired: 500, type: 'DISCOUNT', value: 'BOGO PIZZA', icon: '🍕', code: 'BOGO-SLICE' },
    { name: 'Free Electric Blue Mocktail', description: 'One complimentary chilled neon drink from Neon Sips.', xpRequired: 350, type: 'DISCOUNT', value: 'FREE DRINK', icon: '🥤', code: 'BLUE-SIP-GIFT' },
    { name: 'FastTrack VIP Ride Pass', description: 'Skip the standard queue once at any thrill ride today.', xpRequired: 800, type: 'FREE_PASS', value: 'FAST TRACK', icon: '⚡', code: 'FASTPASS-VIP' },
    { name: 'Free VR Arena Session', description: 'Unlock one full complimentary match in Zero-G VR Space Raider.', xpRequired: 700, type: 'FREE_PASS', value: 'FREE VR', icon: '🥽', code: 'VRFREE-GALAXY' },
    { name: 'Free Cosmic Bowling Game', description: '10 frames of glow-in-the-dark bowling with rental shoes included.', xpRequired: 650, type: 'FREE_PASS', value: 'FREE GAME', icon: '🎳', code: 'BOWL-STRIKE' },
    { name: 'Funverse Neon Badge Pin', description: 'Exclusive physical holographic enamel pin collected at Guest Relations.', xpRequired: 550, type: 'MERCH', value: 'PIN MERCH', icon: '🎖️', code: 'BADGE-COLLECTOR' },
    { name: 'Funverse Glow Hoodie (50% OFF)', description: '50% off discount voucher at the Official Merch Store.', xpRequired: 900, type: 'DISCOUNT', value: '50% OFF', icon: '🧥', code: 'HOODIE-50' },
    { name: 'VIP Festival Front-Row Pass', description: 'Reserved front-stage golden circle wristband for tonight EDM concert.', xpRequired: 750, type: 'FREE_PASS', value: 'VIP ENTRY', icon: '🎫', code: 'EDM-VIP-WRIST' },
    { name: 'Ferris Wheel Sunset Private Cabin', description: 'Reserved private cabin for you and your squad during golden hour.', xpRequired: 600, type: 'FREE_PASS', value: 'CABIN PASS', icon: '🎡', code: 'SUNSET-CABIN' },
    { name: '₹150 Super Wallet Credit', description: 'Huge balance reload for heavy park adventurers.', xpRequired: 1000, type: 'WALLET_CASH', value: '₹150', icon: '💎', code: 'MEGA-150-CASH' },
    { name: 'Unlimited Arcade Hour Pass', description: 'Play all standard arcade cabinets free for 60 consecutive minutes.', xpRequired: 1200, type: 'FREE_PASS', value: '1 HR ARCADE', icon: '🕹️', code: 'ARCADE-GOD' },
    { name: 'Dessert Deluxe Platter Voucher', description: 'Churros + Choco Lava Cake + Galaxy Cone tasting platter.', xpRequired: 850, type: 'DISCOUNT', value: 'SWEET FEAST', icon: '🍰', code: 'SUGAR-BLISS' },
    { name: 'Go-Kart Grand Prix Fast-Lane', description: 'Immediate pole position entry on Neon Drift Go-Karts.', xpRequired: 500, type: 'FREE_PASS', value: 'POLE POSITION', icon: '🏎️', code: 'DRIFT-SPEED' },
    { name: 'Double XP Booster (2 Hours)', description: 'Double all challenge and gaming XP earned over the next 2 hours.', xpRequired: 400, type: 'BADGE', value: '2X XP BUFF', icon: '✨', code: 'BUFF-DOUBLEXP' },
    { name: 'Exclusive "Cyber Legend" Title', description: 'Custom glowing profile flair visible on global leaderboards.', xpRequired: 1500, type: 'BADGE', value: 'TITLE FLAIR', icon: '👑', code: 'LEGEND-FLAIR' },
    { name: 'All-Day Park Sovereign Pass', description: 'Free entry to all paid games and events for the entire day.', xpRequired: 2500, type: 'FREE_PASS', value: 'SOVEREIGN', icon: '🏆', code: 'SOVEREIGN-360' }
  ];

  await Reward.insertMany(rewardsData);

  // 8. Sample Reviews
  await Review.insertMany([
    { userId: createdUsers[0]._id, userName: 'Alex Rivers', itemId: createdRides[0]._id, itemType: 'RIDE', rating: 5, comment: 'The double inverted loop on HyperCoaster is insane! Best ride in the park.' },
    { userId: createdUsers[2]._id, userName: 'Maya Chen', itemId: createdFood[0]._id, itemType: 'FOOD', rating: 5, comment: 'Best burger I have ever eaten at an amusement park. Worth every rupee!' },
    { userId: createdUsers[5]._id, userName: 'Leo Vance', itemId: createdGames[0]._id, itemType: 'GAME', rating: 5, comment: 'Cyber Reflex is addictive! Love seeing my score on the live leaderboard.' },
    { userId: createdUsers[4]._id, userName: 'Zara Al-Mansoor', itemId: createdEvents[0]._id, itemType: 'EVENT', rating: 5, comment: 'DJ Krypton brought the house down! Laser show was spectacular.' }
  ]);

  console.log('[SEED] ✅ Seeding finished successfully! Database is loaded with rich demo data.');
};

// Check if running directly as a CLI script
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}
