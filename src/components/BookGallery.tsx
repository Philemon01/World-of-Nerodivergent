import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Book, getPublishedBooks } from '../lib/services';
import { ShoppingCart, ExternalLink, BookOpen, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const CARD_COLORS = [
  'bg-[#FFE5E5]', // Light Pink
  'bg-[#1A1A1A]', // Dark
  'bg-[#E5F1FF]', // Light Blue
  'bg-[#F2FFE5]', // Light Green
];

export default function BookGallery() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await getPublishedBooks();
      setBooks(data);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <section id="books" className="py-16 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-slate-50 h-[400px] rounded-[2rem]" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="books" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <span className="text-rainbow-blue font-black tracking-[0.15em] uppercase text-[9px] mb-2 block">Original Publications</span>
            <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Explore Our Resources</h2>
            <p className="text-slate-600 text-base font-medium">
              Empowering education through professionally authored books and guides specifically designed for neurodivergent minds.
            </p>
          </div>
          <button className="text-rainbow-blue font-black uppercase text-[9px] tracking-widest flex items-center gap-2 group whitespace-nowrap">
            View all resources <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-brand-cream p-4 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all group"
            >
              {/* Illustration Block */}
              <div className={`aspect-[4/5] rounded-[1.25rem] mb-5 overflow-hidden relative flex items-center justify-center ${CARD_COLORS[index % CARD_COLORS.length]}`}>
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text Info */}
              <div className="space-y-3">
                <div>
                   <h3 className="text-xl font-black text-brand-dark mb-0.5 leading-tight group-hover:text-rainbow-blue transition-colors">
                     {book.title}
                   </h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">By {book.author || 'Bloom Team'}</p>
                </div>
                
                <div className="flex items-center justify-between pt-1">
                  <span className="text-lg font-black text-brand-dark">
                    {book.currency || '£'}{book.price}
                  </span>
                  <a 
                    href={book.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-rainbow-blue text-white flex items-center justify-center shadow-lg shadow-rainbow-blue/20 hover:scale-110 active:scale-95 transition-all"
                  >
                    <ShoppingBag size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
