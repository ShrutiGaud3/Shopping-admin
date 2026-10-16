import React, { useEffect, useState } from 'react';
import { blogService } from '../services/blogService';
import { useAuth } from '../context/AuthContext';
import type { BlogPostItem } from '../types';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  Search,
  Eye,
  CheckCircle,
  Clock,
  Tag,
  Globe,
  FileText,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const Blogs: React.FC = () => {
  const { showToast } = useAuth();
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPostItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Ethnic Fashion & Heritage');
  const [tagsInput, setTagsInput] = useState('');
  const [authorName, setAuthorName] = useState('SuratiKart Style Team');
  const [authorRole, setAuthorRole] = useState('Senior Fashion & Handloom Curator');
  const [readTime, setReadTime] = useState('5 min read');
  const [isPublished, setIsPublished] = useState(true);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await blogService.getBlogs({
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter
      });
      if (res && res.success) {
        setBlogs(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch blogs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs();
  };

  const handleOpenAddModal = () => {
    setEditingBlog(null);
    setTitle('');
    setSlug('');
    setCoverImage('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80');
    setExcerpt('');
    setContent('');
    setCategory('Ethnic Fashion & Heritage');
    setTagsInput('Surat Silk, Saree Guide, Festive Wear');
    setAuthorName('SuratiKart Style Team');
    setAuthorRole('Senior Fashion & Handloom Curator');
    setReadTime('5 min read');
    setIsPublished(true);
    setMetaTitle('');
    setMetaDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (blog: BlogPostItem) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setSlug(blog.slug);
    setCoverImage(blog.coverImage);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setCategory(blog.category || 'Ethnic Fashion & Heritage');
    setTagsInput(Array.isArray(blog.tags) ? blog.tags.join(', ') : '');
    setAuthorName(blog.author?.name || 'SuratiKart Style Team');
    setAuthorRole(blog.author?.role || 'Senior Fashion & Handloom Curator');
    setReadTime(blog.readTime || '5 min read');
    setIsPublished(blog.isPublished);
    setMetaTitle(blog.seo?.metaTitle || '');
    setMetaDescription(blog.seo?.metaDescription || '');
    setIsModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!editingBlog) {
      // Auto-generate clean slug
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !coverImage.trim() || !excerpt.trim() || !content.trim()) {
      showToast('Please fill all required fields (title, cover, excerpt, content)', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

      const payload: Partial<BlogPostItem> = {
        title: title.trim(),
        slug: slug.trim(),
        coverImage: coverImage.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category: category.trim(),
        tags: tagsArray,
        author: {
          name: authorName.trim(),
          role: authorRole.trim()
        },
        readTime: readTime.trim(),
        isPublished,
        seo: {
          metaTitle: metaTitle.trim() || title.trim(),
          metaDescription: metaDescription.trim() || excerpt.trim()
        }
      };

      if (editingBlog && (editingBlog._id || editingBlog.id)) {
        const id = (editingBlog._id || editingBlog.id)!;
        await blogService.updateBlog(id, payload);
        showToast('Blog article updated successfully', 'success');
      } else {
        await blogService.createBlog(payload);
        showToast('New blog article published successfully', 'success');
      }

      setIsModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      showToast(err.message || 'Failed to save blog post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (blog: BlogPostItem) => {
    const id = blog._id || blog.id;
    if (!id) return;
    try {
      await blogService.updateBlog(id, { isPublished: !blog.isPublished });
      showToast(`Article ${!blog.isPublished ? 'published' : 'moved to drafts'}`, 'success');
      fetchBlogs();
    } catch (err: any) {
      showToast(err.message || 'Failed to update publication status', 'error');
    }
  };

  const handleDelete = async (blog: BlogPostItem) => {
    const id = blog._id || blog.id;
    if (!id) return;
    if (!window.confirm(`Are you sure you want to permanently delete "${blog.title}"?`)) {
      return;
    }
    try {
      await blogService.deleteBlog(id);
      showToast('Blog article deleted', 'success');
      fetchBlogs();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete blog', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-purple-600" />
            Ethnic Fashion Blog & Editorial Stories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Publish styling guides, handloom heritage stories, and festive lookbooks for customers.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Write New Article
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'published', 'draft'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'all' ? 'All Articles' : tab === 'published' ? 'Published' : 'Drafts'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search blogs by title or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading articles...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-100">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900">No blog articles found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Click "Write New Article" above to create your first Surat handloom styling story.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const blogId = blog._id || blog.id || '';
            return (
              <div
                key={blogId}
                className="bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Cover Image */}
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {blog.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleTogglePublish(blog)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider cursor-pointer shadow-xs transition-colors ${
                        blog.isPublished
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-amber-500 text-white hover:bg-amber-600'
                      }`}
                      title="Click to toggle publish status"
                    >
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{blog.readTime}</span>
                      <span>•</span>
                      <Eye className="w-3.5 h-3.5" />
                      <span>{blog.views || 0} views</span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-purple-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {blog.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Author & Actions */}
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-gray-500">
                      By <strong className="text-gray-700">{blog.author?.name || 'Editorial Team'}</strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(blog)}
                        className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(blog)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Blog Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-purple-50/50">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                {editingBlog ? 'Edit Blog Article' : 'Compose New Ethnic Story'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Article Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Royal Guide to Choosing Authentic Surat Silk Sarees"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Slug (URL identifier) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="royal-guide-surat-silk"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                  >
                    <option value="Ethnic Fashion & Heritage">Ethnic Fashion & Heritage</option>
                    <option value="Silk & Handlooms">Silk & Handlooms</option>
                    <option value="Bridal Couture">Bridal Couture</option>
                    <option value="Festive Styling">Festive Styling</option>
                    <option value="Saree Draping & Tips">Saree Draping & Tips</option>
                    <option value="Textile Craftsmanship">Textile Craftsmanship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Cover Image URL <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                  />
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt="Preview"
                      className="w-14 h-9 object-cover rounded border border-gray-200 shrink-0"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Short Excerpt / Summary <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  maxLength={300}
                  placeholder="Provide a captivating 1-2 sentence preview for customer cards..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Article Body Content (Supports HTML / Rich Text) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Enter full article story with <h2>, <p>, <ul>, <blockquote> formatting..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 text-xs text-gray-900 focus:outline-none focus:border-purple-600 font-mono leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Surat Silk, Saree Guide, Wedding"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <span className="font-semibold text-gray-900 block text-xs">SEO & Publishing Options</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="SEO Meta Title (Optional)"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                  />
                  <input
                    type="text"
                    placeholder="SEO Meta Description (Optional)"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium text-gray-700">Publish immediately to storefront</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingBlog ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
