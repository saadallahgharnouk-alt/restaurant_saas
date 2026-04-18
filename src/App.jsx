import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import EnhancedLayout from './components/EnhancedLayout';
import EnhancedDashboard from './app/enhanced-dashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import MenuManagement from './app/menu/menupage';
import EnhancedMenuPage from './app/menu/enhanced-menu';
import RestaurantList from './pages/RestaurantList';
import OrderCart from './components/OrderCart';

export default function App() {
  return (
    <Router>
      <EnhancedLayout>
        <Routes>
          <Route path="/" element={<EnhancedDashboard />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/order" element={<OrderCart />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/menu" element={<EnhancedMenuPage />} />
          <Route path="/kitchen" element={<MenuManagement />} />
        </Routes>
      </EnhancedLayout>
    </Router>
  );
}
