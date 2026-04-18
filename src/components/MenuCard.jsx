import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Heart } from 'lucide-react';

export default function MenuCard({ item, onAddToCart }) {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const discountPrice = item.price * (1 - (item.discount || 0) / 100);
  const savings = item.price - discountPrice;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="relative bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-4 overflow-hidden group cursor-pointer"
    >
      {/* Discount Badge */}
      {item.discount && (
        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 z-10">
          <Tag size={12} />
          {item.discount}% OFF
        </div>
      )}

      {/* Image Container */}
      <div className="w-full h-40 bg-zinc-700 rounded-lg mb-3 overflow-hidden group-hover:shadow-lg transition-shadow">
        <img
          src={item.image || 'https://via.placeholder.com/200?text=Menu+Item'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <h3 className="font-semibold text-white mb-1 line-clamp-2">{item.name}</h3>
      <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{item.description}</p>

      {/* Price Section */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-emerald-400">${discountPrice.toFixed(2)}</span>
          {item.discount && (
            <span className="text-xs text-zinc-500 line-through">${item.price.toFixed(2)}</span>
          )}
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`p-2 rounded-lg transition-colors ${
            isFavorite ? 'bg-red-500/20 text-red-400' : 'bg-zinc-700 text-zinc-400 hover:text-red-400'
          }`}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Add to Cart Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onAddToCart(item)}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2 rounded-lg font-medium transition-all duration-200"
      >
        Add to Order
      </motion.button>
    </motion.div>
  );
}
