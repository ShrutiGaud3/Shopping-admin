import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Plus,
  Trash2,
  Edit2,
  X,
  Eye
} from 'lucide-react';
import { trustBadgeService } from '../services/trustBadgeService';
import { useAuth } from '../context/AuthContext';
import type { TrustBadgeItem } from '../types';

export const TrustBadges: React.FC = () => {
  const [badges, setBadges] = useState<TrustBadgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<TrustBadgeItem | null>(null);
  const { showToast } = useAuth();

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    icon: 'shield' as 'shield' | 'truck' | 'creditCard' | 'rotate' | 'sparkles' | 'check',
    order: 0,
    isActive: true
  });

  const loadBadges = async () => {
    setLoading(true);
    try {
      const data = await trustBadgeService.getAllTrustBadges();
      setBadges(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch badges', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBadges();
  }, []);

  const renderIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'truck':
        return <Truck className={`${className} text-emerald-600`} />;
      case 'creditCard':
        return <CreditCard className={`${className} text-amber-600`} />;
      case 'rotate':
        return <RotateCcw className={`${className} text-sky-600`} />;
      case 'sparkles':
        return <Sparkles className={`${className} text-rose-600`} />;
      case 'check':
        return <CheckCircle className={`${className} text-indigo-600`} />;
      case 'shield':
      default:
        return <ShieldCheck className={`${className} text-teal-600`} />;
    }
  };

  const openAddModal = () => {
    setEditingBadge(null);
    setForm({
      title: '',
      subtitle: '',
      icon: 'shield',
      order: badges.length + 1,
      isActive: true
    });
    setModalOpen(true);
  };

  const openEditModal = (badge: TrustBadgeItem) => {
    setEditingBadge(badge);
    setForm({
      title: badge.title || '',
      subtitle: badge.subtitle || '',
      icon: badge.icon || 'shield',
      order: badge.order ?? 0,
      isActive: badge.isActive !== false
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    try {
      if (editingBadge) {
        const id = editingBadge._id || editingBadge.id!;
        await trustBadgeService.updateTrustBadge(id, form);
        showToast('Trust badge updated successfully', 'success');
      } else {
        await trustBadgeService.createTrustBadge(form);
        showToast('Trust badge created successfully', 'success');
      }
      setModalOpen(false);
      loadBadges();
    } catch (err: any) {
      showToast(err.message || 'Error saving badge', 'error');
    }
  };

  const handleDelete = async (badge: TrustBadgeItem) => {
    if (!window.confirm(`Delete trust badge "${badge.title}"?`)) return;
    try {
      const id = badge._id || badge.id!;
      await trustBadgeService.deleteTrustBadge(id);
      showToast('Badge deleted', 'success');
      loadBadges();
    } catch (err: any) {
      showToast(err.message || 'Error deleting badge', 'error');
    }
  };

  const handleToggleActive = async (badge: TrustBadgeItem) => {
    try {
      const id = badge._id || badge.id!;
      await trustBadgeService.updateTrustBadge(id, { isActive: !badge.isActive });
      showToast(`Badge ${!badge.isActive ? 'activated' : 'deactivated'}`, 'info');
      loadBadges();
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 font-serif">Trust Badges &amp; USPs</h1>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              {badges.length} Highlights
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build customer trust by configuring store promises (Surat Direct Rates, Free Shipping, Cash on Delivery, Doorstep Returns).
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Trust Badge
        </button>
      </div>

      {/* Live Storefront Preview Strip */}
      {badges.filter((b) => b.isActive).length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Eye className="w-4 h-4 text-emerald-600" /> Live Storefront Preview Strip
          </span>
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {badges
              .filter((b) => b.isActive)
              .map((b) => (
                <div key={b._id || b.id} className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-xs border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                    {renderIcon(b.icon)}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{b.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{b.subtitle}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Badges Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">Configured Badges</h2>
          <span className="text-xs text-slate-400">Drag or use order number to position</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading badges...</div>
        ) : badges.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No badges found. Click Add to create one.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {badges.map((b) => (
              <div
                key={b._id || b.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    {renderIcon(b.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{b.title}</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                        Order #{b.order}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{b.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleActive(b)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full cursor-pointer transition ${
                      b.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {b.isActive ? 'Active' : 'Disabled'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(b)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                      title="Edit badge"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b)}
                      className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                      title="Delete badge"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-base font-serif">
                {editingBadge ? 'Edit Trust Badge' : 'Add Trust Badge'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Badge Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surat Direct Prices"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle / Promise *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wholesale factory rates with zero middlemen"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2">Select Visual Icon</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sparkles', label: 'Surat Direct', icon: Sparkles },
                    { id: 'truck', label: 'Delivery', icon: Truck },
                    { id: 'creditCard', label: 'COD / Pay', icon: CreditCard },
                    { id: 'rotate', label: 'Returns', icon: RotateCcw },
                    { id: 'shield', label: 'Quality', icon: ShieldCheck },
                    { id: 'check', label: 'Verified', icon: CheckCircle }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setForm({ ...form, icon: item.id as any })}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                        form.icon === item.id
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-[10px] font-semibold">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Visibility</label>
                  <select
                    value={form.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setForm({ ...form, isActive: e.target.value === 'active' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
                >
                  {editingBadge ? 'Save Changes' : 'Create Badge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
