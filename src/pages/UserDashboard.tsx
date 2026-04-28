import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { getUserPurchases, getBookById, Book, Purchase } from '../lib/services';
import { Book as BookIcon, Download, ShoppingBag, ArrowRight, User, Settings, LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [purchasedBooks, setPurchasedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchPurchases = async () => {
      const purchases = await getUserPurchases(user.uid);
      const bookIds = purchases
        .filter(p => p.itemType === 'book')
        .map(p => p.itemId);
      
      const bookPromises = bookIds.map(id => getBookById(id));
      const books = await Promise.all(bookPromises);
      setPurchasedBooks(books.filter((b): b is Book => b !== null));
      setLoading(false);
    };

    fetchPurchases();
  }, [user, navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
              <div className="w-24 h-24 bg-rainbow-gradient rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>
              <h2 className="text-xl font-black text-brand-dark mb-1">{user.displayName || 'Friend'}</h2>
              <p className="text-sm text-slate-500 font-bold mb-6 truncate">{user.email}</p>
              
              <div className="space-y-2">
                <button className="w-full py-3 rounded-xl bg-slate-50 text-brand-dark font-bold flex items-center gap-3 px-4 hover:bg-rainbow-blue hover:text-white transition-all group">
                  <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                  My Purchases
                </button>
                <button className="w-full py-3 rounded-xl bg-transparent text-slate-400 font-bold flex items-center gap-3 px-4 hover:text-brand-dark transition-all group">
                  <Settings size={18} />
                  Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl bg-transparent text-rainbow-red font-bold flex items-center gap-3 px-4 hover:bg-rainbow-red/5 transition-all group"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>

            <div className="bg-rainbow-blue p-8 rounded-[2.5rem] text-white shadow-lg shadow-rainbow-blue/20">
              <h3 className="text-lg font-black mb-4 leading-tight">Need help with your order?</h3>
              <p className="text-white/80 text-sm font-medium mb-6">Our support team is here to help you with any download or access issues.</p>
              <button className="w-full py-3 bg-white text-rainbow-blue rounded-xl font-black text-sm hover:scale-105 transition-all">
                Contact Support
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-brand-dark mb-4">My Library</h1>
              <p className="text-slate-600 font-medium max-w-2xl">
                Manage all your purchased books and resources. Download your content anytime from your dashboard.
              </p>
            </header>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
                {[1, 2].map(i => (
                  <div key={i} className="h-64 bg-slate-200 rounded-[2.5rem]" />
                ))}
              </div>
            ) : purchasedBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {purchasedBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex gap-6"
                  >
                    <div className="w-32 h-44 shrink-0 rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-slate-50">
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col justify-between py-2">
                       <div>
                         <h3 className="text-xl font-black text-brand-dark mb-2 leading-tight group-hover:text-rainbow-blue transition-colors">
                           {book.title}
                         </h3>
                         <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <BookIcon size={12} /> Digital Copy
                         </div>
                       </div>

                       <div className="space-y-2">
                         <button 
                           className="w-full bg-brand-dark text-white px-6 py-3 rounded-xl font-black text-sm shadow-lg shadow-brand-dark/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                         >
                           Download PDF <Download size={16} />
                         </button>
                         <button className="w-full py-2 text-slate-400 font-bold text-xs hover:text-rainbow-blue transition-colors flex items-center justify-center gap-1">
                           View Details <ArrowRight size={14} />
                         </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[3rem] border border-slate-100 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag size={40} />
                </div>
                <h3 className="text-2xl font-black text-brand-dark mb-4">No purchases yet</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto font-medium">
                  You haven't bought any books or exclusive resources yet. Head over to our shop to explore our curated collection.
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="bg-rainbow-blue text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-rainbow-blue/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Explore Shop
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
