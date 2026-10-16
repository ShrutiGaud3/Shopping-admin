import React, { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import type { Product, Category, StitchOption } from '../types';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Package,
  X,
  Loader2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Scissors,
  Sparkles,
  Video
} from 'lucide-react';

export const Products: React.FC = () => {
  const { showToast } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  // Form Data State
  const initialFormState = {
    name: '',
    brand: 'Weavera',
    category: 'Sarees',
    gender: 'Women' as 'Women' | 'Men' | 'Kids' | 'Unisex',
    price: 1899,
    originalPrice: 3499,
    stock: 25,
    image: '',
    images: [] as string[],
    description: '',
    sizes: ['Free Size', 'Unstitched'],
    colors: [{ name: 'Royal Red', hex: '#DC2626' }],
    isFeatured: false,
    isTrending: false,

    // Phase 3 Ethnic fields
    fabric: '',
    work: '',
    occasion: '',
    washCare: 'Dry Clean Recommended',
    setContents: '',
    sareeLength: '',
    lehengaFlare: '',
    dispatchTime: 'Dispatched in 24-48 Hours',
    videoUrl: '',
    stitchOptions: [
      { type: 'Unstitched', price: 0, description: 'Standard unstitched fabric set with margin' },
      { type: 'Semi-Stitched + Fall & Pico', price: 299, description: 'Ready to drape with professional fall & pico' },
      { type: 'Custom Tailored Blouse / Kurti', price: 699, description: 'Surat master tailor stitching as per custom measurements' }
    ] as StitchOption[]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageInput, setImageInput] = useState('');
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#000000');

  // Stitching inputs
  const [stitchType, setStitchType] = useState('');
  const [stitchPrice, setStitchPrice] = useState<number>(0);
  const [stitchDesc, setStitchDesc] = useState('');

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Unstitched', 'Semi-Stitched'];

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories()
      ]);
      if (prodRes && prodRes.success) setProducts(prodRes.data);
      if (catRes && catRes.success) setCategories(catRes.data);
    } catch (err) {
      showToast('Failed to load products from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setActiveProductId(null);
    setFormData(initialFormState);
    setImageInput('');
    setStitchType('');
    setStitchPrice(0);
    setStitchDesc('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setIsEditing(true);
    setActiveProductId(prod.id || prod._id || '');
    setFormData({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      gender: prod.gender,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock !== undefined ? prod.stock : 20,
      image: prod.image,
      images: prod.images || [prod.image],
      description: prod.description,
      sizes: prod.sizes || ['Free Size'],
      colors: prod.colors || [{ name: 'Default', hex: '#000000' }],
      isFeatured: Boolean(prod.isFeatured),
      isTrending: Boolean(prod.isTrending),

      fabric: prod.fabric || '',
      work: prod.work || '',
      occasion: prod.occasion || '',
      washCare: prod.washCare || 'Dry Clean Recommended',
      setContents: prod.setContents || '',
      sareeLength: prod.sareeLength || '',
      lehengaFlare: prod.lehengaFlare || '',
      dispatchTime: prod.dispatchTime || 'Dispatched in 24-48 Hours',
      videoUrl: prod.videoUrl || '',
      stitchOptions: prod.stitchOptions || []
    });
    setImageInput('');
    setStitchType('');
    setStitchPrice(0);
    setStitchDesc('');
    setIsModalOpen(true);
  };

  const handleAddStitchOption = () => {
    if (!stitchType.trim()) return;
    setFormData((prev) => ({
      ...prev,
      stitchOptions: [
        ...(prev.stitchOptions || []),
        { type: stitchType.trim(), price: Number(stitchPrice) || 0, description: stitchDesc.trim() }
      ]
    }));
    setStitchType('');
    setStitchPrice(0);
    setStitchDesc('');
  };

  const handleRemoveStitchOption = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      stitchOptions: (prev.stitchOptions || []).filter((_, i) => i !== idx)
    }));
  };

  const handleApplySuratStitchPresets = () => {
    setFormData((prev) => ({
      ...prev,
      stitchOptions: [
        { type: 'Unstitched', price: 0, description: 'Standard unstitched fabric set with margin' },
        { type: 'Semi-Stitched + Fall & Pico', price: 299, description: 'Ready to drape with professional fall & pico' },
        { type: 'Custom Tailored Blouse / Kurti', price: 699, description: 'Surat master tailor stitching as per custom measurements' }
      ]
    }));
    showToast('Applied Surat master tailor stitching presets!', 'success');
  };

  const handleToggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleAddColor = () => {
    if (!colorName) return;
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: colorName, hex: colorHex }]
    }));
    setColorName('');
    setColorHex('#000000');
  };

  const handleRemoveColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleAddGalleryImage = () => {
    if (!imageInput) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageInput]
    }));
    setImageInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast('Please provide product name and price', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const primaryImg = formData.image || formData.images[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';
      const payload = {
        ...formData,
        image: primaryImg,
        images: formData.images.length > 0 ? formData.images : [primaryImg]
      };

      if (isEditing && activeProductId) {
        await productService.updateProduct(activeProductId, payload);
        showToast('Product updated successfully', 'success');
      } else {
        await productService.createProduct(payload);
        showToast('New product created successfully', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }
    try {
      await productService.deleteProduct(id);
      showToast(`Deleted "${name}"`, 'success');
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
    } catch (err: any) {
      showToast('Failed to delete product', 'error');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide">
            Product Catalog Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Add, edit, inspect, and manage products and inventory styles</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by title, brand, SKU..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:bg-white focus:border-emerald-500 transition"
          >
            <option value="">All Categories ({products.length})</option>
            {Array.from(new Set([
              'Sarees',
              'Lehengas',
              'Salwar Suits',
              ...categories.map((c) => c.name),
              ...products.map((p) => p.category)
            ]))
              .filter((cat) => {
                const lower = (cat || '').toLowerCase();
                return ['saree', 'lehenga', 'suit', 'salwar', 'anarkali', 'sharara', 'silk'].some((k) => lower.includes(k));
              })
              .map((catName) => (
                <option key={catName} value={catName}>
                  {catName}
                </option>
              ))}
          </select>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span>Loading product catalog...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Package className="w-8 h-8 text-slate-400" />
            <span>No products matching your search criteria.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Item Details</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Price</th>
                  <th className="py-3 px-4 font-bold">Stock</th>
                  <th className="py-3 px-4 font-bold">Variants</th>
                  <th className="py-3 px-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const prodId = p.id || p._id || '';
                  return (
                    <tr key={prodId} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || p.images?.[0]}
                            alt={p.name}
                            className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80');
                            }}
                          />
                          <div>
                            <p className="font-bold text-slate-900 hover:text-emerald-700 transition">{p.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{p.brand} • <span className="font-mono text-emerald-700">{p.sku || 'SKU-STD'}</span></p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                          {p.category}
                        </span>
                        {p.fabric && (
                          <span className="block mt-1 text-[10px] text-amber-800 font-semibold truncate max-w-[130px]" title={p.fabric}>
                            🧵 {p.fabric}
                          </span>
                        )}
                        {p.stitchOptions && p.stitchOptions.length > 0 && (
                          <span className="inline-block mt-0.5 text-[9px] text-slate-500 font-medium">
                            ✂️ {p.stitchOptions.length} stitching {p.stitchOptions.length === 1 ? 'option' : 'options'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">₹{p.price.toLocaleString()}</div>
                        {p.originalPrice > p.price && (
                          <div className="text-[10px] text-slate-400 line-through">₹{p.originalPrice.toLocaleString()}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          (p.stock || 0) === 0
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : (p.stock || 0) <= 10
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {p.stock !== undefined ? p.stock : 25} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[11px] text-slate-700 font-medium">{p.sizes?.join(', ') || 'Standard'}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {(p.colors || []).slice(0, 4).map((c, i) => (
                            <span
                              key={i}
                              title={c.name}
                              className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shadow-xs"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(prodId, p.name)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                            title="Delete Product"
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-y-auto p-6 z-10 text-slate-900">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <span>{isEditing ? 'Edit Product Item' : 'Create New Product'}</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Product Title */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pure Kanjivaram Silk Saree or Bridal Heritage Velvet Lehenga"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                />
              </div>

              {/* Grid Row: Brand & Category (Gender Section Removed) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Brand / Collection *</label>
                  <input
                    type="text"
                    list="brand-suggestions"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Weavera or Weavera Bridal"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                  <datalist id="brand-suggestions">
                    <option value="Weavera" />
                    <option value="Weavera Heritage" />
                    <option value="Weavera Bridal" />
                    <option value="Weavera Silk" />
                    <option value="Weavera Studio" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                  >
                    <optgroup label="Main Categories">
                      <option value="Sarees">Sarees</option>
                      <option value="Lehengas">Lehengas</option>
                      <option value="Salwar Suits">Salwar Suits</option>
                    </optgroup>
                    {categories
                      .filter((c) => {
                        const n = c.name?.trim();
                        return (
                          n &&
                          !['Sarees', 'Lehengas', 'Salwar Suits'].includes(n) &&
                          ['saree', 'lehenga', 'suit', 'salwar', 'anarkali', 'sharara', 'silk'].some((k) =>
                            n.toLowerCase().includes(k)
                          )
                        );
                      })
                      .length > 0 && (
                      <optgroup label="Ethnic Subcategories">
                        {categories
                          .filter((c) => {
                            const n = c.name?.trim();
                            return (
                              n &&
                              !['Sarees', 'Lehengas', 'Salwar Suits'].includes(n) &&
                              ['saree', 'lehenga', 'suit', 'salwar', 'anarkali', 'sharara', 'silk'].some((k) =>
                                n.toLowerCase().includes(k)
                              )
                            );
                          })
                          .map((cat) => (
                            <option key={cat.id || cat._id || cat.name} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              </div>

              {/* Grid Row: Price, Original Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">MRP / Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Warehouse Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Primary Image URL */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Primary Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                />
              </div>

              {/* Gallery Images Add */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Gallery Image URLs</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Paste image URL..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative group w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-xs">
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) })}
                          className="absolute inset-0 bg-rose-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sizes Selection */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = formData.sizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => handleToggleSize(size)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Color Palette</label>
                <div className="flex gap-2 items-center mb-2">
                  <input
                    type="text"
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    placeholder="Color Name (e.g. Navy)"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900"
                  />
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 p-1 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Add Color
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800"
                    >
                      <span className="w-3 h-3 rounded-full border border-slate-300 shadow-xs" style={{ backgroundColor: c.hex }} />
                      <span className="font-semibold">{c.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(i)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Surat Ethnic Wear Specifications */}
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-slate-900 text-xs">Surat Ethnic Wear Specifications</span>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Suratikart Catalog Fields
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Fabric / Weave</label>
                    <input
                      type="text"
                      value={formData.fabric}
                      onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                      placeholder="e.g. Pure Kanjivaram Silk, Georgette"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Work / Embroidery</label>
                    <input
                      type="text"
                      value={formData.work}
                      onChange={(e) => setFormData({ ...formData, work: e.target.value })}
                      placeholder="e.g. Zari Woven & Resham Work"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Occasion</label>
                    <input
                      type="text"
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      placeholder="e.g. Bridal & Wedding, Festive & Puja"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Set Contents</label>
                    <input
                      type="text"
                      value={formData.setContents}
                      onChange={(e) => setFormData({ ...formData, setContents: e.target.value })}
                      placeholder="e.g. Saree with Unstitched Blouse Piece"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Saree Length (if saree)</label>
                    <input
                      type="text"
                      value={formData.sareeLength}
                      onChange={(e) => setFormData({ ...formData, sareeLength: e.target.value })}
                      placeholder="e.g. 5.5 M Saree + 0.8 M Blouse"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Lehenga Flare (if lehenga)</label>
                    <input
                      type="text"
                      value={formData.lehengaFlare}
                      onChange={(e) => setFormData({ ...formData, lehengaFlare: e.target.value })}
                      placeholder="e.g. 3.8 Meters Circular Flare"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Wash &amp; Care</label>
                    <input
                      type="text"
                      value={formData.washCare}
                      onChange={(e) => setFormData({ ...formData, washCare: e.target.value })}
                      placeholder="e.g. Dry Clean Only"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Dispatch Time</label>
                    <input
                      type="text"
                      value={formData.dispatchTime}
                      onChange={(e) => setFormData({ ...formData, dispatchTime: e.target.value })}
                      placeholder="e.g. Dispatched in 24-48 Hours"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-slate-500" /> Real Product Video URL (YouTube / MP4)
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Stitching & Tailoring Customization Options */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900 text-xs">Stitching &amp; Customization Options</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplySuratStitchPresets}
                    className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition cursor-pointer"
                  >
                    Load Surat Presets
                  </button>
                </div>

                {/* Existing Stitching Options List */}
                {formData.stitchOptions && formData.stitchOptions.length > 0 && (
                  <div className="space-y-2">
                    {formData.stitchOptions.map((opt, i) => (
                      <div
                        key={i}
                        className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">{opt.type}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              {opt.price === 0 ? 'Free' : `+₹${opt.price}`}
                            </span>
                          </div>
                          {opt.description && (
                            <p className="text-[11px] text-slate-500 mt-0.5">{opt.description}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveStitchOption(i)}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Remove option"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Custom Stitch Option */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Add Custom Stitching Option</span>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <input
                      type="text"
                      value={stitchType}
                      onChange={(e) => setStitchType(e.target.value)}
                      placeholder="Option (e.g. Heavy Latkan Blouse)"
                      className="sm:col-span-5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                    />
                    <input
                      type="number"
                      value={stitchPrice}
                      onChange={(e) => setStitchPrice(Number(e.target.value))}
                      placeholder="Price ₹ (e.g. 499)"
                      className="sm:col-span-3 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={handleAddStitchOption}
                      className="sm:col-span-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition cursor-pointer"
                    >
                      + Add Option
                    </button>
                  </div>
                  <input
                    type="text"
                    value={stitchDesc}
                    onChange={(e) => setStitchDesc(e.target.value)}
                    placeholder="Brief description (e.g. Tailored as per standard size with padded cups)"
                    className="w-full mt-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fabric details, fit description, and styling suggestions..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditing ? 'Save Changes' : 'Publish Product'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
