import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Home, UtensilsCrossed, BarChart3, Zap, QrCode, ShoppingCart } from 'lucide-react';

export default function EnhancedLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: UtensilsCrossed, label: 'Menu', path: '/menu' },
    { icon: ShoppingCart, label: 'Orders', path: '/order' },
    { icon: QrCode, label: 'QR Codes', path: '/qr' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-zinc-900 to-black">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: mobileMenuOpen ? 0 : -320 }}
        className="fixed lg:static w-80 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col p-6 z-40"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white">RestauHub</h1>
          </div>
          <p className="text-xs text-zinc-500">Restaurant Management System</p>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item, idx) => (
            <motion.div key={item.path} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
              <Link
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={20} className="group-hover:text-indigo-400 transition-colors" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-zinc-800 pt-4">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Admin User</p>
              <p className="text-xs text-zinc-500 truncate">admin@example.com</p>
            </div>
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-2xl font-bold text-white">Welcome to RestauHub</h2>

          <div className="flex items-center gap-4">
            <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
              <Zap size={18} /> Get Started
            </button>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-zinc-800 rounded-lg text-zinc-400"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
        />
      )}
    </div>
  );
}
