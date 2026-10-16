import React, { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import type { Order } from '../types';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  Package,
  XCircle,
  X,
  Loader2,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Send
} from 'lucide-react';

export const Orders: React.FC = () => {
  const { showToast } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Logistics tracking inputs inside modal
  const [editCarrier, setEditCarrier] = useState('');
  const [editTrackingNumber, setEditTrackingNumber] = useState('');
  const [editTrackingUrl, setEditTrackingUrl] = useState('');
  const [savingLogistics, setSavingLogistics] = useState(false);

  // Exchange resolution inputs inside modal
  const [exchangeAdminNotes, setExchangeAdminNotes] = useState('');
  const [resolvingExchange, setResolvingExchange] = useState(false);

  const statuses = [
    'All',
    'Exchange Requests',
    'Pending',
    'Confirmed',
    'Packed',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders();
      if (res && res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      showToast('Failed to load orders from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditCarrier(order.carrierName || 'Delhivery Express');
    setEditTrackingNumber(order.trackingNumber || '');
    setEditTrackingUrl(order.trackingUrl || '');
    setExchangeAdminNotes(order.exchangeAdminNotes || '');
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const res = await orderService.updateOrderStatus(orderId, { status: newStatus });
      if (res && res.success) {
        showToast(`Order status updated to ${newStatus}`, 'success');
        setOrders((prev) =>
          prev.map((o) => ((o.id || o._id) === orderId ? { ...o, status: newStatus as any } : o))
        );
        if (selectedOrder && (selectedOrder.id || selectedOrder._id) === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus as any });
        }
      }
    } catch (err: any) {
      showToast('Failed to update order status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveLogistics = async () => {
    if (!selectedOrder) return;
    const orderId = selectedOrder.id || selectedOrder._id;
    if (!orderId) return;

    setSavingLogistics(true);
    try {
      const res = await orderService.updateOrderStatus(orderId, {
        carrierName: editCarrier.trim(),
        trackingNumber: editTrackingNumber.trim(),
        trackingUrl: editTrackingUrl.trim()
      });

      if (res && res.success) {
        showToast('Tracking details updated successfully!', 'success');
        setOrders((prev) =>
          prev.map((o) => ((o.id || o._id) === orderId ? res.data : o))
        );
        setSelectedOrder(res.data);
      }
    } catch (err) {
      showToast('Failed to update tracking info', 'error');
    } finally {
      setSavingLogistics(false);
    }
  };

  const handleResolveExchange = async (action: 'approved' | 'rejected') => {
    if (!selectedOrder) return;
    const orderId = selectedOrder.id || selectedOrder._id;
    if (!orderId) return;

    setResolvingExchange(true);
    try {
      const res = await orderService.updateExchangeStatus(orderId, action, exchangeAdminNotes);
      if (res && res.success) {
        showToast(`Exchange request ${action}!`, 'success');
        setOrders((prev) =>
          prev.map((o) => ((o.id || o._id) === orderId ? res.data : o))
        );
        setSelectedOrder(res.data);
      }
    } catch (err) {
      showToast('Failed to resolve exchange request', 'error');
    } finally {
      setResolvingExchange(false);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Confirmed':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Packed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const exchangeRequestsCount = orders.filter((o) => o.exchangeStatus === 'requested').length;

  const filteredOrders = orders.filter((o) => {
    let matchesStatus = true;
    if (statusFilter === 'Exchange Requests') {
      matchesStatus = o.exchangeStatus === 'requested';
    } else if (statusFilter !== 'All') {
      matchesStatus = o.status === statusFilter;
    }

    const matchesSearch =
      (o.orderId && o.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide">
            Order Fulfillment Pipeline &amp; Logistics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage customer orders, update parcel tracking AWB, and process 10-day exchange requests</p>
        </div>

        <div className="flex items-center gap-3">
          {exchangeRequestsCount > 0 && (
            <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-1.5 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
              <span>{exchangeRequestsCount} Exchange Pending</span>
            </div>
          )}

          <div className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-xs">
            Total Orders: <span className="text-emerald-700 font-bold">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs & Search */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {statuses.map((s) => {
            const isExchangeTab = s === 'Exchange Requests';
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === s
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : isExchangeTab && exchangeRequestsCount > 0
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{s}</span>
                {isExchangeTab && exchangeRequestsCount > 0 && (
                  <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {exchangeRequestsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order #, Customer, AWB..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading orders from server...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">No orders matching filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order ID &amp; Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total &amp; Payment</th>
                  <th className="py-3 px-4">Exchange</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const orderId = order.id || order._id || '';
                  const displayId = order.orderId || (orderId ? `#${orderId.slice(-6)}` : '#ORD-1001');
                  const isExchangeReq = order.exchangeStatus === 'requested';

                  return (
                    <tr key={orderId || Math.random()} className={`hover:bg-slate-50/70 transition ${isExchangeReq ? 'bg-amber-50/40' : ''}`}>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{displayId}</span>
                        <span className="text-[10px] text-slate-400">{order.date}</span>
                        {order.trackingNumber && (
                          <span className="text-[10px] text-slate-600 font-mono block mt-0.5">
                            AWB: {order.trackingNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{order.customerName}</span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">{order.customerEmail}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 block">{order.shippingAddress?.city}</span>
                        <span className="text-[10px] text-slate-500">{order.shippingAddress?.country || 'India'}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{order.items?.length || 1} items</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-900 block font-serif">₹{order.totalAmount?.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500">
                          {order.paymentMethod} {order.paymentStatus ? `(${order.paymentStatus})` : ''}
                        </span>
                      </td>

                      {/* Exchange Status Column */}
                      <td className="py-3 px-4">
                        {order.exchangeStatus === 'requested' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            <RefreshCw className="w-2.5 h-2.5 animate-spin text-amber-700" /> Pending Review
                          </span>
                        ) : order.exchangeStatus === 'approved' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ Approved
                          </span>
                        ) : order.exchangeStatus === 'rejected' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                            ✕ Rejected
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>

                      {/* Status Selector */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <select
                            value={order.status}
                            disabled={updatingId === orderId}
                            onChange={(e) => orderId && handleStatusChange(orderId, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${statusBadge(order.status)}`}
                          >

                            {statuses.filter((s) => s !== 'All' && s !== 'Exchange Requests').map((s) => (
                              <option key={s} value={s} className="bg-white text-slate-800">
                                {s}
                              </option>
                            ))}
                          </select>
                          {updatingId === orderId && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleSelectOrder(order)}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition font-bold cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details & Logistics Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-y-auto p-6 z-10 text-xs text-slate-900">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  <span>Order #{selectedOrder.orderId}</span>
                </h2>
                <p className="text-[11px] text-slate-500">Placed on {selectedOrder.date} | Payment: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus || 'pending'})</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Exchange Review Card (if exchange requested) */}
            {selectedOrder.exchangeStatus && selectedOrder.exchangeStatus !== 'none' && (
              <div className="mb-5 p-4 bg-amber-50/90 border border-amber-300 rounded-2xl text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-amber-700" /> 10-Day Customer Exchange Request
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    selectedOrder.exchangeStatus === 'approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    selectedOrder.exchangeStatus === 'rejected' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                    'bg-amber-200 text-amber-900 border-amber-300'
                  }`}>
                    Status: {selectedOrder.exchangeStatus.toUpperCase()}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
                  <p><strong className="text-amber-950">Reason:</strong> {selectedOrder.exchangeReason || 'Size / Fit'}</p>
                  <p><strong className="text-amber-950">Customer Notes:</strong> {selectedOrder.exchangeNotes || 'No notes provided'}</p>
                </div>

                {selectedOrder.exchangeStatus === 'requested' && (
                  <div className="space-y-2 pt-1">
                    <label className="block text-[11px] font-semibold text-amber-950">Admin Notes / Resolution Response:</label>
                    <input
                      type="text"
                      placeholder="e.g. Pickup scheduled via Delhivery. Replacement size sent."
                      value={exchangeAdminNotes}
                      onChange={(e) => setExchangeAdminNotes(e.target.value)}
                      className="w-full bg-white px-3 py-1.5 rounded-lg border border-amber-300 text-xs text-slate-800"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleResolveExchange('approved')}
                        disabled={resolvingExchange}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                      >
                        ✓ Approve Exchange &amp; Schedule Pickup
                      </button>
                      <button
                        onClick={() => handleResolveExchange('rejected')}
                        disabled={resolvingExchange}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
                      >
                        ✕ Reject Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Logistics & Tracking Editor */}
            <div className="mb-5 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" /> Carrier &amp; Real-Time Tracking Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Carrier Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Delhivery Express"
                    value={editCarrier}
                    onChange={(e) => setEditCarrier(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Tracking Number (AWB)</label>
                  <input
                    type="text"
                    placeholder="e.g. 14920492841"
                    value={editTrackingNumber}
                    onChange={(e) => setEditTrackingNumber(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Tracking Web URL</label>
                  <input
                    type="text"
                    placeholder="https://delhivery.com/..."
                    value={editTrackingUrl}
                    onChange={(e) => setEditTrackingUrl(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSaveLogistics}
                  disabled={savingLogistics}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  {savingLogistics ? 'Saving Logistics...' : 'Update Tracking'}
                </button>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Customer</p>
                <p className="font-bold text-slate-900">{selectedOrder.customerName}</p>
                <p className="text-slate-600 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3 h-3" /> {selectedOrder.customerEmail}
                </p>
                {selectedOrder.shippingAddress?.phone && (
                  <p className="text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3" /> {selectedOrder.shippingAddress.phone}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Shipping Address</p>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {selectedOrder.shippingAddress?.street},<br />
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}<br />
                  <strong>{selectedOrder.shippingAddress?.country || 'India'}</strong>
                </p>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Ordered Items ({selectedOrder.items?.length})</p>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.product?.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">Size: {item.selectedSize} | Color: {item.selectedColor} | Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-slate-900">₹{(item.product?.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Total breakdown */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal:</span>
                <span>₹{(selectedOrder.subtotal || selectedOrder.totalAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Shipping Fee:</span>
                <span>₹{selectedOrder.shippingFee || selectedOrder.shippingCharge || 0}</span>
              </div>
              {selectedOrder.discountAmount ? (
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Coupon Discount ({selectedOrder.couponCode || 'PROMO'}):</span>
                  <span className="text-emerald-700 font-bold">-₹{selectedOrder.discountAmount}</span>
                </div>
              ) : null}
              {selectedOrder.codCharge ? (
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>COD Charge:</span>
                  <span>+₹{selectedOrder.codCharge}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-emerald-700">₹{selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
