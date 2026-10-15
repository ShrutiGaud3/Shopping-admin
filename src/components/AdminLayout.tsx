import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  FolderTree,
  Tag,
  Users,
  MessageSquare,
  Star,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Info,
  Megaphone,
  FileText,
  Settings as SettingsIcon,
  Image as ImageIcon,
  LayoutGrid,
  Award
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, toast } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Hero Banners', path: '/banners', icon: ImageIcon },
    { name: 'Home Sections', path: '/home-sections', icon: LayoutGrid },
    { name: 'Categories', path: '/categories', icon: FolderTree },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Inventory', path: '/inventory', icon: Layers },
    { name: 'Marquee Strip', path: '/marquee', icon: Megaphone },
    { name: 'Trust Badges', path: '/trust-badges', icon: Award },
    { name: 'Pages & FAQs', path: '/pages-manager', icon: FileText },
    { name: 'Coupons', path: '/coupons', icon: Tag },
    { name: 'Customers', path: '/users', icon: Users },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Reviews', path: '/reviews', icon: Star },
    { name: 'Site Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between shadow-xs">
        
        {/* Left Side: Mobile Menu Button & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-slate-900 text-lg font-serif">VELORA</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">Executive Commerce Control Center</p>
            </div>
          </div>
        </div>

        {/* Right Side: Storefront Link & Admin Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* External Storefront Link */}
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition"
            title="Open customer storefront in new tab"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>

          {/* Backend Status indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Cloud API Live</span>
          </div>

          {/* Profile & Logout */}
          <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-slate-200">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-emerald-700 font-medium">{user?.email || 'admin@velora.com'}</span>
            </div>

            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center font-bold text-xs text-emerald-800">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Logout from Admin Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col justify-between shrink-0 p-4 shadow-xs">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-[11px] text-slate-500">
            <div className="flex items-center justify-between text-slate-800 font-semibold mb-1">
              <span>Admin Engine</span>
              <span className="text-emerald-700 text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">v2.0 Light</span>
            </div>
            <p className="text-[10px] text-slate-500">Connected to MongoDB Atlas Backend</p>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between z-10 shadow-2xl">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</span>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                          isActive
                            ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-semibold transition border border-rose-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/60">
          <Outlet />
        </main>

      </div>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border transition-all animate-bounce bg-white border-slate-200 text-slate-900">
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-600 shrink-0" />}
          <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
        </div>
      )}

    </div>
  );
};
