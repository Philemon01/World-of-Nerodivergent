import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Book as BookIcon, Newspaper, Save, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { createPost, createBook } from '../lib/services';

export default function AdminDashboard({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'books'>('posts');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Post State
  const [postData, setPostData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    category: 'Education',
    published: true
  });

  // Book State
  const [bookData, setBookData] = useState({
    title: '',
    description: '',
    price: 0,
    currency: '£',
    coverImage: '',
    storeUrl: '',
    published: true,
    order: 0
  });

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;
    setLoading(true);
    try {
      await createPost({
        ...postData,
        authorId: user.uid,
      });
      setSuccess(true);
      setPostData({ title: '', slug: '', content: '', excerpt: '', coverImage: '', category: 'Education', published: true });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;
    setLoading(true);
    try {
      await createBook({
        ...bookData,
        previewImages: []
      });
      setSuccess(true);
      setBookData({ title: '', description: '', price: 0, currency: '£', coverImage: '', storeUrl: '', published: true, order: 0 });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-brand-dark/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-2xl font-black text-brand-dark">Admin Dashboard</h2>
                <p className="text-sm text-slate-500">Manage your contents and publications</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-slate-400 hover:text-brand-dark transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-8 pt-4 gap-4 bg-slate-50">
              <button 
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-3 rounded-t-2xl font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'posts' ? 'bg-white text-rainbow-blue shadow-sm' : 'text-slate-400 hover:text-brand-dark'
                }`}
              >
                <Newspaper size={18} />
                Blog Posts
              </button>
              <button 
                onClick={() => setActiveTab('books')}
                className={`px-6 py-3 rounded-t-2xl font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'books' ? 'bg-white text-rainbow-orange shadow-sm' : 'text-slate-400 hover:text-brand-dark'
                }`}
              >
                <BookIcon size={18} />
                Books & Resources
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto p-8">
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-3 font-bold border border-green-100"
                >
                  <CheckCircle size={20} />
                  Content created successfully!
                </motion.div>
              )}

              {activeTab === 'posts' ? (
                <form onSubmit={handlePostSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 ml-2">Post Title</label>
                      <input 
                        required
                        value={postData.title}
                        onChange={e => setPostData({...postData, title: e.target.value})}
                        className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-blue outline-none transition-all font-medium"
                        placeholder="Enter catchy title..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 ml-2">Slug (URL friendly)</label>
                      <input 
                        required
                        value={postData.slug}
                        onChange={e => setPostData({...postData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                        className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-blue outline-none transition-all font-medium"
                        placeholder="my-awesome-post"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-2">Excerpt (Short Summary)</label>
                    <textarea 
                      required
                      value={postData.excerpt}
                      onChange={e => setPostData({...postData, excerpt: e.target.value})}
                      className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-blue outline-none transition-all font-medium h-20"
                      placeholder="What is this post about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-2">Content (Markdown Supported)</label>
                    <textarea 
                      required
                      value={postData.content}
                      onChange={e => setPostData({...postData, content: e.target.value})}
                      className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-blue outline-none transition-all font-medium h-48 font-mono text-sm"
                      placeholder="Write your brilliant ideas here..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 ml-2">Cover Image URL</label>
                      <input 
                        value={postData.coverImage}
                        onChange={e => setPostData({...postData, coverImage: e.target.value})}
                        className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-blue outline-none transition-all font-medium"
                        placeholder="https://unsplash.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 ml-2">Category</label>
                      <select 
                        value={postData.category}
                        onChange={e => setPostData({...postData, category: e.target.value})}
                        className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-blue outline-none transition-all font-bold text-slate-600"
                      >
                        <option>Education</option>
                        <option>Advocacy</option>
                        <option>Community</option>
                        <option>Research</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full bg-rainbow-blue text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-rainbow-blue/20 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Creating...' : <><Save size={20} /> Publish Post</>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleBookSubmit} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 ml-2">Book Title</label>
                      <input 
                        required
                        value={bookData.title}
                        onChange={e => setBookData({...bookData, title: e.target.value})}
                        className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-orange outline-none transition-all font-medium"
                        placeholder="Resource name..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 ml-2">Cover Image URL</label>
                      <input 
                        required
                        value={bookData.coverImage}
                        onChange={e => setBookData({...bookData, coverImage: e.target.value})}
                        className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-orange outline-none transition-all font-medium"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-2">Description</label>
                    <textarea 
                      required
                      value={bookData.description}
                      onChange={e => setBookData({...bookData, description: e.target.value})}
                      className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-orange outline-none transition-all font-medium h-32"
                      placeholder="What makes this book special?"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 ml-2">Price</label>
                      <input 
                        type="number"
                        required
                        value={bookData.price}
                        onChange={e => setBookData({...bookData, price: Number(e.target.value)})}
                        className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-orange outline-none transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2 relative">
                       <label className="text-sm font-bold text-slate-600 ml-2">Currency</label>
                       <input 
                        required
                        value={bookData.currency}
                        onChange={e => setBookData({...bookData, currency: e.target.value})}
                        className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-orange outline-none transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 ml-2">Display Order</label>
                      <input 
                        type="number"
                        value={bookData.order}
                        onChange={e => setBookData({...bookData, order: Number(e.target.value)})}
                        className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-orange outline-none transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-2">Store URL (External Link)</label>
                    <input 
                      required
                      value={bookData.storeUrl}
                      onChange={e => setBookData({...bookData, storeUrl: e.target.value})}
                      className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-orange outline-none transition-all font-medium"
                      placeholder="https://amazon.com/... or your custom shop"
                    />
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full bg-rainbow-orange text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-rainbow-orange/20 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Adding...' : <><Plus size={20} /> Add Resource</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
