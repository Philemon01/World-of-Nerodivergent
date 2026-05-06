import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { getUserPurchases, getBookById, Book, updateUserProfile } from '../lib/services';
import { auth } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Book as BookIcon, Download, ShoppingBag, ArrowRight, User, Settings, LogOut, FileText, CheckCircle, Save, Edit2, X, Clock } from 'lucide-react';

export default function UserDashboard() {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'purchases' | 'profile'>('purchases');
  const [purchasedBooks, setPurchasedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    setEditName(profile?.displayName || user.displayName || '');
    setEditBio(profile?.bio || '');

    const fetchData = async () => {
      try {
        const purchases = await getUserPurchases(user.uid);
        const bookIds = purchases
          .filter(p => p.itemType === 'book')
          .map(p => p.itemId);
        
        const bookPromises = bookIds.map(id => getBookById(id));
        const books = await Promise.all(bookPromises);
        setPurchasedBooks(books.filter((b): b is Book => b !== null));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, profile]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setSaving(true);
    setStatus(null);
    try {
      await updateUserProfile(user.uid, {
        displayName: editName,
        bio: editBio
      });
      setStatus({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Dashboard Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-dark rounded-[2.5rem] p-6 md:p-10 mb-10 relative overflow-hidden shadow-2xl shadow-brand-dark/20"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-rainbow-blue/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 p-1 bg-rainbow-gradient shadow-2xl shrink-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-brand-dark flex items-center justify-center text-white text-4xl font-black rounded-full">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left flex-grow">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-black text-white leading-none">
                  Hi, {profile?.displayName?.split(' ')[0] || user.displayName?.split(' ')[0] || 'Advocate'}!
                </h1>
                <span className="inline-block px-3 py-0.5 rounded-full bg-white/10 text-white/70 font-black text-[9px] uppercase tracking-[2px] border border-white/5 self-center md:self-auto capitalize">
                  {profile?.role || 'Member'}
                </span>
              </div>
              <p className="text-white/50 text-lg font-medium max-w-2xl leading-relaxed">
                {profile?.bio || 'Advocating for neurodiversity, one story at a time. Welcome to your personal sanctuary of change.'}
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
               {isAdmin && (
                 <button 
                  onClick={() => navigate('/admin')}
                  className="px-6 py-3 bg-rainbow-blue text-white rounded-2xl font-black shadow-xl shadow-rainbow-blue/20 hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                 >
                   <Settings size={16} /> Admin Dashboard
                 </button>
               )}
               <button 
                onClick={() => setActiveTab('profile')}
                className="px-6 py-3 bg-white text-brand-dark rounded-2xl font-black shadow-xl shadow-white/5 hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
               >
                 <Settings size={16} /> Account Settings
               </button>
               <button 
                onClick={handleLogout}
                className="px-6 py-3 bg-white/5 text-white/50 rounded-2xl font-black hover:bg-rainbow-red hover:text-white transition-all text-sm flex items-center justify-center gap-2"
               >
                 <LogOut size={16} /> Sign Out
               </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm space-y-1">
              {[
                { id: 'purchases', label: 'My Library', icon: ShoppingBag, color: 'text-rainbow-blue' },
                { id: 'profile', label: 'Edit Profile', icon: User, color: 'text-rainbow-green' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3.5 p-4 rounded-xl font-black transition-all group text-sm ${activeTab === tab.id ? 'bg-slate-50 text-brand-dark translate-x-1.5' : 'text-slate-400 hover:bg-slate-50/50 hover:text-brand-dark'}`}
                >
                  <tab.icon size={20} className={activeTab === tab.id ? tab.color : 'text-slate-300 group-hover:text-slate-400'} />
                  {tab.label}
                  {activeTab === tab.id && <div className={`ml-auto w-1 h-1 rounded-full ${tab.color.replace('text-', 'bg-')}`} />}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'purchases' && (
                <motion.div
                  key="purchases"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <header className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-black text-brand-dark">My Library</h2>
                      <p className="text-slate-500 font-bold text-sm">Manage your books and digital content.</p>
                    </div>
                    <Link to="/" className="text-rainbow-blue font-black hover:underline flex items-center gap-1 text-[13px]">
                      Visit Bookstore <ArrowRight size={16} />
                    </Link>
                  </header>
                  
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                      {[1, 2].map(i => (
                        <div key={i} className="h-48 bg-slate-200 rounded-[2rem]" />
                      ))}
                    </div>
                  ) : purchasedBooks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {purchasedBooks.map((book) => (
                        <div key={book.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex gap-6 group">
                          <div className="w-28 h-36 shrink-0 rounded-[1.25rem] overflow-hidden shadow-lg border-2 border-white bg-slate-50 relative">
                            <img src={book.coverImage} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-rainbow-blue/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Download className="text-white" size={28} />
                            </div>
                          </div>
                          <div className="flex flex-col justify-between py-1">
                            <div>
                               <h3 className="text-xl font-black text-brand-dark mb-1 leading-tight">{book.title}</h3>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{book.author}</p>
                            </div>
                            <button className="px-6 py-3 bg-brand-dark text-white rounded-xl font-black text-xs shadow-xl shadow-brand-dark/20 hover:scale-105 transition-all text-center">
                                Download PDF
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-12 md:p-20 rounded-[3rem] border-2 border-dashed border-slate-100 text-center shadow-sm">
                       <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                         <ShoppingBag size={40} />
                       </div>
                       <h3 className="text-2xl font-black text-brand-dark mb-3">You haven't bought anything yet</h3>
                       <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                         Our bookstore features exclusive titles supporting neurodivergent experiences. Buy your first copy to start your library.
                       </p>
                       <Link to="/" className="px-10 py-4 bg-rainbow-blue text-white rounded-2xl font-black shadow-xl shadow-rainbow-blue/20 hover:scale-105 active:scale-95 transition-all text-sm inline-block">
                         Go to Bookstore
                       </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-brand-dark">Profile Settings</h2>
                      <p className="text-slate-500 font-bold text-sm">Personalize how others see you in the community.</p>
                    </div>
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-5 py-2.5 bg-slate-50 text-brand-dark rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-100 transition-all border border-slate-100"
                      >
                        <Edit2 size={16} /> Edit Profile
                      </button>
                    ) : (
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-2.5 bg-rainbow-red/10 text-rainbow-red rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-rainbow-red/20 transition-all border border-rainbow-red/10"
                      >
                        <X size={16} /> Cancel
                      </button>
                    )}
                  </div>

                  {status && (
                    <div className={`mb-8 p-5 rounded-2xl flex items-center gap-3 font-bold text-sm ${status.type === 'success' ? 'bg-rainbow-green/10 text-rainbow-green border border-rainbow-green/20' : 'bg-rainbow-red/10 text-rainbow-red border border-rainbow-red/20'}`}>
                      {status.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
                      {status.text}
                    </div>
                  )}

                  <div className="max-w-2xl space-y-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Display Name</label>
                        <input 
                          type="text"
                          disabled={!isEditing}
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-blue focus:bg-white outline-none transition-all font-black text-brand-dark text-base disabled:opacity-50"
                          placeholder="Your public name"
                        />
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Public Bio</label>
                        <textarea 
                          disabled={!isEditing}
                          value={editBio}
                          onChange={e => setEditBio(e.target.value)}
                          rows={4}
                          className="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-rainbow-blue focus:bg-white outline-none transition-all font-medium text-slate-600 text-sm leading-relaxed disabled:opacity-50 resize-none"
                          placeholder="Share your story with the community..."
                        />
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest pl-1">Keep it personal, meaningful, and inclusive.</p>
                     </div>

                     {isEditing && (
                       <button 
                         onClick={handleUpdateProfile}
                         disabled={saving}
                        className="px-10 py-4 bg-brand-dark text-white rounded-2xl font-black text-base shadow-2xl shadow-brand-dark/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
                       >
                         {saving ? 'Updating...' : <><Save size={18} /> Save My Identity</>}
                       </button>
                     )}
                  </div>

                  <div className="mt-16 pt-12 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-rainbow-blue">
                           <Clock size={24} />
                        </div>
                        <div>
                           <p className="font-black text-brand-dark text-base leading-tight">Member Security</p>
                           <p className="text-xs font-bold text-slate-400">{user.email}</p>
                        </div>
                     </div>
                     <button className="px-6 py-2.5 bg-rainbow-red/5 text-rainbow-red rounded-xl text-xs font-black hover:bg-rainbow-red hover:text-white transition-all">
                        Delete Account
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
