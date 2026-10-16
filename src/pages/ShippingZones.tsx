import React, { useEffect, useState } from 'react';
import { shippingZoneService } from '../services/shippingZoneService';
import { useAuth } from '../context/AuthContext';
import type { ShippingZone } from '../types';
import {
  Globe,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  Search,
  CheckCircle,
  Truck,
  IndianRupee,
  Clock
} from 'lucide-react';

export const ShippingZones: React.FC = () => {
  const { showToast } = useAuth();
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);

  // Form State
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('IN');
  const [charge, setCharge] = useState<number>(99);
  const [freeAbove, setFreeAbove] = useState<number>(999);
  const [estimatedDays, setEstimatedDays] = useState('3-5 Business Days');
  const [isActive, setIsActive] = useState(true);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const res = await shippingZoneService.getShippingZones();
      if (res && res.success) {
        setZones(res.data);
      }
    } catch (err) {
      showToast('Failed to load shipping zones', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleOpenAddModal = () => {
    setEditingZone(null);
    setCountry('');
    setCountryCode('IN');
    setCharge(99);
    setFreeAbove(999);
    setEstimatedDays('3-5 Business Days');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (zone: ShippingZone) => {
    setEditingZone(zone);
    setCountry(zone.country);
    setCountryCode(zone.countryCode || 'IN');
    setCharge(zone.charge);
    setFreeAbove(zone.freeAbove || 0);
    setEstimatedDays(zone.estimatedDays || '3-5 Business Days');
    setIsActive(zone.isActive !== undefined ? zone.isActive : true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!country.trim()) {
      showToast('Country name is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        country: country.trim(),
        countryCode: countryCode.trim().toUpperCase(),
        charge: Number(charge),
        freeAbove: Number(freeAbove),
        estimatedDays: estimatedDays.trim(),
        isActive
      };

      if (editingZone) {
        const id = editingZone._id || editingZone.id;
        await shippingZoneService.updateShippingZone(id!, payload);
        showToast(`Shipping zone for "${country}" updated`, 'success');
      } else {
        await shippingZoneService.createShippingZone(payload);
        showToast(`Shipping zone for "${country}" created`, 'success');
      }

      setIsModalOpen(false);
      fetchZones();
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (zone: ShippingZone) => {
    const id = zone._id || zone.id;
    if (!id) return;
    if (!window.confirm(`Delete shipping rate for "${zone.country}"?`)) return;

    try {
      await shippingZoneService.deleteShippingZone(id);
      showToast(`Shipping zone "${zone.country}" deleted`, 'success');
      setZones((prev) => prev.filter((z) => (z._id || z.id) !== id));
    } catch (err) {
      showToast('Failed to delete shipping zone', 'error');
    }
  };

  const filteredZones = zones.filter((z) =>
    z.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (z.countryCode && z.countryCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide flex items-center gap-2">
            <Globe className="w-6 h-6 text-emerald-600" /> Country &amp; Shipping Zones
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure international and domestic shipping fees, free delivery limits, and delivery transit speeds</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shipping Zone</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search countries by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 self-start sm:self-auto">
          Active Zones: <strong className="text-emerald-700">{zones.filter((z) => z.isActive).length}</strong> / {zones.length}
        </div>
      </div>

      {/* Shipping Zones Grid / Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading shipping destinations...</p>
        </div>
      ) : filteredZones.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Shipping Zones Found</h3>
          <p className="text-xs text-slate-500 mb-4">Add your first domestic or global shipping country rate.</p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
          >
            Create Zone
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredZones.map((zone) => {
            const id = zone._id || zone.id;
            return (
              <div
                key={id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200 font-mono">
                        {zone.countryCode || 'IN'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{zone.country}</h3>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" /> {zone.estimatedDays || '3-5 Business Days'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        zone.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {zone.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-500 block">Shipping Rate</span>
                      <strong className="text-slate-900 text-sm font-semibold">
                        {zone.charge === 0 ? <span className="text-emerald-700">FREE</span> : `₹${zone.charge}`}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-500 block">Free Delivery</span>
                      <strong className="text-slate-900 text-sm font-semibold">
                        {zone.freeAbove > 0 ? `Above ₹${zone.freeAbove}` : 'No Free Threshold'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => handleOpenEditModal(zone)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(zone)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-5 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                {editingZone ? 'Edit Shipping Zone' : 'Create Shipping Zone'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Country Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Germany"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Country Code (2 Letters) *</label>
                <input
                  type="text"
                  required
                  maxLength={3}
                  placeholder="e.g. DE"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono font-bold uppercase focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Charge (₹) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={charge}
                    onChange={(e) => setCharge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Free Delivery Above (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={freeAbove}
                    onChange={(e) => setFreeAbove(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">0 = No free delivery threshold</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Delivery Speed</label>
                <input
                  type="text"
                  placeholder="e.g. 5-7 Business Days"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="zoneActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="zoneActive" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Enable this zone for storefront checkout
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : editingZone ? 'Update Zone' : 'Create Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
