import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';

export default function OrderCart() {
  const [cart, setCart] = React.useState([]);
  const [promoCode, setPromoCode] = React.useState('');
  const [promoDiscount, setPromoDiscount] = React.useState(0);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const discount = subtotal * (promoDiscount / 100);
  const total = subtotal + tax - discount;

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => (item.id === id ? { ...item, quantity: newQty } : item)));
    }
  };

  const applyPromo = () => {
    // Dummy promo codes
    const promoCodes = {
      'SAVE10': 10,
      'SAVE20': 20,
      'WELCOME': 15,
    };
    const discount = promoCodes[promoCode.toUpperCase()] || 0;
    if (discount > 0) {
      setPromoDiscount(discount);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    console.log('Order placed:', { cart, total, promoCode });
    alert(`Order placed! Total: $${total.toFixed(2)}`);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
          <ShoppingCart className="text-indigo-400" size={36} />
          Your Order
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-800/50 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Items ({cart.length})</h2>

              <AnimatePresence>
                {cart.length === 0 ? (
                  <motion.div className="text-center py-12">
                    <ShoppingCart size={48} className="mx-auto text-zinc-600 mb-4" />
                    <p className="text-zinc-400">Your cart is empty. Add items to get started!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-4 bg-zinc-700/50 p-4 rounded-xl"
                      >
                        <img
                          src={item.image || 'https://via.placeholder.com/80'}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{item.name}</h3>
                          <p className="text-sm text-zinc-400">${item.price.toFixed(2)} each</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-zinc-600 rounded-lg p-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-zinc-500 rounded"
                          >
                            <Minus size={16} className="text-white" />
                          </button>
                          <span className="w-8 text-center text-white font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-zinc-500 rounded"
                          >
                            <Plus size={16} className="text-white" />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="text-right">
                          <p className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                          <button
                            onClick={() => updateQuantity(item.id, 0)}
                            className="text-red-400 hover:text-red-300 mt-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Summary & Checkout */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-zinc-300">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount ({promoDiscount}%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-zinc-600 pt-3 flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="e.g. SAVE10"
                  className="flex-1 bg-zinc-700 text-white px-3 py-2 rounded-lg placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  onClick={applyPromo}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Apply
                </button>
              </div>
              <p className="text-xs text-zinc-400 mt-1">Try: SAVE10, SAVE20, WELCOME</p>
            </div>

            {/* Checkout Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-zinc-600 disabled:to-zinc-700 text-white py-3 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} /> Checkout
            </motion.button>

            <p className="text-xs text-zinc-400 text-center mt-3">
              Safe, secure checkout. We accept all major payment methods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
