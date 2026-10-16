import React, { useEffect, useState } from 'react';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import type { ReviewItem } from '../types';
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Filter,
  MessageSquare,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye,
  X,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

export const Reviews: React.FC = () => {
  const { showToast } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Stats Breakdown
  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getReviews({
        status: activeTab,
        search: searchTerm
      });

      if (res && res.success) {
        setReviews(res.data);
        if (res.counts) {
          setCounts(res.counts);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReviews();
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setActionLoading(id);
      const res = await reviewService.updateStatus(id, status);
      if (res && res.success) {
        showToast(`Review ${status === 'approved' ? 'approved & published' : 'rejected'} successfully`, 'success');
        fetchReviews();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update review status', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer review?')) {
      return;
    }
    try {
      setActionLoading(id);
      const res = await reviewService.deleteReview(id);
      if (res && res.success) {
        showToast('Review permanently deleted', 'success');
        fetchReviews();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete review', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            Reviews Moderation Queue
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Moderate genuine customer feedback, verify purchases, and publish photo reviews.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchReviews()}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('pending')}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'pending'
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/30'
              : 'bg-white border-gray-100 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending Review</span>
            <span className="relative flex h-2.5 w-2.5">
              {counts.pending > 0 && (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </>
              )}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{counts.pending}</div>
          <span className="text-xs text-amber-600 mt-1 inline-block">Requires moderator action</span>
        </div>

        <div
          onClick={() => setActiveTab('approved')}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'approved'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/30'
              : 'bg-white border-gray-100 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Approved</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{counts.approved}</div>
          <span className="text-xs text-emerald-600 mt-1 inline-block">Live on product pages</span>
        </div>

        <div
          onClick={() => setActiveTab('rejected')}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'rejected'
              ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/30'
              : 'bg-white border-gray-100 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{counts.rejected}</div>
          <span className="text-xs text-rose-600 mt-1 inline-block">Hidden from public store</span>
        </div>

        <div
          onClick={() => setActiveTab('all')}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'all'
              ? 'bg-slate-50 border-slate-300 ring-2 ring-slate-400/30'
              : 'bg-white border-gray-100 hover:border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Submissions</span>
            <MessageSquare className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{counts.all}</div>
          <span className="text-xs text-gray-500 mt-1 inline-block">All-time customer feedback</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'all' ? 'All Reviews' : tab}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name, product, text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-100">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900">No reviews found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'pending'
              ? 'No pending reviews currently require moderation. Great job keeping the queue clear!'
              : `There are currently no reviews matching the "${activeTab}" filter.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const prod = typeof rev.product === 'object' ? rev.product : null;
            const reviewId = rev._id || rev.id || '';

            return (
              <div
                key={reviewId}
                className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-xs p-5 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Reviewer and Product Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Product Thumbnail */}
                    {prod?.images?.[0] ? (
                      <img
                        src={prod.images[0]}
                        alt={prod.name || rev.productName}
                        className="w-16 h-20 object-cover rounded-lg border border-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{rev.userName}</span>
                        {rev.isVerifiedBuyer && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" /> Verified Buyer
                          </span>
                        )}
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          rev.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rev.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rev.status}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 flex flex-wrap items-center gap-3">
                        <span>Product: <strong className="text-gray-700">{prod?.name || rev.productName}</strong></span>
                        {rev.userLocation && <span>Location: {rev.userLocation}</span>}
                        <span>Date: {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 pt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                        <span className="ml-1.5 font-bold text-gray-900 text-xs">{rev.rating} / 5</span>
                      </div>

                      {/* Review Title & Comment */}
                      <div className="pt-2">
                        {rev.title && (
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">{rev.title}</h4>
                        )}
                        <p className="text-xs text-gray-700 leading-relaxed bg-gray-50/70 p-3 rounded-lg border border-gray-100 whitespace-pre-line">
                          "{rev.comment}"
                        </p>
                      </div>

                      {/* Customer Photos */}
                      {rev.images && rev.images.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                            Customer Attached Photos ({rev.images.length})
                          </span>
                          <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {rev.images.map((imgUrl, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedPhoto(imgUrl)}
                                className="group relative rounded-lg overflow-hidden border border-gray-200 hover:border-indigo-500 shrink-0 cursor-pointer"
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Review attachment ${idx + 1}`}
                                  className="w-14 h-14 object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Eye className="w-4 h-4 text-white" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex lg:flex-col items-center gap-2 pt-2 lg:pt-0 shrink-0 border-t lg:border-t-0 border-gray-100">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(reviewId, 'approved')}
                        disabled={actionLoading === reviewId}
                        className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}

                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(reviewId, 'rejected')}
                        disabled={actionLoading === reviewId}
                        className="w-full sm:w-auto px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteReview(reviewId)}
                      disabled={actionLoading === reviewId}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Permanently Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-2xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhoto}
              alt="Review attachment preview"
              className="max-h-[85vh] w-auto object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};
