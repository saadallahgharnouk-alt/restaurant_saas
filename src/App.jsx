import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import EnhancedLayout from './components/EnhancedLayout';
import Landing        from './app/landing';
import PublicMenu     from './app/menu-public';
import Login          from './app/login';
import Admin          from './app/admin';

import { ContentProvider } from './store/content';
import { AuthProvider, RequireAuth } from './store/auth';
import { ToastProvider } from './components/primitives';

/**
 * Three pages (per the brief):
 *   /        — restaurant presentation
 *   /menu    — the menu (QR block at the bottom)
 *   /admin   — manager panel, gated by /login
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider>
          <ToastProvider>
            <EnhancedLayout>
              <Routes>
                <Route path="/"      element={<Landing />} />
                <Route path="/menu"   element={<PublicMenu />} />
                <Route path="/login"  element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <RequireAuth>
                      <Admin />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </EnhancedLayout>
          </ToastProvider>
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
