import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FoodCard from '../components/FoodCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  Utensils,
  Search,
  ShoppingBag,
  Zap,
  Clock,
  CheckCircle2,
  Trash2,
  X,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Snacks', 'Meals', 'Desserts', 'Drinks'];

const FoodPage = () => {
  const { cartItems, totalAmount, clearCart, removeFromCart } = useCart();
  const { user, updateWalletAndXp } = useAuth();

  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [under100, setUnder100] = useState(false);
  const [fastest, setFastest] = useState(false);
  const [search, setSearch] = useState('');

  // Cart Drawer
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [ordering, setOrdering] = useState(false);

  const fetchFood = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (under100) params.under100 = 'true';
      if (fastest) params.fastest = 'true';
      if (search) params.search = search;

      const res = await api.get('/food', { params });
      setFoodItems(res.data);
    } catch (err) {
      console.error('[FOOD FETCH ERROR]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFood();
  }, [selectedCategory, under100, fastest]);

  const handleCheckout = async () => {
    if (cartItems.length === 0 || ordering) return;
    setOrdering(true);

    try {
      const res = await api.post('/food/order', {
        items: cartItems,
        pickupCounter: 'Counter 2 (Galaxy Diner Hub)'
      });

      updateWalletAndXp(res.data.newWalletBalance, res.data.newXp, res.data.newLevel);
      setOrderSuccess(res.data.order);
      clearCart();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed. Please check wallet balance.');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-yellow-400 text-xs font-black uppercase tracking-wider mb-1">
            <Utensils className="w-4 h-4" />
            <span>Galaxy Food Court & Dining</span>
          </div>
          <h1 className="font-gaming font-black text-3xl sm:text-4xl text-white">
            Food & Quick Bites
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Order ahead via smart wallet, skip long kiosk queues, and pick up hot!
          </p>
        </div>

        {/* View Cart Floating Trigger */}
        {cartItems.length > 0 && (
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-gaming font-extrabold text-xs shadow-neon-pink hover:scale-105 transition-all self-start md:self-auto"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View Cart ({cartItems.length}) • ₹{totalAmount}</span>
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-purple'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="h-6 w-[1px] bg-white/20 mx-2 shrink-0"></div>

        {/* Quick Filter Buttons */}
        <button
          onClick={() => setUnder100(!under100)}
          className={`px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            under100
              ? 'bg-yellow-500 text-black font-black'
              : 'bg-white/5 border border-white/10 text-yellow-400 hover:bg-white/10'
          }`}
        >
          🪙 Under ₹100
        </button>

        <button
          onClick={() => setFastest(!fastest)}
          className={`px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            fastest
              ? 'bg-cyan-500 text-black font-black'
              : 'bg-white/5 border border-white/10 text-cyan-400 hover:bg-white/10'
          }`}
        >
          ⚡ Fastest Food
        </button>
      </div>

      {/* Food Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading food court menu...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foodItems.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}

      {/* Cart Sliding Drawer */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md h-full glass-panel bg-[#131838] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-pink-400" />
                  <h3 className="font-gaming font-extrabold text-xl text-white">
                    Food Court Cart
                  </h3>
                </div>
                <button
                  onClick={() => setCartDrawerOpen(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-sm text-white">{item.name}</div>
                      <div className="text-xs text-yellow-400 font-semibold">
                        {item.quantity}x @ ₹{item.price} = ₹{item.quantity * item.price}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-slate-400 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Section */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Wallet Balance:</span>
                <span className="font-bold text-yellow-400">₹{user?.walletBalance || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-white">
                <span>Order Total:</span>
                <span className="font-gaming font-black text-2xl text-yellow-300">₹{totalAmount}</span>
              </div>
              <div className="text-[11px] text-green-400 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                Earn +{Math.round(totalAmount * 0.2)} XP on this order!
              </div>

              <button
                onClick={handleCheckout}
                disabled={ordering}
                className="w-full py-3.5 rounded-2xl font-gaming font-extrabold text-sm bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white shadow-neon-pink hover:scale-102 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{ordering ? 'PROCESSING ORDER...' : 'CHECKOUT WITH WALLET'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel bg-[#131838] border border-green-500/40 rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-green-500/20 text-green-400 mx-auto flex items-center justify-center text-3xl mb-3">
              🎉
            </div>
            <h3 className="font-gaming font-black text-2xl text-white mb-1">
              ORDER CONFIRMED!
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Your food is being prepared fresh. Show your order ID at pickup.
            </p>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2 text-left text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Number:</span>
                <span className="font-mono font-bold text-cyan-400">{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pickup Counter:</span>
                <span className="font-bold text-white">{orderSuccess.pickupCounter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Ready Time:</span>
                <span className="font-bold text-yellow-400">12 minutes</span>
              </div>
            </div>

            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full py-2.5 rounded-xl font-extrabold text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-pink"
            >
              Awesome, Got It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodPage;
