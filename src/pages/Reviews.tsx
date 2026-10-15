import React, { useEffect, useState } from 'react';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import type { Review } from '../types';
import {
  Star,
  Search,
  Trash2,
  CheckCircle,
  Package,
  Loader2
} from 'lucide-react';

export const Reviews: React.FC = () => {
  const { showToast } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getAllReviews();
      if (res && res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Delete this customer review?')) return;
    try {
      await reviewService.deleteReview(id);
      showToast('Review removed successfully', 'success');
      setReviews((prev) => prev.filter((r) => (r.id || r._id) !== id));
    } catch (err) {
      showToast('Failed to delete review', 'error');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    return (
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.productName && r.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide">
            Product Ratings & Reviews Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Audit customer product feedback, ratings, and remove spam or offensive reviews</p>
        </div>

        <div className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 self-start sm:self-auto shadow-xs">
          Total Reviews: <span className="text-emerald-700 font-bold">{reviews.length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reviews by customer, product, or keywords..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span>Loading reviews...</span>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Star className="w-8 h-8 text-slate-300" />
            <span>No customer reviews found.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">Product</th>
                  <th className="py-3 px-4 font-bold">Rating</th>
                  <th className="py-3 px-4 font-bold">Review Comment</th>
                  <th className="py-3 px-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReviews.map((r) => {
                  const reviewId = r.id || r._id || '';
                  return (
                    <tr key={reviewId} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{r.userName}</div>
                        {r.isVerifiedPurchase && (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Buyer
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {r.productName || 'Fashion Style'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= r.rating ? 'text-amber-500 fill-amber-400' : 'text-slate-300'
                              }`}
                            />
                          ))}
                          <span className="text-slate-600 text-[11px] ml-1 font-mono font-bold">({r.rating}/5)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-sm font-medium">
                        <p className="line-clamp-2">{r.comment}</p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteReview(reviewId)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                          title="Delete Review"
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
