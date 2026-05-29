import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { AuthProvider, AuthGate } from './lib/auth';
import { ContentProvider } from './lib/content-store';

import Layout    from './components/Layout';
import Landing   from './app/landing';
import MenuPage  from './app/menu';
import ContentCMS from './app/admin/content';

/**
 * Public routes:
 *   /         - landing page (everything CMS-driven)
 *   /menu     - menu (CMS-driven categories + items + photos)
 *
 * Admin (auth-gated):
 *   /admin            - CMS editor (branding, landing, menu, location, contact)
 *   /admin/content/*  - same, deep links into specific editors
 */
export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/"     element={<Landing />} />
              <Route path="/menu" element={<MenuPage />} />

              <Route
                path="/admin/*"
                element={<AuthGate><ContentCMS /></AuthGate>}
              />

              {/* Catch-all: redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  );
}
