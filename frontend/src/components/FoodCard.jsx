import React from 'react';
import { Star, Clock, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FoodCard = ({ food }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const cartItem = cartItems.find(i => i._id === food._id);

  return (
    <div className="glass-panel glass-card-hover rounded-3xl overflow-hidden flex flex-col group border border-white/10 hover:border-pink-500/50">
      {/* Food Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131838] via-transparent to-black/30"></div>

        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-purple-600/80 text-white backdrop-blur-md">
            {food.category}
          </span>
          {food.isVeg && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/40 backdrop-blur-md">
              🟢 VEG
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 text-xs font-bold text-slate-200">
          <Clock className="w-3.5 h-3.5 text-pink-400" />
          <span>{food.preparationTime}m prep</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="font-gaming font-bold text-base text-white group-hover:text-pink-400 transition-colors">
              {food.name}
            </h3>
            <span className="text-base font-black text-yellow-400">
              ₹{food.price}
            </span>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 mb-3">
            {food.description || `${food.vendorName} specialty prepared fresh on demand.`}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <strong className="text-white">{food.rating}</strong> ({food.reviewsCount || 45})
            </span>
            <span className="text-[11px] text-cyan-400 font-medium">
              {food.vendorName}
            </span>
          </div>
        </div>

        {/* Add To Cart Controls */}
        {cartItem ? (
          <div className="flex items-center justify-between bg-purple-600/30 border border-purple-500/50 rounded-xl p-1">
            <button
              onClick={() => updateQuantity(food._id, -1)}
              className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-gaming font-extrabold text-sm text-white px-2">
              {cartItem.quantity} in Cart
            </span>
            <button
              onClick={() => updateQuantity(food._id, 1)}
              className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(food)}
            className="w-full py-2 px-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-pink-600 text-white transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD TO CART</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
