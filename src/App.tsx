import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { Inventory } from './pages/Inventory';
import { Categories } from './pages/Categories';
import { Coupons } from './pages/Coupons';
import { Users } from './pages/Users';
import { Messages } from './pages/Messages';
import { Reviews } from './pages/Reviews';
import { Marquee } from './pages/Marquee';
import { PagesManager } from './pages/PagesManager';
import { Settings } from './pages/Settings';
import { Banners } from './pages/Banners';
import { HomeSections } from './pages/HomeSections';
import { TrustBadges } from './pages/TrustBadges';
import { ShippingZones } from './pages/ShippingZones';
import { Blogs } from './pages/Blogs';
import { Subscribers } from './pages/Subscribers';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Executive Admin Portal Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/banners" element={<Banners />} />
              <Route path="/home-sections" element={<HomeSections />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/marquee" element={<Marquee />} />
              <Route path="/trust-badges" element={<TrustBadges />} />
              <Route path="/pages-manager" element={<PagesManager />} />
              <Route path="/coupons" element={<Coupons />} />
              <Route path="/users" element={<Users />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/subscribers" element={<Subscribers />} />
              <Route path="/shipping-zones" element={<ShippingZones />} />
              <Route path="/settings" element={<Settings />} />

            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
