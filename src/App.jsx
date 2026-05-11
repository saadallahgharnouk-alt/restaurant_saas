import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import { AuthProvider, AuthGate } from './lib/auth';
import { ContentProvider } from './lib/content-store';

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
import ContentCMS         from './app/admin/content';

/**
 * Routing trees:
 *
 *   /m/:restaurantId   → public customer menu. NO chrome, NO auth.
 *   /                  → marketing landing. Admin shell included. NO auth.
 *   /dashboard, /qr,
 *   /menu, /menu/manage,
 *   /kitchen, /order,
 *   /analytics,
 *   /restaurants,
 *   /admin/*           → admin app inside EnhancedLayout, behind AuthGate.
 */
export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            {/* Public QR scan — no admin shell, no auth */}
            <Route path="/m/:restaurantId" element={<ScanMenu />} />

            {/* Everything else lives inside the admin shell */}
            <Route
              path="*"
              element={
                <EnhancedLayout>
                  <Routes>
                    {/* Public: landing page — no auth required */}
                    <Route path="/" element={<Landing />} />

                    {/* Admin routes — behind auth gate */}
                    <Route
                      path="/dashboard"
                      element={<AuthGate><Dashboard /></AuthGate>}
                    />
                    <Route
                      path="/restaurants"
                      element={<AuthGate><RestaurantList /></AuthGate>}
                    />
                    {/* Menu is public — customers can browse */}
                    <Route
                      path="/menu"
                      element={<EnhancedMenuPage />}
                    />
                    <Route
                      path="/menu/manage"
                      element={<AuthGate><MenuManagement /></AuthGate>}
                    />
                    <Route
                      path="/kitchen"
                      element={<AuthGate><KitchenBoard /></AuthGate>}
                    />
                    <Route
                      path="/order"
                      element={<AuthGate><OrderCart /></AuthGate>}
                    />
                    <Route
                      path="/analytics"
                      element={<AuthGate><AnalyticsDashboard /></AuthGate>}
                    />
                    <Route
                      path="/qr"
                      element={<AuthGate><QRStudio /></AuthGate>}
                    />
                    {/* CMS routes */}
                    <Route
                      path="/admin/content/*"
                      element={<AuthGate><ContentCMS /></AuthGate>}
                    />
                    <Route
                      path="/admin"
                      element={<AuthGate><ContentCMS /></AuthGate>}
                    />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </EnhancedLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
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
