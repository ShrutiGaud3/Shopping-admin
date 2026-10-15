import React, { useEffect, useState } from 'react';
import { pageService } from '../services/pageService';
import { faqService } from '../services/faqService';
import { useAuth } from '../context/AuthContext';
import type { PageItem, FaqItem } from '../types';
import {
  FileText,
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  ExternalLink,
  ChevronDown,
  Save,
  Globe
} from 'lucide-react';

export const PagesManager: React.FC = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'pages' | 'faqs'>('pages');
  const [loading, setLoading] = useState(true);

  // Pages state
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [pageMetaTitle, setPageMetaTitle] = useState('');
  const [pageMetaDescription, setPageMetaDescription] = useState('');
  const [pageIsActive, setPageIsActive] = useState(true);

  // FAQs state
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState<'General' | 'Shipping & Delivery' | 'Returns & Exchange' | 'Orders & Payment' | 'Sizing & Customization'>('General');
  const [faqOrder, setFaqOrder] = useState(1);
  const [faqIsActive, setFaqIsActive] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pagesRes, faqsRes] = await Promise.all([
        pageService.getAllPages(),
        faqService.getAllFaqs()
      ]);
      if (pagesRes && pagesRes.success) setPages(pagesRes.data);
      if (faqsRes && faqsRes.success) setFaqs(faqsRes.data);
    } catch (err) {
      showToast('Failed to load pages and FAQs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Page Handlers ---
  const handleOpenAddPage = () => {
    setEditingPageId(null);
    setPageTitle('');
    setPageSlug('');
    setPageContent('');
    setPageMetaTitle('');
    setPageMetaDescription('');
    setPageIsActive(true);
    setIsPageModalOpen(true);
  };

  const handleOpenEditPage = (p: PageItem) => {
    setEditingPageId(p.id || p._id || '');
    setPageTitle(p.title);
    setPageSlug(p.slug);
    setPageContent(p.content);
    setPageMetaTitle(p.metaTitle || '');
    setPageMetaDescription(p.metaDescription || '');
    setPageIsActive(p.isActive !== undefined ? p.isActive : true);
    setIsPageModalOpen(true);
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageTitle.trim() || !pageContent.trim()) {
      showToast('Title and content are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<PageItem> = {
        title: pageTitle.trim(),
        slug: pageSlug.trim().toLowerCase(),
        content: pageContent,
        metaTitle: pageMetaTitle.trim(),
        metaDescription: pageMetaDescription.trim(),
        isActive: pageIsActive
      };

      if (editingPageId) {
        await pageService.updatePage(editingPageId, payload);
        showToast('Page content saved successfully!', 'success');
      } else {
        await pageService.createPage(payload);
        showToast('New CMS page published!', 'success');
      }
      setIsPageModalOpen(false);
      const res = await pageService.getAllPages();
      if (res && res.success) setPages(res.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to save page', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePage = async (id: string, title: string) => {
    if (!window.confirm(`Delete page "${title}"?`)) return;
    try {
      await pageService.deletePage(id);
      showToast(`Page "${title}" deleted`, 'success');
      setPages((prev) => prev.filter((p) => (p.id || p._id) !== id));
    } catch (err) {
      showToast('Failed to delete page', 'error');
    }
  };

  // --- FAQ Handlers ---
  const handleOpenAddFaq = () => {
    setEditingFaqId(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('General');
    setFaqOrder((faqs.length || 0) + 1);
    setFaqIsActive(true);
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (f: FaqItem) => {
    setEditingFaqId(f.id || f._id || '');
    setFaqQuestion(f.question);
    setFaqAnswer(f.answer);
    setFaqCategory(f.category || 'General');
    setFaqOrder(f.order || 1);
    setFaqIsActive(f.isActive !== undefined ? f.isActive : true);
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      showToast('Question and answer are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<FaqItem> = {
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        category: faqCategory,
        order: Number(faqOrder),
        isActive: faqIsActive
      };

      if (editingFaqId) {
        await faqService.updateFaq(editingFaqId, payload);
        showToast('FAQ updated successfully!', 'success');
      } else {
        await faqService.createFaq(payload);
        showToast('New FAQ created successfully!', 'success');
      }
      setIsFaqModalOpen(false);
      const res = await faqService.getAllFaqs();
      if (res && res.success) setFaqs(res.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to save FAQ', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!window.confirm('Delete this FAQ question?')) return;
    try {
      await faqService.deleteFaq(id);
      showToast('FAQ deleted', 'success');
      setFaqs((prev) => prev.filter((f) => (f.id || f._id) !== id));
    } catch (err) {
      showToast('Failed to delete FAQ', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-wide">
            CMS Static Pages & Customer FAQs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Edit store policies, About Us, Shipping, 10-day exchange terms, and customer FAQs</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeTab === 'pages' ? (
            <button
              onClick={handleOpenAddPage}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Page</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddFaq}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ Question</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition cursor-pointer ${
            activeTab === 'pages'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Policy & CMS Pages ({pages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition cursor-pointer ${
            activeTab === 'faqs'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Customer FAQs ({faqs.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span>Loading content...</span>
        </div>
      ) : activeTab === 'pages' ? (
        /* Pages Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((p) => {
            const pId = p.id || p._id || '';
            return (
              <div
                key={pId}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                      /pages/{p.slug}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                      {p.isActive ? 'Live' : 'Draft'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{p.title}</h3>
                  <div
                    className="text-xs text-slate-500 line-clamp-3 mb-4 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: p.content.slice(0, 180) }}
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`http://localhost:5173/pages/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <span>View Live</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditPage(p)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      title="Edit Content"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePage(pId, p.title)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                      title="Delete Page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* FAQs Accordion Table */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Order</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Question & Answer</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faqs.map((f) => {
                  const fId = f.id || f._id || '';
                  return (
                    <tr key={fId} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-600">
                        #{f.order}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {f.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-md">
                        <p className="font-bold text-slate-900 mb-0.5">{f.question}</p>
                        <p className="text-slate-500 line-clamp-2">{f.answer}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${f.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                          {f.isActive ? 'Live' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditFaq(f)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFaq(fId)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
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
        </div>
      )}

      {/* Edit Page Modal */}
      {isPageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsPageModalOpen(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 z-10 text-xs text-slate-900 overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>{editingPageId ? 'Edit CMS Page' : 'Create New CMS Page'}</span>
              </h2>
              <button onClick={() => setIsPageModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Page Title *</label>
                  <input
                    type="text"
                    required
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="e.g. 10-Days Easy Exchange Policy"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value)}
                    placeholder="refund-policy"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-[11px] focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">HTML / Rich Content *</label>
                <textarea
                  rows={10}
                  required
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  placeholder="Enter HTML content or text with <h2>, <p>, <ul> tags..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 font-mono text-xs focus:outline-none focus:bg-white focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">SEO Meta Title</label>
                  <input
                    type="text"
                    value={pageMetaTitle}
                    onChange={(e) => setPageMetaTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">SEO Meta Description</label>
                  <input
                    type="text"
                    value={pageMetaDescription}
                    onChange={(e) => setPageMetaDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pageIsActiveToggle"
                  checked={pageIsActive}
                  onChange={(e) => setPageIsActive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="pageIsActiveToggle" className="text-slate-800 font-bold cursor-pointer">
                  Publish to live storefront
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPageModalOpen(false)}
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
                  <span>Save Page Content</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Edit FAQ Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsFaqModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 z-10 text-xs text-slate-900">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <span>{editingFaqId ? 'Edit FAQ' : 'Add New FAQ'}</span>
              </h2>
              <button onClick={() => setIsFaqModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="e.g. What is your 10-day exchange process?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="Clear answer explaining procedure to customers..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={faqCategory}
                    onChange={(e) => setFaqCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
                  >
                    <option value="General">General</option>
                    <option value="Shipping & Delivery">Shipping & Delivery</option>
                    <option value="Returns & Exchange">Returns & Exchange</option>
                    <option value="Orders & Payment">Orders & Payment</option>
                    <option value="Sizing & Customization">Sizing & Customization</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Order Index</label>
                  <input
                    type="number"
                    min="1"
                    value={faqOrder}
                    onChange={(e) => setFaqOrder(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="faqIsActiveToggle"
                  checked={faqIsActive}
                  onChange={(e) => setFaqIsActive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="faqIsActiveToggle" className="text-slate-800 font-bold cursor-pointer">
                  Display in storefront FAQ section
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
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
                  <span>Save FAQ</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
