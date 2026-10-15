import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import type { DashboardMetrics } from '../types';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Clock,
  RefreshCw,
  ArrowUpRight,
  Plus,
  Layers,
  ChevronRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await adminService.getDashboardMetrics();
      if (res && res.success) {
        setMetrics(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const statusColors: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Confirmed: 'bg-sky-50 text-sky-700 border-sky-200',
    Packed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Title and Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide">
            Executive Performance Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time store metrics, financial KPIs, and order fulfillment</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/products"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 hover:shadow-md transition shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
            ₹{loading ? '...' : (metrics?.totalRevenue || 0).toLocaleString()}
          </div>
          <p className="text-[10px] text-emerald-700 mt-1 font-semibold flex items-center gap-1">
            <span>● Net paid volume</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl relative overflow-hidden group hover:border-sky-500/40 hover:shadow-md transition shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
            {loading ? '...' : metrics?.totalOrders || 0}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">All processed checkouts</p>
        </div>

        {/* Total Products */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl relative overflow-hidden group hover:border-purple-500/40 hover:shadow-md transition shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Catalog SKUs</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
            {loading ? '...' : metrics?.totalProducts || 0}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Active inventory styles</p>
        </div>

        {/* Total Users */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 hover:shadow-md transition shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Customers</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
            {loading ? '...' : metrics?.totalUsers || 0}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Registered accounts</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl relative overflow-hidden group hover:border-amber-500/40 hover:shadow-md transition shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-amber-700 tracking-tight">
            {loading ? '...' : metrics?.pendingOrders || 0}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Requires dispatch</p>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl relative overflow-hidden group hover:border-rose-500/40 hover:shadow-md transition shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock SKUs</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-rose-700 tracking-tight">
            {loading ? '...' : metrics?.lowStockProducts || 0}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Stock ≤ 10 units</p>
        </div>

      </div>

      {/* Quick Access Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/inventory"
          className="bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md p-4 rounded-2xl flex items-center justify-between group transition shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">Stock Manager</h3>
              <p className="text-xs text-slate-500">Quickly adjust warehouse inventory quantities</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/orders"
          className="bg-white border border-slate-200 hover:border-sky-400 hover:shadow-md p-4 rounded-2xl flex items-center justify-between group transition shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition">Fulfill Orders</h3>
              <p className="text-xs text-slate-500">Update shipping and fulfillment statuses</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/coupons"
          className="bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md p-4 rounded-2xl flex items-center justify-between group transition shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition">Promotions & Coupons</h3>
              <p className="text-xs text-slate-500">Create discount codes and promotional campaigns</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-wide">Recent Customer Orders</h2>
            <p className="text-xs text-slate-500">Most recent purchases waiting for fulfillment</p>
          </div>
          <Link
            to="/orders"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading recent orders...</div>
        ) : !metrics?.recentOrders || metrics.recentOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">No recent orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Order ID</th>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">Total Amount</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.recentOrders.map((order: any) => {
                  const status = order.orderStatus || order.status || 'Confirmed';
                  const orderId = order.orderId || (order._id ? `ORD-${order._id.slice(-6).toUpperCase()}` : 'ORD-1001');
                  const customer = order.shippingAddress?.fullName || order.customerName || 'Customer';
                  return (
                    <tr key={order._id || order.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{orderId}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{customer}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">₹{order.totalAmount?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to="/orders"
                          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 underline"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
