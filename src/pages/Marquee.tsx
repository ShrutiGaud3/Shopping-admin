import React, { useEffect, useState } from 'react';
import { marqueeService } from '../services/marqueeService';
import { useAuth } from '../context/AuthContext';
import type { MarqueeItem } from '../types';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  Truck,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  Check
} from 'lucide-react';

export const Marquee: React.FC = () => {
  const { showToast } = useAuth();
  const [marquees, setMarquees] = useState<MarqueeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [text, setText] = useState('');
  const [link, setLink] = useState('/products');
  const [icon, setIcon] = useState('Sparkles');
  const [order, setOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const fetchMarquees = async () => {
    try {
      setLoading(true);
      const res = await marqueeService.getAllMarquees();
      if (res && res.success) {
        setMarquees(res.data);
      }
    } catch (err) {
      showToast('Failed to load marquee tickers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarquees();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setActiveId(null);
    setText('');
    setLink('/products');
    setIcon('Sparkles');
    setOrder((marquees.length || 0) + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MarqueeItem) => {
    setIsEditing(true);
    setActiveId(item.id || item._id || '');
    setText(item.text);
    setLink(item.link || '/products');
    setIcon(item.icon || 'Sparkles');
    setOrder(item.order || 1);
    setIsActive(item.isActive !== undefined ? item.isActive : true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      showToast('Please enter marquee announcement text', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        text: text.trim(),
        link: link.trim() || '/products',
        icon,
        order: Number(order),
        isActive
      };

      if (isEditing && activeId) {
        await marqueeService.updateMarquee(activeId, payload);
        showToast('Marquee ticker updated successfully', 'success');
      } else {
        await marqueeService.createMarquee(payload);
        showToast('New marquee ticker created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchMarquees();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, tickerText: string) => {
    if (!window.confirm(`Delete ticker "${tickerText.slice(0, 30)}..."?`)) return;
    try {
      await marqueeService.deleteMarquee(id);
      showToast('Marquee ticker deleted', 'success');
      setMarquees((prev) => prev.filter((m) => (m.id || m._id) !== id));
    } catch (err) {
      showToast('Failed to delete marquee ticker', 'error');
    }
  };

  const handleToggleStatus = async (item: MarqueeItem) => {
    const itemId = item.id || item._id;
    if (!itemId) return;
    try {
      const updated = !item.isActive;
      await marqueeService.updateMarquee(itemId, { isActive: updated });
      setMarquees((prev) =>
        prev.map((m) => ((m.id || m._id) === itemId ? { ...m, isActive: updated } : m))
      );
      showToast(`Ticker ${updated ? 'activated' : 'deactivated'}`, 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Truck': return <Truck className="w-4 h-4 text-emerald-600" />;
      case 'RotateCcw': return <RotateCcw className="w-4 h-4 text-sky-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      default: return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide">
            Promo Marquee Scrolling Tickers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Control animated scrolling offer banners displayed right under the header</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Ticker</span>
        </button>
      </div>

      {/* Live Preview Bar */}
      <div className="bg-slate-900 text-white p-3 rounded-2xl overflow-hidden shadow-xs border border-slate-800">
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 mb-1.5 px-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Storefront Preview Strip</span>
        </div>
        <div className="flex items-center gap-8 overflow-x-auto py-1 px-2 no-scrollbar text-xs font-semibold tracking-wider">
          {marquees.filter((m) => m.isActive).map((m, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              {renderIcon(m.icon)}
              <span>{m.text}</span>
              <span className="text-slate-600">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Items Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span>Loading ticker items...</span>
          </div>
        ) : marquees.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Sparkles className="w-8 h-8 text-slate-300" />
            <span>No marquee tickers configured. Click Add to create one.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Order</th>
                  <th className="py-3 px-4 font-bold">Icon & Announcement Text</th>
                  <th className="py-3 px-4 font-bold">Target Link</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marquees.map((m) => {
                  const mId = m.id || m._id || '';
                  return (
                    <tr key={mId} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-600">
                        #{m.order}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-slate-100 shrink-0">
                            {renderIcon(m.icon)}
                          </div>
                          <span className={`font-semibold ${m.isActive ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                            {m.text}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {m.link || '/products'}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(m)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer transition ${
                            m.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {m.isActive ? 'Active' : 'Paused'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(m)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            title="Edit Ticker"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(mId, m.text)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                            title="Delete Ticker"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 z-10 text-xs text-slate-900">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>{isEditing ? 'Edit Ticker Item' : 'Create Marquee Ticker'}</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Announcement Text *</label>
                <input
                  type="text"
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. 10-DAYS EASY SIZE EXCHANGE GUARANTEE"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Click Destination URL / Route</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="/products or /pages/refund-policy"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Leading Icon</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
                  >
                    <option value="Sparkles">Sparkles ✨</option>
                    <option value="Truck">Delivery Truck 🚚</option>
                    <option value="RotateCcw">Exchange / Return 🔄</option>
                    <option value="ShieldCheck">Shield Quality 🛡️</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Sequence Order</label>
                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="isActiveToggle" className="text-slate-800 font-bold cursor-pointer">
                  Publish to live storefront marquee
                </label>
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
                  <span>{isEditing ? 'Save Ticker' : 'Create Ticker'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
