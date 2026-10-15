import React, { useEffect, useState } from 'react';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import type { Category } from '../types';
import {
  FolderTree,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  Layers,
  ChevronRight,
  Eye,
  Check
} from 'lucide-react';

export const Categories: React.FC = () => {
  const { showToast } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [gender, setGender] = useState('Women');
  const [parent, setParent] = useState('');
  const [type, setType] = useState<'category' | 'occasion' | 'festival' | 'collection'>('category');
  const [order, setOrder] = useState(1);
  const [showInMenu, setShowInMenu] = useState(true);
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories();
      if (res && res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setActiveCategoryId(null);
    setName('');
    setImage('');
    setGender('Women');
    setParent('');
    setType('category');
    setOrder((categories.length || 0) + 1);
    setShowInMenu(true);
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setIsEditing(true);
    setActiveCategoryId(cat.id || cat._id || '');
    setName(cat.name);
    setImage(cat.image);
    setGender(cat.gender || 'Women');
    const parentId = typeof cat.parent === 'object' && cat.parent !== null ? cat.parent._id : cat.parent || '';
    setParent(parentId);
    setType(cat.type || 'category');
    setOrder(cat.order || 1);
    setShowInMenu(cat.showInMenu !== undefined ? cat.showInMenu : true);
    setDescription(cat.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter category name', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<Category> = {
        name: name.trim(),
        image: image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        gender,
        parent: parent ? parent : null,
        type,
        order: Number(order),
        showInMenu,
        description: description.trim()
      };

      if (isEditing && activeCategoryId) {
        await categoryService.updateCategory(activeCategoryId, payload);
        showToast('Category updated successfully', 'success');
      } else {
        await categoryService.createCategory(payload);
        showToast('New category created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to save category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!window.confirm(`Delete category "${catName}"? Any subcategories will become root categories.`)) return;
    try {
      await categoryService.deleteCategory(id);
      showToast(`Deleted category "${catName}"`, 'success');
      setCategories((prev) => prev.filter((c) => (c.id || c._id) !== id));
    } catch (err) {
      showToast('Failed to delete category', 'error');
    }
  };

  // Separate root categories and subcategories
  const rootCategories = categories.filter((c) => !c.parent || (typeof c.parent === 'object' && !c.parent?._id));
  const subCategories = categories.filter((c) => c.parent && (typeof c.parent === 'string' || c.parent?._id));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide">
            Product Categories & Mega Menu Hierarchy
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage root departments, subcategories, festival collections, and navigation menus</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Grid ({categories.length})
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                viewMode === 'tree' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Menu Tree View
            </button>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span>Loading categories...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <FolderTree className="w-8 h-8 text-slate-300" />
          <span>No categories found. Click Add to create one.</span>
        </div>
      ) : viewMode === 'tree' ? (
        /* Mega Menu Hierarchical Tree View */
        <div className="space-y-4">
          {rootCategories.map((root) => {
            const rootId = root.id || root._id || '';
            const children = subCategories.filter((sub) => {
              const pId = typeof sub.parent === 'object' && sub.parent !== null ? sub.parent._id : sub.parent;
              return pId === rootId;
            });

            return (
              <div key={rootId} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={root.image}
                      alt={root.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{root.name}</h3>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {root.type || 'category'}
                        </span>
                        {root.showInMenu && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            In Menu
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">/{root.slug} • Order #{root.order}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(root)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(rootId, root.name)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subcategories */}
                {children.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 pl-6 sm:pl-12 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Nested Subcategories ({children.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {children.map((sub) => {
                        const subId = sub.id || sub._id || '';
                        return (
                          <div
                            key={subId}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                          >
                            <div>
                              <p className="font-bold text-slate-800">{sub.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">/{sub.slug}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditModal(sub)}
                                className="p-1 text-slate-500 hover:text-slate-800"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDelete(subId, sub.name)}
                                className="p-1 text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Regular Categories Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const catId = cat.id || cat._id || '';
            const parentName = typeof cat.parent === 'object' && cat.parent !== null ? cat.parent.name : null;

            return (
              <div
                key={catId}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-emerald-500/40 hover:shadow-md transition shadow-xs flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80');
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:text-slate-900 hover:bg-white shadow-xs transition cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(catId, cat.name)}
                      className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-xs transition cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-400/30">
                        {cat.type || 'category'}
                      </span>
                      {parentName && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-400/30">
                          Sub of {parentName}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mt-1 drop-shadow-sm">{cat.name}</h3>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Slug: <code className="text-slate-800 font-mono text-[11px] font-semibold">{cat.slug}</code></span>
                  <span className="font-bold text-slate-800">Order #{cat.order || 0}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 z-10 text-xs text-slate-900">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-emerald-600" />
                <span>{isEditing ? 'Edit Category' : 'Create Category'}</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarees or Banarasi Silk Sarees"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                />
              </div>

              {/* Parent Category Selector */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Parent Category (For Subcategories)</label>
                <select
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-emerald-500"
                >
                  <option value="">None (Top-Level Main Category)</option>
                  {rootCategories
                    .filter((c) => (c.id || c._id) !== activeCategoryId)
                    .map((c) => (
                      <option key={c.id || c._id} value={c.id || c._id}>
                        {c.name}
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">If selected, this category will appear inside the parent's Mega Menu dropdown.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Menu Classification</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
                  >
                    <option value="category">Category (Sarees, Lehengas)</option>
                    <option value="occasion">Occasion (Wedding, Sangeet)</option>
                    <option value="festival">Festival (Navratri, Diwali)</option>
                    <option value="collection">Collection (Ready to Ship)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Menu Sort Order</label>
                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="showInMenuToggle"
                  checked={showInMenu}
                  onChange={(e) => setShowInMenu(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="showInMenuToggle" className="text-slate-800 font-bold cursor-pointer">
                  Display in Storefront Header Mega Menu
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
                  <span>{isEditing ? 'Save Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
