import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Book as BookIcon, Newspaper, Save, CheckCircle, 
  Trash2, Edit3, Upload, FileText, LayoutDashboard, 
  Users, Settings, LogOut, ChevronRight, Globe, Info
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  createPost, updatePost, deletePost, getAllPosts, 
  createBook, updateBook, deleteBook, getAllBooks,
  createResource, updateResource, deleteResource, getAllResources,
  uploadFile, Post, Book, Resource 
} from '../lib/services';
import { auth } from '../lib/firebase';

type Tab = 'posts' | 'books' | 'resources' | 'users';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Lists
  const [posts, setPosts] = useState<Post[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  // Form States
  const [postData, setPostData] = useState({ title: '', slug: '', content: '', excerpt: '', coverImage: '', category: 'Education', published: true });
  const [bookData, setBookData] = useState({ title: '', description: '', price: 0, currency: '£', coverImage: '', storeUrl: '', published: true, order: 0 });
  const [resourceData, setResourceData] = useState({ title: '', description: '', type: 'pdf' as any, fileUrl: '', isFree: true, published: true });

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
    if (!isAdmin && user) {
      navigate('/dashboard');
    } else if (!user) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [isAdmin, user, navigate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, folder: string, target: 'post' | 'book' | 'resource') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const url = await uploadFile(file, folder);
      if (target === 'post') setPostData(prev => ({ ...prev, coverImage: url }));
      if (target === 'book') setBookData(prev => ({ ...prev, coverImage: url }));
      if (target === 'resource') setResourceData(prev => ({ ...prev, fileUrl: url }));
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
    } catch (err) { console.error(err); } finally { setLoading(false); }
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
    } catch (err) { console.error(err); } finally { setLoading(false); }
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
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDelete = async (id: string, type: Tab) => {
    if (!window.confirm('Delete this item forever?')) return;
    setLoading(true);
    try {
      if (type === 'posts') await deletePost(id);
      if (type === 'books') await deleteBook(id);
      if (type === 'resources') await deleteResource(id);
      fetchData();
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const startEdit = (item: any, type: Tab) => {
    setEditingId(item.id);
    if (type === 'posts') {
      setPostData({ title: item.title, slug: item.slug, content: item.content, excerpt: item.excerpt, coverImage: item.coverImage, category: item.category, published: item.published });
      setActiveTab('posts');
    } else if (type === 'books') {
      setBookData({ title: item.title, description: item.description, price: item.price, currency: item.currency, coverImage: item.coverImage, storeUrl: item.storeUrl, published: item.published, order: item.order });
      setActiveTab('books');
    } else if (type === 'resources') {
      setResourceData({ title: item.title, description: item.description, type: item.type, fileUrl: item.fileUrl, isFree: item.isFree, published: item.published });
      setActiveTab('resources');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForms = () => {
    setEditingId(null);
    setPostData({ title: '', slug: '', content: '', excerpt: '', coverImage: '', category: 'Education', published: true });
    setBookData({ title: '', description: '', price: 0, currency: '£', coverImage: '', storeUrl: '', published: true, order: 0 });
    setResourceData({ title: '', description: '', type: 'pdf', fileUrl: '', isFree: true, published: true });
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-28">
              <div className="flex items-center gap-4 mb-8 px-2">
                <div className="w-12 h-12 bg-rainbow-gradient rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <LayoutDashboard size={24} />
                </div>
                <div>
                  <h2 className="font-black text-brand-dark leading-none">Admin Panel</h2>
                  <span className="text-[10px] font-black text-rainbow-blue tracking-widest uppercase">Management</span>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'posts', label: 'Blog Posts', icon: Newspaper, color: 'text-rainbow-blue' },
                  { id: 'books', label: 'Book Store', icon: BookIcon, color: 'text-rainbow-orange' },
                  { id: 'resources', label: 'Resources', icon: FileText, color: 'text-rainbow-green' },
                  { id: 'users', label: 'User Roles', icon: Users, color: 'text-purple-500' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as Tab); resetForms(); }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all group ${
                      activeTab === item.id 
                        ? 'bg-slate-50 text-brand-dark shadow-inner' 
                        : 'text-slate-400 hover:bg-slate-50/50 hover:text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className={activeTab === item.id ? item.color : ''} />
                      {item.label}
                    </div>
                    <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-all ${activeTab === item.id ? 'translate-x-1 opacity-100' : ''}`} />
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-slate-50">
                 <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 text-rainbow-red font-bold hover:bg-rainbow-red/5 rounded-2xl transition-all"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Dashboard */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm min-h-[600px]"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-brand-dark flex items-center gap-3 capitalize">
                      {activeTab} Management
                    </h1>
                    <p className="text-slate-500 font-medium">Create, edit, and organize your community {activeTab}.</p>
                  </div>
                  {success && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-green-50 text-green-700 px-6 py-3 rounded-2xl font-bold border border-green-100 flex items-center gap-2"
                    >
                      <CheckCircle size={18} /> Saved successfully!
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                  {/* Form Section */}
                  <div className="xl:col-span-7">
                    <div className="flex items-center gap-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-dark shadow-sm">
                        <Plus size={20} />
                      </div>
                      <h3 className="font-black text-brand-dark">
                        {editingId ? 'Edit existing' : 'Create new'} {activeTab.slice(0,-1)}
                      </h3>
                    </div>

                    {activeTab === 'posts' && (
                      <form onSubmit={handlePostSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                            <input value={postData.title} onChange={e => setPostData({...postData, title: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-blue focus:bg-white outline-none transition-all font-medium" placeholder="Catchy title..." required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slug</label>
                            <input value={postData.slug} onChange={e => setPostData({...postData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-blue focus:bg-white outline-none transition-all font-medium" placeholder="url-friendly-slug" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Excerpt</label>
                          <textarea value={postData.excerpt} onChange={e => setPostData({...postData, excerpt: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-blue focus:bg-white outline-none transition-all font-medium h-20" placeholder="Brief summary for cards..." required />
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between items-center px-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Content (Markdown)</label>
                              <a href="https://commonmark.org/help/" target="_blank" rel="noreferrer" className="text-[10px] font-black text-rainbow-blue uppercase italic">Guide</a>
                           </div>
                          <textarea value={postData.content} onChange={e => setPostData({...postData, content: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-blue focus:bg-white outline-none transition-all font-mono text-sm h-64" placeholder="Write your insight here..." required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image</label>
                            <div className="flex gap-2">
                              <input value={postData.coverImage} onChange={e => setPostData({...postData, coverImage: e.target.value})} className="flex-grow px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-blue focus:bg-white outline-none transition-all font-medium" placeholder="Upload or URL..." />
                              <label className="w-12 h-12 flex-shrink-0 bg-slate-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all border-2 border-transparent hover:border-rainbow-blue">
                                <Upload size={18} className="text-slate-500" />
                                <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'posts', 'post')} />
                              </label>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                            <select value={postData.category} onChange={e => setPostData({...postData, category: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-blue focus:bg-white outline-none transition-all font-bold text-slate-600">
                               <option>Education</option>
                               <option>Advocacy</option>
                               <option>Community</option>
                               <option>Research</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <input type="checkbox" id="p-pub" checked={postData.published} onChange={e => setPostData({...postData, published: e.target.checked})} className="w-5 h-5 rounded-lg text-rainbow-blue focus:ring-rainbow-blue" />
                           <label htmlFor="p-pub" className="text-sm font-bold text-slate-600">Ready to publish?</label>
                        </div>
                        <button disabled={loading} className="w-full py-4 bg-rainbow-blue text-white rounded-2xl font-black text-lg shadow-xl shadow-rainbow-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                          {loading ? 'Saving...' : <><Save size={20} /> {editingId ? 'Update Post' : 'Create Post'}</>}
                        </button>
                      </form>
                    )}

                    {activeTab === 'books' && (
                      <form onSubmit={handleBookSubmit} className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                            <input value={bookData.title} onChange={e => setBookData({...bookData, title: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-orange focus:bg-white outline-none transition-all font-medium" placeholder="Book Title..." required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Order</label>
                            <input type="number" value={bookData.order} onChange={e => setBookData({...bookData, order: parseInt(e.target.value)})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-orange focus:bg-white outline-none transition-all font-bold" required />
                          </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                            <textarea value={bookData.description} onChange={e => setBookData({...bookData, description: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-orange focus:bg-white outline-none transition-all font-medium h-32" placeholder="What is this book about?" required />
                          </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image</label>
                              <div className="flex gap-2">
                                <input value={bookData.coverImage} onChange={e => setBookData({...bookData, coverImage: e.target.value})} className="flex-grow px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-orange focus:bg-white outline-none transition-all font-medium" placeholder="Upload or URL..." />
                                <label className="w-12 h-12 flex-shrink-0 bg-slate-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all border-2 border-transparent hover:border-rainbow-orange">
                                  <Upload size={18} className="text-slate-500" />
                                  <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'books', 'book')} />
                                </label>
                              </div>
                            </div>
                             <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Link</label>
                               <div className="relative">
                                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                  <input value={bookData.storeUrl} onChange={e => setBookData({...bookData, storeUrl: e.target.value})} className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-orange focus:bg-white outline-none transition-all font-medium" placeholder="External store URL..." required />
                               </div>
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price</label>
                              <input type="number" step="0.01" value={bookData.price} onChange={e => setBookData({...bookData, price: parseFloat(e.target.value)})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-orange focus:bg-white outline-none transition-all font-bold" required />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Currency</label>
                              <input value={bookData.currency} onChange={e => setBookData({...bookData, currency: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-orange focus:bg-white outline-none transition-all font-bold" placeholder="£, $, etc" required />
                            </div>
                         </div>
                        <button disabled={loading} className="w-full py-4 bg-rainbow-orange text-white rounded-2xl font-black text-lg shadow-xl shadow-rainbow-orange/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                          {loading ? 'Saving...' : <><Save size={20} /> {editingId ? 'Update Book' : 'Add Book'}</>}
                        </button>
                      </form>
                    )}

                    {activeTab === 'resources' && (
                      <form onSubmit={handleResourceSubmit} className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Resource Title</label>
                            <input value={resourceData.title} onChange={e => setResourceData({...resourceData, title: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-green focus:bg-white outline-none transition-all font-medium" placeholder="Resource Name..." required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Format Type</label>
                            <select value={resourceData.type} onChange={e => setResourceData({...resourceData, type: e.target.value as any})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-green focus:bg-white outline-none transition-all font-bold text-slate-600">
                               <option value="pdf">Document (PDF)</option>
                               <option value="guide">Guide Book</option>
                               <option value="checklist">Process Checklist</option>
                               <option value="infographic">Visual Infographic</option>
                            </select>
                          </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Description</label>
                            <textarea value={resourceData.description} onChange={e => setResourceData({...resourceData, description: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-green focus:bg-white outline-none transition-all font-medium h-24" placeholder="Brief explanation of value..." required />
                          </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">File / Asset</label>
                            <div className="flex gap-2">
                              <input value={resourceData.fileUrl} onChange={e => setResourceData({...resourceData, fileUrl: e.target.value})} className="flex-grow px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-green focus:bg-white outline-none transition-all font-medium" placeholder="Upload file or paste link..." required />
                              <label className="w-12 h-12 flex-shrink-0 bg-slate-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all border-2 border-transparent hover:border-rainbow-green">
                                <Upload size={18} className="text-slate-500" />
                                <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'resources', 'resource')} />
                              </label>
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                           <div className="flex items-center gap-3 p-2">
                              <input type="checkbox" id="res-free" checked={resourceData.isFree} onChange={e => setResourceData({...resourceData, isFree: e.target.checked})} className="w-5 h-5 rounded-lg text-rainbow-green focus:ring-rainbow-green" />
                              <label htmlFor="res-free" className="text-sm font-bold text-slate-600">Free Download?</label>
                           </div>
                           <div className="flex items-center gap-3 p-2">
                              <input type="checkbox" id="res-pub" checked={resourceData.published} onChange={e => setResourceData({...resourceData, published: e.target.checked})} className="w-5 h-5 rounded-lg text-rainbow-green focus:ring-rainbow-green" />
                              <label htmlFor="res-pub" className="text-sm font-bold text-slate-600">Make Public?</label>
                           </div>
                         </div>
                        <button disabled={loading} className="w-full py-4 bg-rainbow-green text-white rounded-2xl font-black text-lg shadow-xl shadow-rainbow-green/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                          {loading ? 'Saving...' : <><Save size={20} /> {editingId ? 'Update Resource' : 'Add Resource'}</>}
                        </button>
                      </form>
                    )}

                    {activeTab === 'users' && (
                      <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 text-center">
                        <Users size={64} className="mx-auto mb-6 text-slate-200" />
                        <h3 className="text-2xl font-black text-brand-dark mb-4">Role Management</h3>
                        <p className="text-slate-600 font-medium mb-8">
                          User role management is currently handled via the sync system. To grant manual access, use the Firebase Console.
                        </p>
                        <div className="p-4 bg-rainbow-blue/10 rounded-2xl border border-rainbow-blue/20 flex gap-4 text-left">
                           <Info className="shrink-0 text-rainbow-blue" />
                           <p className="text-xs text-rainbow-blue font-bold">
                             System roles (Admin & Creator) are restricted to authorized emails and verified statuses for security integrity.
                           </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* List Section */}
                  <div className="xl:col-span-5 border-l border-slate-50 pl-4 space-y-6">
                    <h3 className="text-xl font-black text-brand-dark flex items-center gap-2">
                      Manage {activeTab} <span className="text-[10px] font-black px-2 py-1 bg-slate-100 rounded-lg text-slate-400">COUNT: {activeTab === 'posts' ? posts.length : activeTab === 'books' ? books.length : resources.length}</span>
                    </h3>
                    
                    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                      {activeTab === 'posts' && posts.map(it => (
                        <div key={it.id} className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all flex items-center justify-between group">
                          <div className="min-w-0 pr-4">
                            <h4 className="font-bold text-brand-dark truncate">{it.title}</h4>
                            <div className="flex gap-2">
                               <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${it.published ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                                {it.published ? 'LIVE' : 'DRAFT'}
                              </span>
                              <span className="text-[8px] font-black text-slate-400 uppercase italic">{it.category}</span>
                            </div>
                          </div>
                          <div className="flex shrink-0">
                            <button onClick={() => startEdit(it, 'posts')} className="p-2 text-slate-300 hover:text-rainbow-blue transition-all"><Edit3 size={18} /></button>
                            <button onClick={() => handleDelete(it.id!, 'posts')} className="p-2 text-slate-300 hover:text-rainbow-red transition-all"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      ))}
                      {activeTab === 'books' && books.map(it => (
                        <div key={it.id} className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all flex items-center justify-between">
                          <div className="min-w-0 pr-4">
                            <h4 className="font-bold text-brand-dark truncate">{it.title}</h4>
                            <span className="text-xs text-rainbow-orange font-black italic">{it.currency}{it.price}</span>
                          </div>
                          <div className="flex shrink-0">
                            <button onClick={() => startEdit(it, 'books')} className="p-2 text-slate-300 hover:text-rainbow-orange transition-all"><Edit3 size={18} /></button>
                            <button onClick={() => handleDelete(it.id!, 'books')} className="p-2 text-slate-300 hover:text-rainbow-red transition-all"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      ))}
                      {activeTab === 'resources' && resources.map(it => (
                        <div key={it.id} className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all flex items-center justify-between">
                          <div className="min-w-0 pr-4">
                            <h4 className="font-bold text-brand-dark truncate">{it.title}</h4>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{it.type}</span>
                          </div>
                          <div className="flex shrink-0">
                            <button onClick={() => startEdit(it, 'resources')} className="p-2 text-slate-300 hover:text-rainbow-green transition-all"><Edit3 size={18} /></button>
                            <button onClick={() => handleDelete(it.id!, 'resources')} className="p-2 text-slate-300 hover:text-rainbow-red transition-all"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
