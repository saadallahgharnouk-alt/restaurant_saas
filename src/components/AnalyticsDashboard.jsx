import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ icon: Icon, title, value, change, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`relative overflow-hidden rounded-xl p-6 text-white`}
    style={{
      background: `linear-gradient(135deg, ${color}1a 0%, ${color}0a 100%)`,
      border: `1px solid ${color}40`,
    }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-zinc-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
        {change && (
          <p className={`text-xs mt-2 ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last week
          </p>
        )}
      </div>
      <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
        <Icon size={24} style={{ color }} />
      </div>
    </div>
  </motion.div>
);

export default function AnalyticsDashboard() {
  // Sample data
  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales ($)',
        data: [1200, 1900, 1500, 2200, 2800, 3100, 2500],
        borderColor: '#6366f1',
        backgroundColor: '#6366f120',
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: ['Burgers', 'Pizza', 'Pasta', 'Salads', 'Desserts'],
    datasets: [
      {
        label: 'Orders',
        data: [120, 150, 90, 60, 45],
        backgroundColor: ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'],
      },
    ],
  };

  const popularItems = [
    { name: 'Pepperoni Pizza', orders: 248, revenue: '$3,720' },
    { name: 'Classic Burger', orders: 201, revenue: '$2,613' },
    { name: 'Spaghetti Carbonara', orders: 187, revenue: '$2,614' },
    { name: 'Caesar Salad', orders: 156, revenue: '$1,559' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">Analytics Dashboard</h1>
          <p className="text-zinc-400">Real-time insights into your restaurant performance</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value="$12,450"
            change={12}
            color="#10b981"
          />
          <StatCard
            icon={ShoppingCart}
            title="Total Orders"
            value="1,247"
            change={8}
            color="#6366f1"
          />
          <StatCard
            icon={Users}
            title="New Customers"
            value="342"
            change={15}
            color="#f59e0b"
          />
          <StatCard
            icon={Activity}
            title="Avg. Order Value"
            value="$9.98"
            change={-3}
            color="#ec4899"
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Sales Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-zinc-800/50 backdrop-blur rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Weekly Sales Trend</h2>
            <Line data={salesData} options={{ responsive: true, plugins: { legend: { labels: { color: '#a1a1aa' } } } }} />
          </motion.div>

          {/* Popular Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-800/50 backdrop-blur rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Top Items</h2>
            <div className="space-y-3">
              {popularItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-zinc-700/50 p-3 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                    <span className="text-emerald-400 font-bold text-sm">{item.revenue}</span>
                  </div>
                  <div className="w-full bg-zinc-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${(item.orders / 250) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">{item.orders} orders</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-800/50 backdrop-blur rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Orders by Category</h2>
          <div className="h-80">
            <Bar
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#a1a1aa' } } },
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
