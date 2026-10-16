import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import type { DashboardMetrics } from '../types';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Clock,
  RefreshCw,
  Plus,
  Layers,
  ChevronRight,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Truck,
  Mail,
  Sparkles,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, showToast } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [restockingId, setRestockingId] = useState<string | null>(null);

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

  const handleQuickRestock = async (productId: string, currentStock: number, addAmount: number, name?: string) => {
    try {
      setRestockingId(productId);
      const newStock = currentStock + addAmount;
      await adminService.updateInventoryStock(productId, newStock, name);
      showToast(`Restocked ${name || 'item'} to ${newStock} units! 📦`, 'success');
      fetchDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock', 'error');
    } finally {
      setRestockingId(null);
    }
  };

  const statusColors: Record<string, string> = {
    Placed: 'bg-amber-50 text-amber-700 border-amber-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Confirmed: 'bg-sky-50 text-sky-700 border-sky-200',
    Packed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner with Executive Greeting and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide">
              Store Operations &amp; Performance
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
              {user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'manager' ? 'Store Manager' : 'Admin'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Real-time financial volume, today's order pipeline, and critical fulfillment alerts.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Refresh Data</span>
          </button>

          <Link
            to="/products"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Saree / Lehenga</span>
          </Link>
        </div>
      </div>

      {/* Critical Action Alerts Banner (If Pending Reviews or Exchanges) */}
      {((metrics?.pendingReviews ?? 0) > 0 || (metrics?.exchangeRequests ?? 0) > 0 || (metrics?.lowStockCount ?? 0) > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(metrics?.pendingReviews ?? 0) > 0 && (
            <Link
              to="/reviews"
              className="bg-amber-50/90 border border-amber-300 p-3.5 rounded-xl flex items-center justify-between hover:bg-amber-100/80 transition shadow-xs group"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {metrics?.pendingReviews}
                </span>
                <div>
                  <h4 className="font-bold text-xs text-amber-900 group-hover:underline">Pending Reviews Waiting</h4>
                  <p className="text-[11px] text-amber-700">Moderate customer ratings &amp; photos</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition" />
            </Link>
          )}

          {(metrics?.exchangeRequests ?? 0) > 0 && (
            <Link
              to="/orders"
              className="bg-rose-50/90 border border-rose-300 p-3.5 rounded-xl flex items-center justify-between hover:bg-rose-100/80 transition shadow-xs group"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {metrics?.exchangeRequests}
                </span>
                <div>
                  <h4 className="font-bold text-xs text-rose-900 group-hover:underline">10-Day Exchanges Requested</h4>
                  <p className="text-[11px] text-rose-700">Customer replacement requests</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-600 group-hover:translate-x-0.5 transition" />
            </Link>
          )}

          {(metrics?.lowStockCount ?? 0) > 0 && (
            <Link
              to="/inventory"
              className="bg-orange-50/90 border border-orange-300 p-3.5 rounded-xl flex items-center justify-between hover:bg-orange-100/80 transition shadow-xs group"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {metrics?.lowStockCount}
                </span>
                <div>
                  <h4 className="font-bold text-xs text-orange-900 group-hover:underline">Low Stock Catalog SKUs</h4>
                  <p className="text-[11px] text-orange-700">10 units or fewer in warehouse</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-orange-600 group-hover:translate-x-0.5 transition" />
            </Link>
          )}
        </div>
      )}

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
        
        {/* Today's Revenue */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-4 rounded-2xl relative overflow-hidden shadow-sm col-span-2">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Today's Revenue
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ₹{loading ? '...' : (metrics?.todayRevenue || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-100 mt-1">
            From <strong>{metrics?.todayOrders || 0} orders</strong> placed today
          </p>
        </div>

        {/* Total Lifetime Revenue */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl col-span-2 hover:border-emerald-500/40 hover:shadow-xs transition shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Lifetime Volume</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            ₹{loading ? '...' : (metrics?.totalRevenue || 0).toLocaleString()}
          </div>
          <p className="text-[10px] text-emerald-700 mt-1 font-semibold">● Net confirmed volume</p>
        </div>

        {/* Pending Fulfillment */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl relative group hover:border-amber-500/40 hover:shadow-xs transition shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Unfulfilled</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-700 tracking-tight">
            {loading ? '...' : metrics?.pendingOrders || 0}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Needs packing</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl relative group hover:border-sky-500/40 hover:shadow-xs transition shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">All Orders</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {loading ? '...' : metrics?.totalOrders || 0}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Total checkouts</p>
        </div>

        {/* Active Products */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl relative group hover:border-purple-500/40 hover:shadow-xs transition shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Live SKUs</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {loading ? '...' : metrics?.totalProducts || 0}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Surat designs</p>
        </div>

        {/* Newsletter Subscribers */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl relative group hover:border-rose-500/40 hover:shadow-xs transition shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Subscribers</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <Mail className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {loading ? '...' : metrics?.totalSubscribers || 0}
          </div>
          <p className="text-[10px] text-rose-600 mt-1">+{metrics?.todaySubscribers || 0} today</p>
        </div>

      </div>

      {/* Main Grid: Low Stock Alert Restock + Order Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Low Stock Alerts & Quick Restock Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                Low Stock Warehouse Alert
              </h2>
              <p className="text-xs text-slate-500">Products nearing stockout. Restock directly with one click.</p>
            </div>
            <Link
              to="/inventory"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Full Inventory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-400 text-xs">Checking inventory levels...</div>
          ) : !metrics?.lowStockProducts || metrics.lowStockProducts.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
              <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              All catalog styles are adequately stocked!
            </div>
          ) : (
            <div className="space-y-3">
              {metrics.lowStockProducts.map((p) => {
                const prodId = p._id;
                const isRestocking = restockingId === prodId;

                return (
                  <div
                    key={prodId}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-11 h-13 object-cover rounded-md border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-13 bg-slate-200 rounded-md shrink-0 flex items-center justify-center text-slate-400 text-[10px]">
                          No Pic
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs text-slate-900 truncate">{p.name}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>{p.category}</span>
                          <span>•</span>
                          <span>₹{p.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock === 0
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                      </span>

                      <button
                        onClick={() => handleQuickRestock(prodId, p.stock, 10, p.name)}
                        disabled={isRestocking}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-md text-[11px] font-semibold text-slate-700 transition cursor-pointer disabled:opacity-50"
                        title="Add +10 units immediately"
                      >
                        +10
                      </button>

                      <button
                        onClick={() => handleQuickRestock(prodId, p.stock, 25, p.name)}
                        disabled={isRestocking}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-semibold transition cursor-pointer disabled:opacity-50"
                        title="Add +25 units immediately"
                      >
                        +25
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Module Navigation (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <Link
            to="/orders"
            className="bg-white border border-slate-200 hover:border-sky-400 hover:shadow-xs p-4 rounded-2xl flex items-center justify-between group transition shadow-2xs block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition">Order Dispatch &amp; Tracking</h3>
                <p className="text-xs text-slate-500">Update carrier AWB tracking numbers &amp; dispatches</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            to="/reviews"
            className="bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs p-4 rounded-2xl flex items-center justify-between group transition shadow-2xs block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition">Reviews Moderation</h3>
                <p className="text-xs text-slate-500">Approve customer feedback &amp; photo attachments</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            to="/blogs"
            className="bg-white border border-slate-200 hover:border-purple-400 hover:shadow-xs p-4 rounded-2xl flex items-center justify-between group transition shadow-2xs block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition">Ethnic Blog &amp; Style Stories</h3>
                <p className="text-xs text-slate-500">Publish bridal lookbooks &amp; Surat loom diaries</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            to="/subscribers"
            className="bg-white border border-slate-200 hover:border-rose-400 hover:shadow-xs p-4 rounded-2xl flex items-center justify-between group transition shadow-2xs block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-700 transition">Newsletter Subscribers</h3>
                <p className="text-xs text-slate-500">Export CSV customer email list for campaigns</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
          </Link>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-wide">Recent Store Checkouts</h2>
            <p className="text-xs text-slate-500">Latest online orders placed across India &amp; International zones</p>
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
                  <th className="py-3 px-4 font-bold">Payment</th>
                  <th className="py-3 px-4 font-bold">Total Amount</th>
                  <th className="py-3 px-4 font-bold">Fulfillment Status</th>
                  <th className="py-3 px-4 font-bold">Exchange</th>
                  <th className="py-3 px-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.recentOrders.map((order: any) => {
                  const status = order.orderStatus || order.status || 'Confirmed';
                  const orderId = order.orderId || (order._id ? `ORD-${order._id.slice(-6).toUpperCase()}` : 'ORD-1001');
                  const customer = order.shippingAddress?.fullName || order.customerName || (order.user?.name || 'Customer');
                  const exStatus = order.exchangeStatus || 'none';

                  return (
                    <tr key={order._id || order.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{orderId}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{customer}</td>
                      <td className="py-3 px-4 text-slate-600 uppercase text-[10px] font-semibold">{order.paymentMethod || 'Online'}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">₹{order.totalAmount?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {exStatus === 'requested' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            Requested
                          </span>
                        ) : exStatus === 'approved' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Approved
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to="/orders"
                          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 underline"
                        >
                          Fulfill
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
