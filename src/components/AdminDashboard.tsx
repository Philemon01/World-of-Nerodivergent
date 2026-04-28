import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Book as BookIcon, Newspaper, Save, Image as ImageIcon, CheckCircle, Trash2, Edit3, Upload, FileText, Globe } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { 
  createPost, updatePost, deletePost, getAllPosts, 
  createBook, updateBook, deleteBook, getAllBooks,
  createResource, updateResource, deleteResource, getAllResources,
  uploadFile, Post, Book, Resource 
} from '../lib/services';

type Tab = 'posts' | 'books' | 'resources';

export default function AdminDashboard({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Lists
  const [posts, setPosts] = useState<Post[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

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

  // Resource State
  const [resourceData, setResourceData] = useState({
    title: '',
    description: '',
    type: 'pdf' as 'pdf' | 'guide' | 'checklist' | 'infographic',
    fileUrl: '',
    isFree: true,
    published: true
  });

  const fetchData = async () => {
    if (!isAdmin) return;
    const [p, b, r] = await Promise.all([
      getAllPosts(),
      getAllBooks(),
      getAllResources()
    ]);
    setPosts(p);
    setBooks(b);
    setResources(r);
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchData();
    }
  }, [isOpen, isAdmin]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, folder: string, target: 'post' | 'book' | 'resource') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const url = await uploadFile(file, folder);
      if (target === 'post') setPostData({ ...postData, coverImage: url });
      if (target === 'book') setBookData({ ...bookData, coverImage: url });
      if (target === 'resource') setResourceData({ ...resourceData, fileUrl: url });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;
    setLoading(true);
    try {
      if (editingId) {
        await updatePost(editingId, postData);
      } else {
        await createPost({ ...postData, authorId: user.uid });
      }
      setSuccess(true);
      resetForms();
      fetchData();
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
      if (editingId) {
        await updateBook(editingId, bookData);
      } else {
        await createBook({ ...bookData, previewImages: [] });
      }
      setSuccess(true);
      resetForms();
      fetchData();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;
    setLoading(true);
    try {
      if (editingId) {
        await updateResource(editingId, resourceData);
      } else {
        await createResource(resourceData);
      }
      setSuccess(true);
      resetForms();
      fetchData();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: Tab) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    setLoading(true);
    try {
      if (type === 'posts') await deletePost(id);
      if (type === 'books') await deleteBook(id);
      if (type === 'resources') await deleteResource(id);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: any, type: Tab) => {
    setEditingId(item.id);
    if (type === 'posts') {
      setPostData({
        title: item.title,
        slug: item.slug,
        content: item.content,
        excerpt: item.excerpt,
        coverImage: item.coverImage,
        category: item.category,
        published: item.published
      });
      setActiveTab('posts');
    } else if (type === 'books') {
      setBookData({
        title: item.title,
        description: item.description,
        price: item.price,
        currency: item.currency,
        coverImage: item.coverImage,
        storeUrl: item.storeUrl,
        published: item.published,
        order: item.order
      });
      setActiveTab('books');
    } else if (type === 'resources') {
      setResourceData({
        title: item.title,
        description: item.description,
        type: item.type,
        fileUrl: item.fileUrl,
        isFree: item.isFree,
        published: item.published
      });
      setActiveTab('resources');
    }
  };

  const resetForms = () => {
    setEditingId(null);
    setPostData({ title: '', slug: '', content: '', excerpt: '', coverImage: '', category: 'Education', published: true });
    setBookData({ title: '', description: '', price: 0, currency: '£', coverImage: '', storeUrl: '', published: true, order: 0 });
    setResourceData({ title: '', description: '', type: 'pdf', fileUrl: '', isFree: true, published: true });
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
                onClick={() => { setActiveTab('posts'); resetForms(); }}
                className={`px-6 py-3 rounded-t-2xl font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'posts' ? 'bg-white text-rainbow-blue shadow-sm' : 'text-slate-400 hover:text-brand-dark'
                }`}
              >
                <Newspaper size={18} />
                Blog Posts
              </button>
              <button 
                onClick={() => { setActiveTab('books'); resetForms(); }}
                className={`px-6 py-3 rounded-t-2xl font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'books' ? 'bg-white text-rainbow-orange shadow-sm' : 'text-slate-400 hover:text-brand-dark'
                }`}
              >
                <BookIcon size={18} />
                Books
              </button>
              <button 
                onClick={() => { setActiveTab('resources'); resetForms(); }}
                className={`px-6 py-3 rounded-t-2xl font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'resources' ? 'bg-white text-rainbow-green shadow-sm' : 'text-slate-400 hover:text-brand-dark'
                }`}
              >
                <FileText size={18} />
                Resources
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
                  Action completed successfully!
                </motion.div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Form Side */}
                <div className="lg:col-span-7">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-brand-dark">
                      {editingId ? 'Edit existing' : 'Create new'} {activeTab.slice(0, -1)}
                    </h3>
                    {editingId && (
                      <button onClick={resetForms} className="text-sm font-bold text-rainbow-red hover:underline">
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  {activeTab === 'posts' && (
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
                          <label className="text-sm font-bold text-slate-600 ml-2">Cover Image</label>
                          <div className="flex gap-2">
                            <input 
                              value={postData.coverImage}
                              onChange={e => setPostData({...postData, coverImage: e.target.value})}
                              className="flex-grow px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-blue outline-none transition-all font-medium"
                              placeholder="URL or Upload ->"
                            />
                            <label className="w-12 h-12 flex-shrink-0 bg-slate-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                              <Upload size={18} className="text-slate-500" />
                              <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'posts', 'post')} />
                            </label>
                          </div>
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

                      <div className="flex items-center gap-4 py-4 px-2">
                        <input 
                          type="checkbox" 
                          id="post-published"
                          checked={postData.published} 
                          onChange={e => setPostData({...postData, published: e.target.checked})}
                          className="w-6 h-6 rounded-lg text-rainbow-blue focus:ring-rainbow-blue"
                        />
                        <label htmlFor="post-published" className="font-bold text-slate-700">Publish immediately?</label>
                      </div>

                      <button 
                        disabled={loading}
                        className="w-full bg-rainbow-blue text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-rainbow-blue/20 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? 'Processing...' : <><Save size={20} /> {editingId ? 'Update Post' : 'Publish Post'}</>}
                      </button>
                    </form>
                  )}

                  {activeTab === 'books' && (
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
                          <label className="text-sm font-bold text-slate-600 ml-2">Cover Image</label>
                           <div className="flex gap-2">
                            <input 
                              required
                              value={bookData.coverImage}
                              onChange={e => setBookData({...bookData, coverImage: e.target.value})}
                              className="flex-grow px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-orange outline-none transition-all font-medium"
                              placeholder="https://..."
                            />
                            <label className="w-12 h-12 flex-shrink-0 bg-slate-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                              <Upload size={18} className="text-slate-500" />
                              <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'books', 'book')} />
                            </label>
                          </div>
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

                      <div className="flex items-center gap-4 py-4 px-2">
                        <input 
                          type="checkbox" 
                          id="book-published"
                          checked={bookData.published} 
                          onChange={e => setBookData({...bookData, published: e.target.checked})}
                          className="w-6 h-6 rounded-lg text-rainbow-orange focus:ring-rainbow-orange"
                        />
                        <label htmlFor="book-published" className="font-bold text-slate-700">Display in store?</label>
                      </div>

                      <button 
                        disabled={loading}
                        className="w-full bg-rainbow-orange text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-rainbow-orange/20 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? 'Processing...' : <><Save size={20} /> {editingId ? 'Update Book' : 'Add Book'}</>}
                      </button>
                    </form>
                  )}

                  {activeTab === 'resources' && (
                    <form onSubmit={handleResourceSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-600 ml-2">Resource Title</label>
                          <input 
                            required
                            value={resourceData.title}
                            onChange={e => setResourceData({...resourceData, title: e.target.value})}
                            className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-green outline-none transition-all font-medium"
                            placeholder="Resource name..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-600 ml-2">Type</label>
                          <select 
                            value={resourceData.type}
                            onChange={e => setResourceData({...resourceData, type: e.target.value as any})}
                            className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-green outline-none transition-all font-bold text-slate-600"
                          >
                            <option value="pdf">PDF Document</option>
                            <option value="guide">Guide Book</option>
                            <option value="checklist">Checklist</option>
                            <option value="infographic">Infographic</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600 ml-2">Description</label>
                        <textarea 
                          required
                          value={resourceData.description}
                          onChange={e => setResourceData({...resourceData, description: e.target.value})}
                          className="w-full px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-green outline-none transition-all font-medium h-24"
                          placeholder="What is this resource for?"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600 ml-2">File / Asset</label>
                        <div className="flex gap-2">
                          <input 
                            required
                            value={resourceData.fileUrl}
                            onChange={e => setResourceData({...resourceData, fileUrl: e.target.value})}
                            className="flex-grow px-6 py-3 rounded-xl border border-slate-200 focus:border-rainbow-green outline-none transition-all font-medium"
                            placeholder="Upload file or URL..."
                          />
                          <label className="w-12 h-12 flex-shrink-0 bg-slate-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                            <Upload size={18} className="text-slate-500" />
                            <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'resources', 'resource')} />
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-4 py-4 px-2">
                          <input 
                            type="checkbox" 
                            id="res-free"
                            checked={resourceData.isFree} 
                            onChange={e => setResourceData({...resourceData, isFree: e.target.checked})}
                            className="w-6 h-6 rounded-lg text-rainbow-green focus:ring-rainbow-green"
                          />
                          <label htmlFor="res-free" className="font-bold text-slate-700">Free download?</label>
                        </div>
                         <div className="flex items-center gap-4 py-4 px-2">
                          <input 
                            type="checkbox" 
                            id="res-published"
                            checked={resourceData.published} 
                            onChange={e => setResourceData({...resourceData, published: e.target.checked})}
                            className="w-6 h-6 rounded-lg text-rainbow-green focus:ring-rainbow-green"
                          />
                          <label htmlFor="res-published" className="font-bold text-slate-700">Published?</label>
                        </div>
                      </div>

                      <button 
                        disabled={loading}
                        className="w-full bg-rainbow-green text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-rainbow-green/20 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? 'Processing...' : <><Save size={20} /> {editingId ? 'Update Resource' : 'Add Resource'}</>}
                      </button>
                    </form>
                  )}
                </div>

                {/* List Side */}
                <div className="lg:col-span-5 border-l border-slate-100 pl-4">
                  <h3 className="text-xl font-bold text-brand-dark mb-8">Manage {activeTab}</h3>
                  <div className="space-y-4">
                    {activeTab === 'posts' && posts.map(post => (
                      <div key={post.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between group">
                        <div className="flex-grow min-w-0 pr-4">
                          <h4 className="font-bold text-brand-dark truncate">{post.title}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${post.published ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                            {post.published ? 'LIVE' : 'DRAFT'}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(post, 'posts')} className="p-2 text-slate-400 hover:text-rainbow-blue transition-colors">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDelete(post.id!, 'posts')} className="p-2 text-slate-400 hover:text-rainbow-red transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {activeTab === 'books' && books.map(book => (
                      <div key={book.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                         <div className="flex-grow min-w-0 pr-4">
                          <h4 className="font-bold text-brand-dark truncate">{book.title}</h4>
                          <span className="text-xs text-slate-500">{book.currency}{book.price}</span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(book, 'books')} className="p-2 text-slate-400 hover:text-rainbow-orange transition-colors">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDelete(book.id!, 'books')} className="p-2 text-slate-400 hover:text-rainbow-red transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {activeTab === 'resources' && resources.map(res => (
                      <div key={res.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                         <div className="flex-grow min-w-0 pr-4">
                          <h4 className="font-bold text-brand-dark truncate">{res.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 uppercase">
                            {res.type}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(res, 'resources')} className="p-2 text-slate-400 hover:text-rainbow-green transition-colors">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDelete(res.id!, 'resources')} className="p-2 text-slate-400 hover:text-rainbow-red transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
