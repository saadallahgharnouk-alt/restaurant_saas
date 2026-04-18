import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, QrCode, ShoppingCart, BarChart3 } from 'lucide-react';
import MenuQRGenerator from '../components/MenuQR';

export default function Dashboard() {
  const demoRestaurant = { id: 1, name: 'RestauHub Demo' };

  const features = [
    {
      icon: QrCode,
      title: 'QR Code Menus',
      desc: 'Generate and share QR codes for touchless menu access',
      color: '#6366f1',
    },
    {
      icon: ShoppingCart,
      title: 'Order Management',
      desc: 'Manage orders with discounts, taxes, and promo codes',
      color: '#ec4899',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      desc: 'Track sales, popular items, and customer engagement',
      color: '#10b981',
    },
    {
      icon: Zap,
      title: 'Fast Checkout',
      desc: 'Quick, secure payments with multiple options',
      color: '#f59e0b',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-6xl font-bold text-white mb-4">Welcome to RestauHub</h1>
          <p className="text-xl text-zinc-400 mb-8">
            Modern Restaurant Management System with QR Menus, Analytics & More
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-bold"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-indigo-500 text-indigo-400 rounded-lg font-bold hover:bg-indigo-500/10"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Users, label: 'Active Users', value: '2,543' },
            { icon: ShoppingCart, label: 'Total Orders', value: '12,847' },
            { icon: TrendingUp, label: 'Revenue', value: '$85,420' },
            { icon: Zap, label: 'Uptime', value: '99.9%' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-zinc-800/50 backdrop-blur rounded-xl p-6 border border-zinc-700"
            >
              <stat.icon className="text-indigo-400 mb-3" size={28} />
              <p className="text-zinc-400 text-sm mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-6 border border-zinc-700 hover:border-indigo-500/50 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* QR Generator Demo */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Generate Menu QR Code</h2>
          <MenuQRGenerator restaurant={demoRestaurant} />
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Restaurant?</h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Start managing orders, generating QR menus, and tracking analytics today.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-gray-100"
          >
            Start Free Trial
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
