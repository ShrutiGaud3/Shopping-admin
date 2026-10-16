import React, { useEffect, useState } from 'react';
import { couponService } from '../services/couponService';
import { useAuth } from '../context/AuthContext';
import type { Coupon } from '../types';
import {
  Tag,
  Plus,
  Trash2,
  X,
  Loader2,
  Calendar,
  Percent,
  CheckCircle,
  Clock,
  Sparkles,
  CreditCard,
  Banknote,
  Users
} from 'lucide-react';

export const Coupons: React.FC = () => {
  const { showToast } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'flat'>('percent');
  const [value, setValue] = useState<number>(10);
  const [maxDiscount, setMaxDiscount] = useState<number>(500);
  const [minOrder, setMinOrder] = useState<number>(999);
  const [usageLimit, setUsageLimit] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState<'any' | 'prepaid' | 'cod'>('any');
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d.toISOString().split('T')[0];
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await couponService.getCoupons();
      if (res && res.success) {
        setCoupons(res.data);
      }
    } catch (err) {
      showToast('Failed to load coupons', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenAddModal = () => {
    setCode('');
    setType('percent');
    setValue(10);
    setMaxDiscount(500);
    setMinOrder(999);
    setUsageLimit(1000);
    setPaymentMethod('any');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('Please enter a coupon code', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<Coupon> = {
        code: code.trim().toUpperCase(),
        type,
        discountType: type === 'flat' ? 'fixed' : 'percentage',
        value: Number(value),
        discountValue: Number(value),
        discountPercentage: type === 'percent' ? Number(value) : 0,
        maxDiscount: Number(maxDiscount),
        maxDiscountAmount: Number(maxDiscount),
        minOrder: Number(minOrder),
        minOrderAmount: Number(minOrder),
        usageLimit: Number(usageLimit),
        paymentMethod,
        expiryDate,
        expiry: expiryDate,
        isActive: true
      };

      await couponService.createCoupon(payload);
      showToast(`Coupon ${code.toUpperCase()} created successfully! 🎉`, 'success');
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Failed to create coupon', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!window.confirm(`Delete coupon "${couponCode}"?`)) return;
    try {
      await couponService.deleteCoupon(id);
      showToast(`Coupon "${couponCode}" deleted`, 'success');
      setCoupons((prev) => prev.filter((c) => (c.id || c._id) !== id));
    } catch (err) {
      showToast('Failed to delete coupon', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide flex items-center gap-2">
            <Tag className="w-6 h-6 text-emerald-600" /> Promotional Coupons &amp; Vouchers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Issue checkout discount codes, auto-prepaid incentives (10% OFF), and monitor customer redemptions</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Active Coupons</span>
            <strong className="text-base text-slate-900">{coupons.filter(c => c.isActive).length}</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Prepaid Incentives</span>
            <strong className="text-base text-purple-900">
              {coupons.filter(c => c.paymentMethod === 'prepaid').length} (e.g. PREPAID10)
            </strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Total Redemptions</span>
            <strong className="text-base text-slate-900">
              {coupons.reduce((sum, c) => sum + (c.usedCount || c.usageCount || 0), 0)} Orders
            </strong>
          </div>
        </div>
      </div>

      {/* Coupons Table / Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span>Loading promotional coupons...</span>
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Tag className="w-8 h-8 text-slate-300" />
            <span>No promotional coupons found. Click Create to issue one.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Coupon Code</th>
                  <th className="py-3 px-4 font-bold">Discount Value</th>
                  <th className="py-3 px-4 font-bold">Payment Method Restriction</th>
                  <th className="py-3 px-4 font-bold">Min Order / Cap</th>
                  <th className="py-3 px-4 font-bold">Redemptions</th>
                  <th className="py-3 px-4 font-bold">Expiry Date</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((c) => {
                  const couponId = c.id || c._id || '';
                  const expiryDateObj = c.expiryDate || c.expiry ? new Date(c.expiryDate || c.expiry!) : null;
                  const isExpired = expiryDateObj ? expiryDateObj < new Date() : false;
                  const isPercent = c.type === 'percent' || c.discountType === 'percentage';
                  const discVal = c.value !== undefined ? c.value : (c.discountValue || c.discountPercentage || 0);

                  return (
                    <tr key={couponId} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            {c.code}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900">
                        {isPercent ? `${discVal}% OFF` : `₹${discVal} FLAT`}
                      </td>

                      <td className="py-3 px-4">
                        {c.paymentMethod === 'prepaid' ? (
                          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <CreditCard className="w-3 h-3" /> Prepaid / Online Only
                          </span>
                        ) : c.paymentMethod === 'cod' ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <Banknote className="w-3 h-3" /> COD Only
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            All Payment Modes
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">
                        <div>Min: ₹{(c.minOrder || c.minOrderAmount || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">
                          Cap: {c.maxDiscount || c.maxDiscountAmount ? `₹${c.maxDiscount || c.maxDiscountAmount}` : 'Unlimited'}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium font-mono text-[11px]">
                        {c.usedCount || c.usageCount || 0} / {c.usageLimit || 1000}
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{expiryDateObj ? expiryDateObj.toLocaleDateString('en-GB') : 'No Expiry'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isExpired
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {isExpired ? 'Expired' : 'Active'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(couponId, c.code)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 z-10 text-xs text-slate-900">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-600" />
                <span>Create Promotional Coupon</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. PREPAID10 or FESTIVE20"
                  className="w-full uppercase font-mono tracking-wider bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-emerald-700 font-bold focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="percent">Percentage (% OFF)</option>
                    <option value="flat">Flat Amount (₹ OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {type === 'percent' ? 'Discount % *' : 'Discount ₹ *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Method Compatibility</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 cursor-pointer font-medium"
                >
                  <option value="any">Any Payment Method (UPI, Card, COD)</option>
                  <option value="prepaid">Prepaid / Online Only (UPI &amp; Card - 10% Auto Coupon)</option>
                  <option value="cod">Cash on Delivery (COD) Only</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Select 'Prepaid Only' for special digital payment discounts like PREPAID10.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Coupon</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
