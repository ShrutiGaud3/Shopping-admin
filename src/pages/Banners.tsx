import React, { useState, useEffect } from 'react';
import {
  Image,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  MoveUp,
  MoveDown,
  Sparkles,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { bannerService } from '../services/bannerService';
import { useAuth } from '../context/AuthContext';
import type { BannerItem } from '../types';

export const Banners: React.FC = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);
  const { showToast } = useAuth();

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    badge: '',
    desktopImage: '',
    mobileImage: '',
    ctaText: 'Shop Collection',
    ctaLink: '/products',
    order: 0,
    isActive: true,
    textColor: 'light' as 'light' | 'dark',
    alignment: 'left' as 'left' | 'center' | 'right'
  });

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await bannerService.getAllBanners();
      setBanners(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch banners', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setForm({
      title: '',
      subtitle: '',
      badge: '',
      desktopImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=80',
      mobileImage: '',
      ctaText: 'Shop Collection',
      ctaLink: '/products',
      order: banners.length + 1,
      isActive: true,
      textColor: 'light',
      alignment: 'left'
    });
    setModalOpen(true);
  };

  const openEditModal = (banner: BannerItem) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      badge: banner.badge || '',
      desktopImage: banner.desktopImage || '',
      mobileImage: banner.mobileImage || '',
      ctaText: banner.ctaText || 'Shop Collection',
      ctaLink: banner.ctaLink || '/products',
      order: banner.order ?? 0,
      isActive: banner.isActive !== false,
      textColor: banner.textColor || 'light',
      alignment: banner.alignment || 'left'
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.desktopImage.trim()) {
      showToast('Title and Desktop Image URL are required', 'error');
      return;
    }

    try {
      if (editingBanner) {
        const id = editingBanner._id || editingBanner.id!;
        await bannerService.updateBanner(id, form);
        showToast('Banner updated successfully', 'success');
      } else {
        await bannerService.createBanner(form);
        showToast('Banner created successfully', 'success');
      }
      setModalOpen(false);
      loadBanners();
    } catch (err: any) {
      showToast(err.message || 'Error saving banner', 'error');
    }
  };

  const handleDelete = async (banner: BannerItem) => {
    if (!window.confirm(`Are you sure you want to delete banner "${banner.title}"?`)) return;
    try {
      const id = banner._id || banner.id!;
      await bannerService.deleteBanner(id);
      showToast('Banner removed', 'success');
      loadBanners();
    } catch (err: any) {
      showToast(err.message || 'Error deleting banner', 'error');
    }
  };

  const handleToggleActive = async (banner: BannerItem) => {
    try {
      const id = banner._id || banner.id!;
      await bannerService.updateBanner(id, { isActive: !banner.isActive });
      showToast(`Banner ${!banner.isActive ? 'activated' : 'deactivated'}`, 'info');
      loadBanners();
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  const currentPreviewBanner = banners[previewSlideIdx] || banners[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 font-serif">Hero Banners Manager</h1>
            <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200">
              {banners.length} Slides
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage high-resolution luxury hero slides, marketing badges, and CTA routes displayed on the customer storefront.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Hero Slide
        </button>
      </div>

      {/* Live Storefront Carousel Simulator */}
      {banners.length > 0 && currentPreviewBanner && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-rose-600" /> Live Storefront Carousel Simulator
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewSlideIdx((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                aria-label="Previous preview slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-500 font-medium">
                {previewSlideIdx + 1} / {banners.length}
              </span>
              <button
                onClick={() => setPreviewSlideIdx((prev) => (prev + 1) % banners.length)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                aria-label="Next preview slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden aspect-[21/9] sm:aspect-[21/8] bg-slate-900 flex items-center">
            <img
              src={currentPreviewBanner.desktopImage}
              alt={currentPreviewBanner.title}
              className="absolute inset-0 w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent"></div>

            <div
              className={`relative z-10 p-6 sm:p-12 max-w-xl ${
                currentPreviewBanner.alignment === 'center'
                  ? 'mx-auto text-center'
                  : currentPreviewBanner.alignment === 'right'
                  ? 'ml-auto text-right'
                  : 'text-left'
              }`}
            >
              {currentPreviewBanner.badge && (
                <span className="inline-block bg-rose-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2 shadow-xs">
                  {currentPreviewBanner.badge}
                </span>
              )}
              <h2 className="text-xl sm:text-3xl md:text-4xl font-serif font-extrabold text-white tracking-wide uppercase leading-tight drop-shadow-md">
                {currentPreviewBanner.title}
              </h2>
              {currentPreviewBanner.subtitle && (
                <p className="text-xs sm:text-sm text-slate-200 mt-2 line-clamp-2 max-w-md">
                  {currentPreviewBanner.subtitle}
                </p>
              )}
              <div className="mt-4">
                <span className="inline-block bg-white text-slate-900 font-bold text-xs px-5 py-2.5 rounded-full shadow-md">
                  {currentPreviewBanner.ctaText || 'Shop Collection'} &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banners Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm">
            Loading hero banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Banners Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Add your first hero banner slide to showcase festive collections on your storefront.
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
            >
              <Plus className="w-4 h-4" /> Add Slide
            </button>
          </div>
        ) : (
          banners.map((banner, index) => (
            <div
              key={banner._id || banner.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
                banner.isActive ? 'border-slate-200 shadow-xs' : 'border-slate-200/60 opacity-60 bg-slate-50/50'
              }`}
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[16/9] bg-slate-900">
                <img
                  src={banner.desktopImage}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Order #{banner.order}
                  </span>
                  {banner.badge && (
                    <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {banner.badge}
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition shadow-xs ${
                      banner.isActive
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* Banner Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm truncate" title={banner.title}>
                    {banner.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {banner.subtitle || 'No subtitle specified'}
                  </p>
                  
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-800">CTA:</span>
                    <span className="truncate">{banner.ctaText} &rarr; {banner.ctaLink}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 capitalize">
                    {banner.alignment} align · {banner.textColor}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(banner)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                      title="Edit banner"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner)}
                      className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                      title="Delete banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Banner Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-base font-serif">
                {editingBanner ? 'Edit Hero Banner' : 'Create New Hero Banner'}
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
                <label className="block font-semibold text-slate-700 mb-1">
                  Main Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ROYAL SURAT SILK SAREES"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subtitle Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Direct from master weavers in Surat. Pure Zari Banarasi & Kanjivaram masterpieces."
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Badge Pill Text (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FESTIVE EDIT 2026"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Slide Display Order
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Desktop Banner Image URL * (Landscape: ~1920x800)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={form.desktopImage}
                  onChange={(e) => setForm({ ...form, desktopImage: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                />
                {form.desktopImage && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 aspect-[21/9] bg-slate-100 max-h-36">
                    <img
                      src={form.desktopImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mobile Banner Image URL (Optional portrait/square)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (optional)"
                  value={form.mobileImage}
                  onChange={(e) => setForm({ ...form, mobileImage: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={form.ctaText}
                    onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    CTA Target Link / Route
                  </label>
                  <input
                    type="text"
                    value={form.ctaLink}
                    onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Text Alignment
                  </label>
                  <select
                    value={form.alignment}
                    onChange={(e) => setForm({ ...form, alignment: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                  >
                    <option value="left">Left Aligned</option>
                    <option value="center">Centered</option>
                    <option value="right">Right Aligned</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={form.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setForm({ ...form, isActive: e.target.value === 'active' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                  >
                    <option value="active">Active (Visible on Storefront)</option>
                    <option value="inactive">Draft / Inactive</option>
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
                  {editingBanner ? 'Save Changes' : 'Create Hero Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
