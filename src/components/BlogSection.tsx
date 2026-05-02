import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Post, getPublishedPosts } from '../lib/services';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Search, Filter, X, Newspaper } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  'Tips': 'bg-rainbow-green/10 text-rainbow-green',
  'Stories': 'bg-rainbow-blue/10 text-rainbow-blue',
  'Advocacy': 'bg-rainbow-red/10 text-rainbow-red',
  'General': 'bg-slate-100 text-slate-500',
};

export default function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      // Limit to 3 for the home page view matching the image
      const data = await getPublishedPosts(3);
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section id="blog" className="py-24 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-slate-50 h-96 rounded-[3rem]" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 text-center md:text-left">
          <div className="max-w-2xl">
            <span className="text-rainbow-orange font-black tracking-[0.2em] uppercase text-xs mb-4 block">Advocacy & Updates</span>
            <h2 className="text-4xl md:text-6xl font-black text-brand-dark mb-6 leading-tight">Latest from the <span className="text-rainbow-blue">Community.</span></h2>
            <p className="text-slate-600 text-xl font-medium">
              Stay informed with our latest research, personal stories, and educational strategies to support neurodivergent individuals.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 font-black text-xs text-brand-dark hover:text-rainbow-blue transition-colors group tracking-widest uppercase">
            View All Posts <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col group"
            >
              <Link to={`/blog/${post.slug}`} className="rounded-[2.5rem] overflow-hidden aspect-[16/10] mb-6">
                <img 
                  src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </Link>
              
              <div className="flex flex-col gap-3">
                <div>
                   <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${CATEGORY_COLORS[post.category || 'General'] || CATEGORY_COLORS['General']}`}>
                     {post.category || 'Tips'}
                   </span>
                </div>
                <Link to={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-black text-brand-dark mb-2 leading-tight group-hover:text-rainbow-blue transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-sm font-medium text-slate-500 line-clamp-3 leading-relaxed">
                  {post.excerpt || 'Empowering insights and community stories shared for neurodivergent minds and their champions.'}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
