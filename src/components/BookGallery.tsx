import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Book, getPublishedBooks } from '../lib/services';
import { ShoppingCart, ExternalLink, BookOpen } from 'lucide-react';

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
      <section id="books" className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-64 bg-slate-100 rounded-full mb-4"></div>
            <div className="h-4 w-96 bg-slate-50 rounded-full mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[3/4] bg-slate-50 rounded-[2rem]"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
       <section id="books" className="py-24 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 p-12 rounded-[3rem] bg-brand-secondary/50 border-2 border-dashed border-brand-primary/20">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm">
              <BookOpen size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-brand-dark mb-4">Books & Resources Coming Soon</h2>
              <p className="text-lg text-slate-600 max-w-xl">
                We are currently crafting high-quality, professional resources and books to support the neurodivergent community. Stay tuned for our original publications!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="books" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-rainbow-blue font-bold tracking-widest uppercase text-sm mb-4 block">Original Publications</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6">Explore Our Resources</h2>
          <p className="text-slate-600 text-lg">
            Empowering education through professionally authored books and guides specifically designed for neurodivergent minds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col group"
            >
              <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl mb-6 group-hover:-translate-y-2 transition-transform duration-500">
                 <img 
                  src={book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                  <span className="text-white font-bold text-xl line-clamp-2">{book.title}</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-brand-dark mb-2 group-hover:text-rainbow-blue transition-colors">
                {book.title}
              </h3>
              <p className="text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                {book.description}
              </p>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-2xl font-black text-brand-dark">
                  {book.currency || '$'}{book.price}
                </span>
                <a 
                  href={book.storeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-rainbow-blue transition-all active:scale-95 shadow-lg shadow-brand-dark/10"
                >
                  <ShoppingCart size={18} />
                  <span>Buy Now</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
