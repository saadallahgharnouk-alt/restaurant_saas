import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import EnhancedLayout       from './components/EnhancedLayout';
import EnhancedDashboard    from './app/enhanced-dashboard';
import AnalyticsDashboard   from './components/AnalyticsDashboard';
import MenuManagement       from './app/menu/menupage';
import EnhancedMenuPage     from './app/menu/enhanced-menu';
import OrderCart            from './components/OrderCart';
import RestaurantList       from './pages/RestaurantList';
import KitchenBoard         from './app/kbs';
import QRStudio             from './app/qr';
import ScanMenu             from './app/scan-menu';

/**
 * Two parallel routing trees:
 *
 *   /m/:restaurantId   → public, mobile-first customer menu. NO admin chrome.
 *   everything else    → admin app inside EnhancedLayout (top nav + footer).
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public QR scan route — no admin shell */}
        <Route path="/m/:restaurantId" element={<ScanMenu />} />

        {/* Admin app */}
        <Route
          path="*"
          element={
            <EnhancedLayout>
              <Routes>
                <Route path="/"             element={<EnhancedDashboard />} />
                <Route path="/restaurants"  element={<RestaurantList />} />
                <Route path="/menu"         element={<EnhancedMenuPage />} />
                <Route path="/kitchen"      element={<KitchenBoard />} />
                <Route path="/menu/manage"  element={<MenuManagement />} />
                <Route path="/order"        element={<OrderCart />} />
                <Route path="/analytics"    element={<AnalyticsDashboard />} />
                <Route path="/qr"           element={<QRStudio />} />
                <Route path="*"             element={<NotFound />} />
              </Routes>
            </EnhancedLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="page">
      <div className="empty-state">
        <span style={{ fontSize: 32 }}>◈</span>
        <h2 className="page-title" style={{ fontSize: 20 }}>Page not found</h2>
        <p className="page-sub">That route doesn't exist.</p>
      </div>
    </div>
  );
}
