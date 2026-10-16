import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import type { SubscriberItem } from '../types';
import API from '../services/api';
import {
  Mail,
  Search,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  Loader2,
  Users,
  Sparkles
} from 'lucide-react';

export const Subscribers: React.FC = () => {
  const { showToast } = useAuth();
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [counts, setCounts] = useState({ active: 0, unsubscribed: 0, all: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [exporting, setExporting] = useState(false);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSubscribers({
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter
      });
      if (res && res.success) {
        setSubscribers(res.data);
        if (res.counts) setCounts(res.counts);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch subscribers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubscribers();
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const response = await API.get('/admin/subscribers/export', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `velora_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Subscribers CSV exported successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to export CSV', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to remove ${email} from subscribers?`)) return;
    try {
      const res = await adminService.deleteSubscriber(id);
      if (res && res.success) {
        showToast('Subscriber removed', 'success');
        fetchSubscribers();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to remove subscriber', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-rose-600" />
            Newsletter Subscribers &amp; Leads
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage email subscribers captured from storefront footer signup and export for email campaigns.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={exporting || counts.all === 0}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>Export CSV</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Active Subscribers</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">{counts.active}</div>
          <span className="text-xs text-emerald-600 mt-1 block">Receiving weekly drops</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Unsubscribed</span>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">{counts.unsubscribed}</div>
          <span className="text-xs text-gray-400 mt-1 block">Opted out</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Leads</span>
            <Users className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">{counts.all}</div>
          <span className="text-xs text-gray-500 mt-1 block">All-time email registrations</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'active', 'unsubscribed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'all' ? 'All Leads' : tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-rose-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading subscribers...</p>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No subscribers found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              When customers sign up on your storefront newsletter footer, their email addresses will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Email Address</th>
                  <th className="py-3.5 px-4 font-bold">Source</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Subscribed Date</th>
                  <th className="py-3.5 px-5 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscribers.map((s) => {
                  const subId = s._id || s.id || '';
                  return (
                    <tr key={subId} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-5 font-medium text-slate-900 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.email}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{s.source || 'Footer Signup'}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          s.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {s.createdAt
                          ? new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Recent'}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleDeleteSubscriber(subId, s.email)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Remove subscriber"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
