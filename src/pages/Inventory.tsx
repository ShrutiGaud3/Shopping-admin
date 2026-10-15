import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import type { InventoryItem } from '../types';
import {
  Layers,
  Search,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  Save,
  Loader2,
  RefreshCw
} from 'lucide-react';

export const Inventory: React.FC = () => {
  const { showToast } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingStocks, setEditingStocks] = useState<Record<string, number>>({});

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await adminService.getInventory();
      if (res && res.success) {
        setItems(res.data);
        const map: Record<string, number> = {};
        res.data.forEach((item) => {
          map[item.id || item._id || ''] = item.stock;
        });
        setEditingStocks(map);
      }
    } catch (err) {
      showToast('Failed to load inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleStockChange = (id: string, value: number) => {
    setEditingStocks((prev) => ({
      ...prev,
      [id]: Math.max(0, value)
    }));
  };

  const handleQuickAdd = (id: string, amount: number) => {
    setEditingStocks((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + amount)
    }));
  };

  const handleSaveStock = async (id: string, name: string) => {
    const newStock = editingStocks[id];
    if (newStock === undefined) return;

    try {
      setUpdatingId(id);
      await adminService.updateInventoryStock(id, newStock, name);
      showToast(`Updated stock for "${name}" to ${newStock} units`, 'success');
      setItems((prev) =>
        prev.map((item) => {
          if ((item.id || item._id) === id) {
            let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
            if (newStock === 0) status = 'Out of Stock';
            else if (newStock <= 10) status = 'Low Stock';
            return { ...item, stock: newStock, status };
          }
          return item;
        })
      );
    } catch (err) {
      showToast('Failed to save stock update', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterMode === 'low') return matchesSearch && item.stock > 0 && item.stock <= 10;
    if (filterMode === 'out') return matchesSearch && item.stock === 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide">
            Real-Time Warehouse Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Live stock tracker, replenish low stock items, and audit inventory counts</p>
        </div>

        <button
          onClick={loadInventory}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Stock</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterMode === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Inventory ({items.length})
          </button>
          <button
            onClick={() => setFilterMode('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'low'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock (≤10)</span>
          </button>
          <button
            onClick={() => setFilterMode('out')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterMode === 'out'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            Out of Stock (0)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inventory by title, SKU, brand..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
          />
        </div>

      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span>Fetching live stock counts...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Layers className="w-8 h-8 text-slate-300" />
            <span>No products matching inventory criteria.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Item Details</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Unit Price</th>
                  <th className="py-3 px-4 font-bold">Current Stock</th>
                  <th className="py-3 px-4 font-bold">Quick Adjustments</th>
                  <th className="py-3 px-4 text-right font-bold">Commit Changes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const itemId = item.id || item._id || '';
                  const currentStockVal = editingStocks[itemId] !== undefined ? editingStocks[itemId] : item.stock;
                  const isModified = currentStockVal !== item.stock;

                  return (
                    <tr key={itemId} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80'}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{item.brand} • <span className="font-mono text-emerald-700">{item.sku || 'SKU-001'}</span></p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ₹{item.price?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={currentStockVal}
                            onChange={(e) => handleStockChange(itemId, parseInt(e.target.value) || 0)}
                            className="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:bg-white focus:border-emerald-500"
                          />
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            currentStockVal === 0
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : currentStockVal <= 10
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {currentStockVal === 0 ? 'Out of Stock' : currentStockVal <= 10 ? 'Low Stock' : 'Optimal'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(itemId, -5)}
                            className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 cursor-pointer"
                            title="Decrease 5"
                          >
                            -5
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(itemId, 5)}
                            className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-[10px] font-bold text-emerald-800 border border-emerald-200 cursor-pointer"
                            title="Add 5"
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(itemId, 20)}
                            className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-[10px] font-bold text-emerald-800 border border-emerald-200 cursor-pointer"
                            title="Restock 20"
                          >
                            +20
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          disabled={!isModified || updatingId === itemId}
                          onClick={() => handleSaveStock(itemId, item.name)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            isModified
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                          }`}
                        >
                          {updatingId === itemId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5" />
                          )}
                          <span>Save</span>
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

    </div>
  );
};
