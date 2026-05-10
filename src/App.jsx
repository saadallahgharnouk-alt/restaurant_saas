import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import EnhancedLayout     from './components/EnhancedLayout';
import Landing            from './app/landing';
import Dashboard          from './app/enhanced-dashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import MenuManagement     from './app/menu/menupage';
import EnhancedMenuPage   from './app/menu/enhanced-menu';
import OrderCart          from './components/OrderCart';
import RestaurantList     from './pages/RestaurantList';
import KitchenBoard       from './app/kbs';
import QRStudio           from './app/qr';
import ScanMenu           from './app/scan-menu';

/**
 * Three routing trees, by intent:
 *
 *   /m/:restaurantId   → public customer menu. NO chrome.
 *   /                  → marketing landing. Admin shell included (with nav
 *                         to actually reach the app).
 *   /dashboard, /qr,
 *   /menu, /kitchen,
 *   /order, /analytics,
 *   /restaurants       → admin app inside EnhancedLayout.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public QR scan — no admin shell */}
        <Route path="/m/:restaurantId" element={<ScanMenu />} />

        {/* Everything else lives inside the admin shell */}
        <Route
          path="*"
          element={
            <EnhancedLayout>
              <Routes>
                <Route path="/"             element={<Landing />} />
                <Route path="/dashboard"    element={<Dashboard />} />
                <Route path="/restaurants"  element={<RestaurantList />} />
                <Route path="/menu"         element={<EnhancedMenuPage />} />
                <Route path="/menu/manage"  element={<MenuManagement />} />
                <Route path="/kitchen"      element={<KitchenBoard />} />
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
        <span style={{ fontSize: 40, color: 'var(--ember)', fontFamily: 'var(--font-display)' }}>◈</span>
        <h2 className="page-title" style={{ fontSize: 28 }}>
          That page <em>isn&rsquo;t set</em> yet.
        </h2>
        <p className="page-sub">The route doesn&rsquo;t exist &mdash; try the nav above.</p>
      </div>
    </div>
  );
}
