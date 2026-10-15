import React, { useEffect, useState } from 'react';
import { settingService } from '../services/settingService';
import { useAuth } from '../context/AuthContext';
import type { Setting, SettingAnnouncement } from '../types';
import {
  Settings as SettingsIcon,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Truck,
  IndianRupee,
  Share2,
  Globe,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle,
  Megaphone
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { showToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'announcements' | 'shipping' | 'branding'>('contact');

  // Setting Form State
  const [settings, setSettings] = useState<Setting>({
    announcements: [],
    whatsappNumber: '919876543210',
    whatsappPrefilledMessage: 'Hello VELORA Support! 👋 I am browsing your online store and need assistance.',
    supportPhone: '+91 98765 43210',
    supportEmail: 'support@velora.com',
    supportAddress: 'Ring Road Surat Fashion Hub, Surat, Gujarat - 395002, India',
    workingHours: 'Mon - Sat: 10:00 AM - 7:00 PM IST',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      pinterest: 'https://pinterest.com',
      youtube: 'https://youtube.com'
    },
    codEnabled: true,
    codExtraCharge: 50,
    freeShippingThreshold: 999,
    standardShippingFee: 99,
    footerAboutText: 'VELORA is India’s premier destination for luxury women’s ethnic couture, handcrafted sarees, designer lehengas, and contemporary festive wear.',
    copyrightText: '© 2026 VELORA Fashion Hub. All Rights Reserved.',
    seoDefaults: {
      metaTitle: 'VELORA | Luxury Women\'s Ethnic Wear & Festive Couture',
      metaDescription: 'Shop authentic handcrafted sarees, designer bridal lehengas, festive anarkalis, and kurtis online with worldwide shipping and COD.',
      ogImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80'
    }
  });

  // State for adding a new announcement
  const [newAnnouncementText, setNewAnnouncementText] = useState('');
  const [newAnnouncementLink, setNewAnnouncementLink] = useState('/products');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await settingService.getSettings();
        if (res && res.success && res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        showToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await settingService.updateSettings(settings);
      if (res && res.success) {
        showToast('Store settings saved successfully!', 'success');
        setSettings(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncementText.trim()) return;
    setSettings((prev) => ({
      ...prev,
      announcements: [
        ...prev.announcements,
        { text: newAnnouncementText.trim(), link: newAnnouncementLink, isActive: true }
      ]
    }));
    setNewAnnouncementText('');
    setNewAnnouncementLink('/products');
  };

  const handleRemoveAnnouncement = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((_, i) => i !== index)
    }));
  };

  const handleToggleAnnouncement = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      announcements: prev.announcements.map((a, i) => (i === index ? { ...a, isActive: !a.isActive } : a))
    }));
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <span>Loading store settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide">
            Global Site Settings & Policies
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Control live announcement bars, WhatsApp number, COD rules, and footer details</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save All Settings</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'contact'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact & WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'announcements'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Announcement Bars ({settings.announcements?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'shipping'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>COD & Shipping Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'branding'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Footer, Social & SEO</span>
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-xs">
        
        {/* Tab 1: Contact & WhatsApp */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Customer Support & Direct WhatsApp Channels</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">WhatsApp Mobile Number (Country code + digits)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    placeholder="919876543210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Used for floating WhatsApp button and Product page "Order on WhatsApp" button.</p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Support Helpline Phone</label>
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Support Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    placeholder="support@velora.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Working & Support Hours</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={settings.workingHours}
                    onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                    placeholder="Mon - Sat: 10:00 AM - 7:00 PM IST"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Store / Warehouse Address</label>
              <textarea
                rows={2}
                value={settings.supportAddress}
                onChange={(e) => setSettings({ ...settings, supportAddress: e.target.value })}
                placeholder="Full address of your Surat warehouse / store..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">WhatsApp Default Inbound Message</label>
              <input
                type="text"
                value={settings.whatsappPrefilledMessage}
                onChange={(e) => setSettings({ ...settings, whatsappPrefilledMessage: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Announcement Bars */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-600" />
              <span>Top Announcement Bar Ticker Messages</span>
            </h3>

            {/* Existing Announcements List */}
            <div className="space-y-2">
              {(settings.announcements || []).map((ann, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={ann.isActive}
                    onChange={() => handleToggleAnnouncement(idx)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                    title="Active Toggle"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold ${ann.isActive ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                      {ann.text}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">Link: {ann.link || '/products'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAnnouncement(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Announcement Item */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-dashed border-slate-300 space-y-2">
              <p className="font-bold text-slate-800 text-xs">Add New Announcement Banner</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="e.g. Free Shipping on all orders above ₹999!"
                  value={newAnnouncementText}
                  onChange={(e) => setNewAnnouncementText(e.target.value)}
                  className="sm:col-span-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="/products"
                    value={newAnnouncementLink}
                    onChange={(e) => setNewAnnouncementLink(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddAnnouncement}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: COD & Shipping Rules */}
        {activeTab === 'shipping' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Checkout Shipping & Cash on Delivery (COD) Rules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* COD Enabled Toggle */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Enable Cash on Delivery (COD)</p>
                  <p className="text-[11px] text-slate-500">Allow customers to choose COD at checkout</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.codEnabled}
                  onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* COD Extra Fee */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-slate-700 font-bold mb-1">COD Handling Fee (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={settings.codExtraCharge}
                  onChange={(e) => setSettings({ ...settings, codExtraCharge: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-1">Extra fee charged when customer selects COD payment</p>
              </div>

              {/* Free Shipping Threshold */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-slate-700 font-bold mb-1">Free Shipping Order Threshold (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-1">Orders above this amount get automatic 100% free delivery</p>
              </div>

              {/* Standard Shipping Fee */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-slate-700 font-bold mb-1">Standard Domestic Shipping Fee (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={settings.standardShippingFee}
                  onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-1">Applied when cart total is below the free shipping threshold</p>
              </div>

            </div>
          </div>
        )}

        {/* Tab 4: Branding, Social & SEO */}
        {activeTab === 'branding' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>Branding, Social Media Channels & SEO Defaults</span>
            </h3>

            {/* Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={settings.socialLinks?.instagram || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={settings.socialLinks?.facebook || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pinterest URL</label>
                <input
                  type="url"
                  value={settings.socialLinks?.pinterest || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, pinterest: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">YouTube Channel URL</label>
                <input
                  type="url"
                  value={settings.socialLinks?.youtube || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            {/* Footer Texts */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Footer About Brand Text</label>
              <textarea
                rows={2}
                value={settings.footerAboutText}
                onChange={(e) => setSettings({ ...settings, footerAboutText: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Copyright Notice Text</label>
              <input
                type="text"
                value={settings.copyrightText}
                onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900"
              />
            </div>

            {/* SEO Defaults */}
            <div className="pt-2 border-t border-slate-100">
              <p className="font-bold text-slate-800 mb-2">Default Website SEO Meta</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Homepage Meta Title</label>
                  <input
                    type="text"
                    value={settings.seoDefaults?.metaTitle || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      seoDefaults: { ...settings.seoDefaults, metaTitle: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Homepage Meta Description</label>
                  <textarea
                    rows={2}
                    value={settings.seoDefaults?.metaDescription || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      seoDefaults: { ...settings.seoDefaults, metaDescription: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Commit & Apply Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
