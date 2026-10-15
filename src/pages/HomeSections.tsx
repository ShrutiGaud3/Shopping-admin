import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  X,
  LayoutGrid,
  CircleDot,
  Columns3,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Eye,
  Check
} from 'lucide-react';
import { homeSectionService } from '../services/homeSectionService';
import { useAuth } from '../context/AuthContext';
import type { HomeSectionItem } from '../types';

export const HomeSections: React.FC = () => {
  const [sections, setSections] = useState<HomeSectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<HomeSectionItem | null>(null);
  const { showToast } = useAuth();

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    type: 'product_grid' as 'story_circles' | 'product_grid' | 'banner_grid' | 'campaign_banner',
    order: 0,
    isActive: true,
    filterBy: 'trending' as 'trending' | 'deal' | 'new' | 'category' | 'all',
    category: '',
    limit: 8,
    ctaText: 'View All',
    ctaLink: '/products',
    banners: [
      {
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        title: 'Pure Silk Sarees',
        subtitle: 'Banarasi & Kanjivaram',
        link: '/products?category=Sarees',
        badge: 'HERITAGE'
      },
      {
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        title: 'Bridal Lehengas',
        subtitle: 'Velvet & Georgette',
        link: '/products?category=Lehengas',
        badge: 'BRIDAL'
      }
    ]
  });

  const loadSections = async () => {
    setLoading(true);
    try {
      const data = await homeSectionService.getAllHomeSections();
      setSections(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch home sections', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const openAddModal = () => {
    setEditingSection(null);
    setForm({
      title: '',
      subtitle: '',
      type: 'product_grid',
      order: sections.length + 1,
      isActive: true,
      filterBy: 'trending',
      category: '',
      limit: 8,
      ctaText: 'View All',
      ctaLink: '/products',
      banners: [
        {
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
          title: 'Special Collection',
          subtitle: 'Direct from Surat',
          link: '/products',
          badge: 'FEATURED'
        }
      ]
    });
    setModalOpen(true);
  };

  const openEditModal = (sec: HomeSectionItem) => {
    setEditingSection(sec);
    setForm({
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      type: sec.type || 'product_grid',
      order: sec.order ?? 0,
      isActive: sec.isActive !== false,
      filterBy: sec.config?.filterBy || 'trending',
      category: sec.config?.category || '',
      limit: sec.config?.limit || 8,
      ctaText: sec.config?.ctaText || 'View All',
      ctaLink: sec.config?.ctaLink || '/products',
      banners: sec.config?.banners && sec.config.banners.length > 0 ? sec.config.banners : [
        {
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
          title: 'Collection',
          subtitle: '',
          link: '/products',
          badge: ''
        }
      ]
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      type: form.type,
      order: form.order,
      isActive: form.isActive,
      config: {
        filterBy: form.filterBy,
        category: form.category,
        limit: form.limit,
        ctaText: form.ctaText,
        ctaLink: form.ctaLink,
        banners: form.type === 'banner_grid' || form.type === 'campaign_banner' ? form.banners : []
      }
    };

    try {
      if (editingSection) {
        const id = editingSection._id || editingSection.id!;
        await homeSectionService.updateHomeSection(id, payload);
        showToast('Section updated successfully', 'success');
      } else {
        await homeSectionService.createHomeSection(payload);
        showToast('Section created successfully', 'success');
      }
      setModalOpen(false);
      loadSections();
    } catch (err: any) {
      showToast(err.message || 'Error saving section', 'error');
    }
  };

  const handleDelete = async (sec: HomeSectionItem) => {
    if (!window.confirm(`Delete section "${sec.title}"?`)) return;
    try {
      const id = sec._id || sec.id!;
      await homeSectionService.deleteHomeSection(id);
      showToast('Section deleted', 'success');
      loadSections();
    } catch (err: any) {
      showToast(err.message || 'Error deleting section', 'error');
    }
  };

  const handleToggleActive = async (sec: HomeSectionItem) => {
    try {
      const id = sec._id || sec.id!;
      await homeSectionService.updateHomeSection(id, { isActive: !sec.isActive });
      showToast(`Section ${!sec.isActive ? 'published' : 'hidden'}`, 'info');
      loadSections();
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'story_circles':
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CircleDot className="w-3 h-3 text-rose-500" /> Story Circles
          </span>
        );
      case 'product_grid':
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <LayoutGrid className="w-3 h-3 text-blue-500" /> Product Grid
          </span>
        );
      case 'banner_grid':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Columns3 className="w-3 h-3 text-amber-500" /> Banner Grid
          </span>
        );
      case 'campaign_banner':
        return (
          <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-500" /> Spotlight Card
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 font-serif">Home Sections &amp; Visual Merchandiser</h1>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
              {sections.length} Blocks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Control the layout and merchandising blocks on the customer homepage (Story Circles, Trending Grids, Promos, Spotlights).
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Home Section
        </button>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
            Loading homepage layout blocks...
          </div>
        ) : sections.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
            No sections found. Click Add to create one.
          </div>
        ) : (
          sections.map((sec, index) => (
            <div
              key={sec._id || sec.id}
              className={`p-5 bg-white rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                sec.isActive ? 'border-slate-200 shadow-xs' : 'border-slate-200/60 opacity-60 bg-slate-50/50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 font-bold text-slate-700 flex items-center justify-center shrink-0 text-xs">
                  #{sec.order}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm">{sec.title}</h3>
                    {getTypeBadge(sec.type)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{sec.subtitle || 'No subtitle'}</p>

                  {/* Config Pill summary */}
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-3">
                    {sec.type === 'product_grid' && (
                      <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        Filter: <strong className="text-slate-800 capitalize">{sec.config?.filterBy || 'trending'}</strong> · Limit: {sec.config?.limit || 8} items
                      </span>
                    )}
                    {(sec.type === 'banner_grid' || sec.type === 'campaign_banner') && (
                      <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {sec.config?.banners?.length || 0} Promo Card(s) Configured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  onClick={() => handleToggleActive(sec)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full cursor-pointer transition ${
                    sec.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {sec.isActive ? 'Live on Store' : 'Draft'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(sec)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                    title="Edit block"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(sec)}
                    className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                    title="Delete block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Section Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-base font-serif">
                {editingSection ? 'Edit Home Section' : 'Add New Home Section'}
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
                <label className="block font-semibold text-slate-700 mb-1">Section Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trending Wedding & Festive Hits"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle / Subhead</label>
                <input
                  type="text"
                  placeholder="e.g. Handcrafted treasures curated for brides and bridesmaids"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section Block Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                  >
                    <option value="story_circles">Story Circles (Instagram style)</option>
                    <option value="product_grid">Product Grid (Live DB products)</option>
                    <option value="banner_grid">Banner Grid (Split 2/3 promos)</option>
                    <option value="campaign_banner">Spotlight / Campaign Card</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Sequence Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              {/* Conditional Type Configs */}
              {form.type === 'product_grid' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs">Product Grid Filter Rules</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Filter Products By</label>
                      <select
                        value={form.filterBy}
                        onChange={(e) => setForm({ ...form, filterBy: e.target.value as any })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                      >
                        <option value="trending">Trending Products</option>
                        <option value="deal">Deals of the Day (Discounted)</option>
                        <option value="new">New Arrivals</option>
                        <option value="category">Specific Category</option>
                        <option value="all">All Products</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Item Limit</label>
                      <select
                        value={form.limit}
                        onChange={(e) => setForm({ ...form, limit: parseInt(e.target.value) || 8 })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                      >
                        <option value="4">4 Products</option>
                        <option value="8">8 Products</option>
                        <option value="12">12 Products</option>
                      </select>
                    </div>
                  </div>

                  {form.filterBy === 'category' && (
                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Category Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sarees or Lehengas"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800"
                      />
                    </div>
                  )}
                </div>
              )}

              {(form.type === 'banner_grid' || form.type === 'campaign_banner') && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-xs">Configured Promotional Banners</h4>
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          banners: [
                            ...form.banners,
                            {
                              image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
                              title: 'New Promo',
                              subtitle: '',
                              link: '/products',
                              badge: ''
                            }
                          ]
                        })
                      }
                      className="text-[11px] font-bold text-indigo-600 hover:underline"
                    >
                      + Add Another Card
                    </button>
                  </div>

                  {form.banners.map((b, i) => (
                    <div key={i} className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 text-[11px]">Card #{i + 1}</span>
                        {form.banners.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                banners: form.banners.filter((_, idx) => idx !== i)
                              })
                            }
                            className="text-rose-600 hover:text-rose-700 text-[10px]"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Card Title"
                          value={b.title}
                          onChange={(e) => {
                            const newBanners = [...form.banners];
                            newBanners[i].title = e.target.value;
                            setForm({ ...form, banners: newBanners });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Badge (e.g. HERITAGE)"
                          value={b.badge}
                          onChange={(e) => {
                            const newBanners = [...form.banners];
                            newBanners[i].badge = e.target.value;
                            setForm({ ...form, banners: newBanners });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs"
                        />
                      </div>

                      <input
                        type="url"
                        placeholder="Image URL"
                        value={b.image}
                        onChange={(e) => {
                          const newBanners = [...form.banners];
                          newBanners[i].image = e.target.value;
                          setForm({ ...form, banners: newBanners });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs"
                      />

                      <input
                        type="text"
                        placeholder="Target Link (e.g. /products?category=Sarees)"
                        value={b.link}
                        onChange={(e) => {
                          const newBanners = [...form.banners];
                          newBanners[i].link = e.target.value;
                          setForm({ ...form, banners: newBanners });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}

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
                  {editingSection ? 'Save Changes' : 'Create Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
