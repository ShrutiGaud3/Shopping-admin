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
  MapPin
} from 'lucide-react';

export const Orders: React.FC = () => {
  const { showToast } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statuses = ['All', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const res = await orderService.updateOrderStatus(orderId, newStatus);
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

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesSearch =
      (o.orderId && o.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide">
            Order Fulfillment Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage customer orders, track payments, and update delivery statuses</p>
        </div>

        <div className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 self-start sm:self-auto shadow-xs">
          Total Orders: <span className="text-emerald-700 font-bold">{orders.length}</span>
        </div>
      </div>

      {/* Status Filter Tabs & Search */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                statusFilter === s
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID, customer name..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
          />
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span>Loading customer orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-slate-300" />
            <span>No orders found matching this filter.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Order ID & Date</th>
                  <th className="py-3 px-4 font-bold">Customer Details</th>
                  <th className="py-3 px-4 font-bold">Items</th>
                  <th className="py-3 px-4 font-bold">Total Amount</th>
                  <th className="py-3 px-4 font-bold">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right font-bold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const orderId = order.id || order._id || '';
                  return (
                    <tr key={orderId} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-emerald-700">{order.orderId}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{order.date}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500">{order.customerEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-700 font-semibold">
                          {order.items?.length || 0} items
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">₹{order.totalAmount.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{order.paymentMethod}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            disabled={updatingId === orderId}
                            onChange={(e) => handleStatusChange(orderId, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${statusBadge(order.status)}`}
                          >
                            {statuses.filter((s) => s !== 'All').map((s) => (
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
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition font-bold cursor-pointer"
                        >
                          View
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-y-auto p-6 z-10 text-xs text-slate-900">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  <span>Order Details: {selectedOrder.orderId}</span>
                </h2>
                <p className="text-[11px] text-slate-500">Placed on {selectedOrder.date}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
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
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
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
                <span>Payment Method:</span>
                <span className="font-bold text-slate-900">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Shipping Fee:</span>
                <span>₹{selectedOrder.shippingFee}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Discount:</span>
                <span className="text-emerald-700 font-bold">-₹{selectedOrder.discountAmount}</span>
              </div>
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
