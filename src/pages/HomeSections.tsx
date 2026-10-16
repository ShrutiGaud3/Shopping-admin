import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
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
  ExternalLink,
  Flame,
  Grid3X3,
  Image as ImageIcon
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
    type: 'bestselling_categories' as
      | 'story_circles'
      | 'product_grid'
      | 'banner_grid'
      | 'campaign_banner'
      | 'bestselling_categories',
    order: 0,
    isActive: true,
    filterBy: 'trending' as 'trending' | 'deal' | 'new' | 'category' | 'all',
    category: '',
    limit: 8,
    description: '',
    ctaText: 'View All',
    ctaLink: '/products',
    secondaryCtaText: '',
    secondaryCtaLink: '',
    badge: 'WEAVERA WHOLESALE',
    banners: [
      {
        tag: 'WEIGHTLESS',
        title: 'LEHENGAS',
        link: '/products?category=Lehengas',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
        description: 'Swirling silhouettes with artisanal zardozi & can-can flair',
        badge: '',
        subtitle: ''
      },
      {
        tag: 'CLASSIC',
        title: 'SALWAR SUITS',
        link: '/products?category=Salwar%20Suits',
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
        description: 'Breezy anarkalis, festive shararas & straight cut elegance',
        badge: '',
        subtitle: ''
      },
      {
        tag: 'STELLAR',
        title: 'SAREES',
        link: '/products?category=Sarees',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        description: 'Royal Banarasi, Kanjivaram & Organza zari masterpieces',
        badge: '',
        subtitle: ''
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

  const openAddModal = (presetType?: typeof form.type) => {
    setEditingSection(null);
    const selectedType = presetType || 'bestselling_categories';

    let initialBanners = [
      {
        tag: 'WEIGHTLESS',
        title: 'LEHENGAS',
        link: '/products?category=Lehengas',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
        description: 'Swirling silhouettes with artisanal zardozi & can-can flair',
        badge: '',
        subtitle: ''
      },
      {
        tag: 'CLASSIC',
        title: 'SALWAR SUITS',
        link: '/products?category=Salwar%20Suits',
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
        description: 'Breezy anarkalis, festive shararas & straight cut elegance',
        badge: '',
        subtitle: ''
      },
      {
        tag: 'STELLAR',
        title: 'SAREES',
        link: '/products?category=Sarees',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        description: 'Royal Banarasi, Kanjivaram & Organza zari masterpieces',
        badge: '',
        subtitle: ''
      }
    ];

    if (selectedType === 'campaign_banner') {
      initialBanners = [
        {
          tag: '',
          title: 'Our Global Wholesale Program!',
          link: '/contact?type=wholesale',
          image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=80',
          description: '',
          badge: 'WEAVERA WHOLESALE',
          subtitle: ''
        }
      ];
    }

    setForm({
      title:
        selectedType === 'bestselling_categories'
          ? 'SHOP BESTSELLING CATEGORIES'
          : selectedType === 'campaign_banner'
          ? 'Our Global Wholesale Program!'
          : '',
      subtitle:
        selectedType === 'bestselling_categories'
          ? 'Iconic ethnic silhouettes loved by thousands of brides, festive revelers & connoisseurs'
          : selectedType === 'campaign_banner'
          ? 'BUILD A BOOMING FASHION BUSINESS WITH'
          : '',
      type: selectedType,
      order: sections.length + 1,
      isActive: true,
      filterBy: 'trending',
      category: '',
      limit: 8,
      description:
        selectedType === 'campaign_banner'
          ? 'Source authentic handcrafted sarees, bridal lehengas & designer salwar suits direct from master looms with wholesale pricing, worldwide express shipping & custom tailor finishing.'
          : '',
      ctaText:
        selectedType === 'campaign_banner'
          ? 'SIGN UP NOW'
          : 'View All',
      ctaLink:
        selectedType === 'campaign_banner'
          ? '/contact?type=wholesale'
          : '/products',
      secondaryCtaText: selectedType === 'campaign_banner' ? 'EXPLORE BRIDAL' : '',
      secondaryCtaLink: selectedType === 'campaign_banner' ? '/products?category=Lehengas' : '',
      badge: 'WEAVERA WHOLESALE',
      banners: initialBanners
    });
    setModalOpen(true);
  };

  const openEditModal = (sec: HomeSectionItem) => {
    setEditingSection(sec);
    const campaignPromo = sec.config?.banners?.[0];

    setForm({
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      type: sec.type || 'product_grid',
      order: sec.order ?? 0,
      isActive: sec.isActive !== false,
      filterBy: sec.config?.filterBy || 'trending',
      category: sec.config?.category || '',
      limit: sec.config?.limit || 8,
      description: sec.config?.description || '',
      ctaText: sec.config?.ctaText || 'View All',
      ctaLink: sec.config?.ctaLink || '/products',
      secondaryCtaText: sec.config?.secondaryCtaText || '',
      secondaryCtaLink: sec.config?.secondaryCtaLink || '',
      badge: campaignPromo?.badge || 'WEAVERA WHOLESALE',
      banners:
        sec.config?.banners && sec.config.banners.length > 0
          ? sec.config.banners.map((b) => ({
              tag: b.tag || '',
              title: b.title || '',
              subtitle: b.subtitle || '',
              link: b.link || '/products',
              image: b.image || '',
              badge: b.badge || '',
              description: b.description || ''
            }))
          : [
              {
                tag: 'WEIGHTLESS',
                title: 'LEHENGAS',
                link: '/products?category=Lehengas',
                image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
                description: 'Swirling silhouettes with artisanal zardozi & can-can flair',
                badge: '',
                subtitle: ''
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

    let payloadBanners = form.banners;
    if (form.type === 'campaign_banner') {
      payloadBanners = [
        {
          image: form.banners[0]?.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=80',
          title: form.title,
          badge: form.badge,
          link: form.ctaLink,
          subtitle: form.subtitle,
          tag: '',
          description: form.description
        }
      ];
    } else if (form.type === 'story_circles') {
      payloadBanners = [];
    }

    const payload: Partial<HomeSectionItem> = {
      title: form.title,
      subtitle: form.subtitle,
      type: form.type,
      order: form.order,
      isActive: form.isActive,
      config: {
        filterBy: form.filterBy,
        category: form.category,
        limit: form.limit,
        description: form.description,
        ctaText: form.ctaText,
        ctaLink: form.ctaLink,
        secondaryCtaText: form.secondaryCtaText,
        secondaryCtaLink: form.secondaryCtaLink,
        banners: payloadBanners
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
      showToast(`Section ${!sec.isActive ? 'published to store' : 'hidden from store'}`, 'info');
      loadSections();
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  // Reorder up / down with instantaneous server sync
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    // Update order values sequentially
    const orderings = newSections.map((s, idx) => ({
      id: (s._id || s.id) as string,
      order: idx + 1
    }));

    // Optimistic UI update
    setSections(newSections.map((s, idx) => ({ ...s, order: idx + 1 })));

    try {
      await homeSectionService.reorderHomeSections(orderings);
      showToast('Section sequence updated', 'success');
      loadSections();
    } catch (err: any) {
      showToast('Failed to save order sequence', 'error');
      loadSections();
    }
  };

  const getTypeBadge = (type: string, filterBy?: string) => {
    switch (type) {
      case 'bestselling_categories':
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Grid3X3 className="w-3 h-3 text-amber-600" /> Bestselling Categories (3 Luxury Cards)
          </span>
        );
      case 'product_grid':
        if (filterBy === 'new') {
          return (
            <span className="bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-rose-500" /> New Arrivals (With Category Tabs)
            </span>
          );
        }
        if (filterBy === 'trending') {
          return (
            <span className="bg-orange-50 text-orange-800 border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" /> Trending Right Now
            </span>
          );
        }
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <LayoutGrid className="w-3 h-3 text-blue-500" /> Product Grid ({filterBy || 'live'})
          </span>
        );
      case 'campaign_banner':
        return (
          <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-500" /> Wholesale Campaign Banner (Editorial)
          </span>
        );
      case 'story_circles':
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CircleDot className="w-3 h-3 text-rose-500" /> Story Circles (Shop by Category)
          </span>
        );
      case 'banner_grid':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Columns3 className="w-3 h-3 text-emerald-500" /> Promotional Banner Grid
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Carousel Navigation Alert Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <ImageIcon className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm tracking-wide text-white">
              Hero Carousel Slides (Top of Homepage)
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Full-width luxury rotating hero slides with custom headlines, badges &amp; images.
            </p>
          </div>
        </div>
        <Link
          to="/banners"
          className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition shrink-0 shadow-sm"
        >
          <span>Manage Hero Banners</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 font-serif">
              Home Sections Visual Merchandiser
            </h1>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
              {sections.length} Active Blocks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reorder, edit, toggle visibility, and customize every section of the customer storefront (Bestselling Categories, New Arrivals, Wholesale Program, Trending Now).
          </p>
        </div>

        <button
          onClick={() => openAddModal()}
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
              className={`p-5 bg-white rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                sec.isActive
                  ? 'border-slate-200 shadow-xs'
                  : 'border-slate-200/60 opacity-60 bg-slate-50/50'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Order Index & Reorder Controls */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-600 cursor-pointer disabled:cursor-not-allowed"
                    title="Move section up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-7 h-7 rounded-lg bg-slate-100 font-bold text-slate-800 flex items-center justify-center text-xs">
                    #{sec.order}
                  </div>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === sections.length - 1}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-600 cursor-pointer disabled:cursor-not-allowed"
                    title="Move section down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm truncate">
                      {sec.title}
                    </h3>
                    {getTypeBadge(sec.type, sec.config?.filterBy)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {sec.subtitle || 'No subtitle configured'}
                  </p>

                  {/* Visual Preview / Summary Pills */}
                  <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                    {sec.type === 'bestselling_categories' && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        {(sec.config?.banners || []).map((b, i) => (
                          <span
                            key={i}
                            className="bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-md font-semibold text-[10px]"
                          >
                            {b.tag ? `${b.tag} · ` : ''}{b.title}
                          </span>
                        ))}
                      </div>
                    )}

                    {sec.type === 'product_grid' && (
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium border border-slate-200">
                        Filter: <strong className="capitalize">{sec.config?.filterBy || 'trending'}</strong> · Limit: {sec.config?.limit || 8} Products · CTA: &quot;{sec.config?.ctaText || 'View All'}&quot;
                      </span>
                    )}

                    {sec.type === 'campaign_banner' && (
                      <span className="bg-purple-50 text-purple-900 px-2 py-0.5 rounded-md text-[11px] font-medium border border-purple-200 flex items-center gap-1">
                        CTA: &quot;{sec.config?.ctaText || 'SIGN UP NOW'}&quot; · Secondary: &quot;{sec.config?.secondaryCtaText || 'EXPLORE BRIDAL'}&quot;
                      </span>
                    )}

                    {sec.type === 'story_circles' && (
                      <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded-md text-[11px] font-medium border border-rose-200">
                        Renders live ethnic category bubbles (Sarees, Lehengas, Salwar Suits)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                <button
                  onClick={() => handleToggleActive(sec)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full cursor-pointer transition ${
                    sec.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {sec.isActive ? 'Live on Store' : 'Draft (Hidden)'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(sec)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                    title="Edit section"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(sec)}
                    className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                    title="Delete section"
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
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-base font-serif">
                {editingSection ? `Edit Section: ${editingSection.title}` : 'Add New Home Section'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
              {/* Type Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Section Type *
                </label>
                <select
                  value={form.type}
                  onChange={(e) => {
                    const newType = e.target.value as any;
                    setForm({
                      ...form,
                      type: newType,
                      title:
                        newType === 'bestselling_categories' && !form.title
                          ? 'SHOP BESTSELLING CATEGORIES'
                          : newType === 'campaign_banner' && !form.title
                          ? 'Our Global Wholesale Program!'
                          : form.title
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
                >
                  <option value="bestselling_categories">
                    Shop Bestselling Categories (3 Luxury Cards - Screenshot 1)
                  </option>
                  <option value="product_grid">
                    Product Grid (Live DB Products: New Arrivals / Trending / Deals)
                  </option>
                  <option value="campaign_banner">
                    Wholesale &amp; Bridal Campaign Banner (Editorial - Screenshot 2)
                  </option>
                  <option value="story_circles">
                    Story Circles (Instagram Stories: Sarees, Lehengas, Suits)
                  </option>
                  <option value="banner_grid">
                    Promotional Banner Grid (Split 2 or 3 Cards)
                  </option>
                </select>
              </div>

              {/* Title & Subtitle */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Section Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SHOP BESTSELLING CATEGORIES or NEW ARRIVALS"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subtitle / Subhead
                </label>
                <input
                  type="text"
                  placeholder="e.g. BUILD A BOOMING FASHION BUSINESS WITH or Iconic ethnic silhouettes loved by thousands"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Display Sequence Order
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Storefront Visibility
                  </label>
                  <select
                    value={form.isActive ? 'active' : 'draft'}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.value === 'active' })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
                  >
                    <option value="active">Live on Storefront</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* ========================================================= */}
              {/* TYPE A: BESTSELLING CATEGORIES (3 CARDS) */}
              {/* ========================================================= */}
              {form.type === 'bestselling_categories' && (
                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-amber-950 text-xs">
                        Configure 3 Category Cards
                      </h4>
                      <p className="text-[11px] text-amber-800">
                        Customize the visual luxury cards shown in the House of Indya layout.
                      </p>
                    </div>
                  </div>

                  {form.banners.map((b, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white rounded-lg border border-amber-200/60 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-[11px]">
                          Card #{i + 1} ({b.title || 'Category'})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-medium text-slate-600 text-[10px] mb-0.5">
                            Tag / Sub-pill (e.g. WEIGHTLESS)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. WEIGHTLESS"
                            value={b.tag || ''}
                            onChange={(e) => {
                              const newBanners = [...form.banners];
                              newBanners[i].tag = e.target.value;
                              setForm({ ...form, banners: newBanners });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-slate-600 text-[10px] mb-0.5">
                            Category Title (e.g. LEHENGAS)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. LEHENGAS"
                            value={b.title}
                            onChange={(e) => {
                              const newBanners = [...form.banners];
                              newBanners[i].title = e.target.value;
                              setForm({ ...form, banners: newBanners });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-slate-600 text-[10px] mb-0.5">
                          Card Image URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={b.image}
                          onChange={(e) => {
                            const newBanners = [...form.banners];
                            newBanners[i].image = e.target.value;
                            setForm({ ...form, banners: newBanners });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs"
                        />
                        {b.image && (
                          <div className="mt-1 h-16 w-28 rounded-md overflow-hidden border border-slate-200 bg-slate-100">
                            <img
                              src={b.image}
                              alt="preview"
                              className="w-full h-full object-cover"
                              onError={(e) =>
                                ((e.target as HTMLElement).style.display = 'none')
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-medium text-slate-600 text-[10px] mb-0.5">
                            Target Link
                          </label>
                          <input
                            type="text"
                            placeholder="/products?category=Lehengas"
                            value={b.link}
                            onChange={(e) => {
                              const newBanners = [...form.banners];
                              newBanners[i].link = e.target.value;
                              setForm({ ...form, banners: newBanners });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-slate-600 text-[10px] mb-0.5">
                            Short Description / Craft Note
                          </label>
                          <input
                            type="text"
                            placeholder="Swirling silhouettes with artisanal zardozi"
                            value={b.description || ''}
                            onChange={(e) => {
                              const newBanners = [...form.banners];
                              newBanners[i].description = e.target.value;
                              setForm({ ...form, banners: newBanners });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ========================================================= */}
              {/* TYPE B: PRODUCT GRID (New Arrivals / Trending / Deals) */}
              {/* ========================================================= */}
              {form.type === 'product_grid' && (
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3">
                  <h4 className="font-bold text-blue-950 text-xs">
                    Product Grid Filter &amp; Display Rules
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Filter Products By
                      </label>
                      <select
                        value={form.filterBy}
                        onChange={(e) =>
                          setForm({ ...form, filterBy: e.target.value as any })
                        }
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                      >
                        <option value="new">
                          New Arrivals (With Interactive Category Tabs)
                        </option>
                        <option value="trending">
                          Trending Right Now (Flame Badge Layout)
                        </option>
                        <option value="deal">Deals of the Day (Discounted)</option>
                        <option value="category">Specific Category</option>
                        <option value="all">All Products</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Max Items to Show
                      </label>
                      <select
                        value={form.limit}
                        onChange={(e) =>
                          setForm({ ...form, limit: parseInt(e.target.value) || 8 })
                        }
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                      >
                        <option value="4">4 Products</option>
                        <option value="8">8 Products (Recommended)</option>
                        <option value="12">12 Products</option>
                        <option value="16">16 Products</option>
                      </select>
                    </div>
                  </div>

                  {form.filterBy === 'category' && (
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Category Selection
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800"
                      >
                        <option value="">Select Category</option>
                        <option value="Sarees">Sarees</option>
                        <option value="Lehengas">Lehengas</option>
                        <option value="Salwar Suits">Salwar Suits</option>
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        CTA Button Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. View All New Arrivals"
                        value={form.ctaText}
                        onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        CTA Target Route
                      </label>
                      <input
                        type="text"
                        placeholder="/products?sort=newest"
                        value={form.ctaLink}
                        onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TYPE C: CAMPAIGN BANNER (Wholesale Editorial Spotlight) */}
              {/* ========================================================= */}
              {form.type === 'campaign_banner' && (
                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-3">
                  <h4 className="font-bold text-purple-950 text-xs">
                    Editorial Campaign Banner Configuration
                  </h4>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Badge Text (Top Pill)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. WEAVERA WHOLESALE"
                      value={form.badge}
                      onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Background Image URL *
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={form.banners[0]?.image || ''}
                      onChange={(e) => {
                        const newB = [...form.banners];
                        if (newB[0]) newB[0].image = e.target.value;
                        setForm({ ...form, banners: newB });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800"
                    />
                    {form.banners[0]?.image && (
                      <div className="mt-1 h-20 w-44 rounded-md overflow-hidden border border-slate-200 bg-slate-100">
                        <img
                          src={form.banners[0].image}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            ((e.target as HTMLElement).style.display = 'none')
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Description / Program Pitch
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Source authentic handcrafted sarees, bridal lehengas & designer salwar suits..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Primary CTA Button (e.g. SIGN UP NOW)
                      </label>
                      <input
                        type="text"
                        value={form.ctaText}
                        onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Primary Route / Link
                      </label>
                      <input
                        type="text"
                        value={form.ctaLink}
                        onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Secondary CTA Button (e.g. EXPLORE BRIDAL)
                      </label>
                      <input
                        type="text"
                        placeholder="EXPLORE BRIDAL"
                        value={form.secondaryCtaText}
                        onChange={(e) =>
                          setForm({ ...form, secondaryCtaText: e.target.value })
                        }
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Secondary Route / Link
                      </label>
                      <input
                        type="text"
                        placeholder="/products?category=Lehengas"
                        value={form.secondaryCtaLink}
                        onChange={(e) =>
                          setForm({ ...form, secondaryCtaLink: e.target.value })
                        }
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TYPE D: PROMOTIONAL BANNER GRID */}
              {/* ========================================================= */}
              {form.type === 'banner_grid' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-xs">
                      Configured Promotional Cards
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          banners: [
                            ...form.banners,
                            {
                              image:
                                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
                              title: 'New Promo',
                              subtitle: '',
                              link: '/products',
                              badge: 'FEATURED',
                              tag: '',
                              description: ''
                            }
                          ]
                        })
                      }
                      className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      + Add Another Card
                    </button>
                  </div>

                  {form.banners.map((b, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 text-[11px]">
                          Card #{i + 1}
                        </span>
                        {form.banners.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                banners: form.banners.filter((_, idx) => idx !== i)
                              })
                            }
                            className="text-rose-600 hover:text-rose-700 text-[10px] cursor-pointer"
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
                          placeholder="Badge (e.g. BESTSELLER)"
                          value={b.badge || ''}
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

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 cursor-pointer transition shadow-xs"
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
