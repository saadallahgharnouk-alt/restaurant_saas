import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import MenuCard from '../../components/MenuCard';

const menuData = [
  {
    id: 1,
    name: 'Classic Burger',
    category: 'Burgers',
    price: 12.99,
    discount: 10,
    image: 'https://via.placeholder.com/200?text=Burger',
    description: 'Juicy beef patty with fresh toppings',
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    category: 'Pizza',
    price: 14.99,
    discount: 0,
    image: 'https://via.placeholder.com/200?text=Pizza',
    description: 'Fresh mozzarella and classic pepperoni',
  },
  {
    id: 3,
    name: 'Caesar Salad',
    category: 'Salads',
    price: 9.99,
    discount: 15,
    image: 'https://via.placeholder.com/200?text=Salad',
    description: 'Crisp romaine with parmesan cheese',
  },
  {
    id: 4,
    name: 'Grilled Salmon',
    category: 'Seafood',
    price: 18.99,
    discount: 0,
    image: 'https://via.placeholder.com/200?text=Salmon',
    description: 'Fresh Atlantic salmon fillet',
  },
  {
    id: 5,
    name: 'Spaghetti Carbonara',
    category: 'Pasta',
    price: 13.99,
    discount: 20,
    image: 'https://via.placeholder.com/200?text=Pasta',
    description: 'Traditional Italian pasta with creamy sauce',
  },
  {
    id: 6,
    name: 'Chocolate Cake',
    category: 'Desserts',
    price: 7.99,
    discount: 0,
    image: 'https://via.placeholder.com/200?text=Cake',
    description: 'Rich and decadent chocolate dessert',
  },
];

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [cart, setCart] = React.useState([]);

  const categories = ['All', ...new Set(menuData.map(item => item.category))];

  const filteredMenu = menuData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">Our Menu</h1>
          <p className="text-zinc-400 text-lg">Delicious dishes crafted with care</p>
        </motion.div>

        {/* Search & Filter */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="relative"
          >
            <Search className="absolute left-4 top-3 text-zinc-400" size={20} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </motion.div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="text-zinc-400 flex-shrink-0" size={20} />
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <MenuCard item={item} onAddToCart={handleAddToCart} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-zinc-400 text-lg">No items found. Try a different search or category.</p>
            </div>
          )}
        </motion.div>

        {/* Cart Preview */}
        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors"
          >
            Cart ({cart.length} items)
          </motion.div>
        )}
      </div>
    </div>
  );
}
