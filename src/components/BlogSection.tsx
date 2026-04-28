import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Post, getPublishedPosts } from '../lib/services';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';

export default function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPublishedPosts(3);
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section id="blog" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
           <div className="h-10 w-64 bg-slate-200 rounded-full mb-12 animate-pulse mx-auto"></div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-96 bg-white rounded-3xl animate-pulse shadow-sm"></div>
             ))}
           </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section id="blog" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto py-20">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-rainbow-blue mx-auto mb-8 shadow-sm">
                <Newspaper size={40} />
             </div>
             <h2 className="text-3xl font-bold text-brand-dark mb-4">Insights & Community News</h2>
             <p className="text-lg text-slate-600 mb-8">
               Our blog is where we'll share advocacy updates, education tips, and success stories. We are currently preparing our first set of articles!
             </p>
             <button className="text-rainbow-blue font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all">
               Subscribe for Updates <ArrowRight size={20} />
             </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-rainbow-orange font-bold tracking-widest uppercase text-sm mb-4 block">Advocacy & Updates</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6">Latest from the Community</h2>
            <p className="text-slate-600 text-lg">
              Stay informed with our latest research, personal stories, and educational strategies to support neurodivergent individuals.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 font-bold text-brand-dark hover:text-rainbow-blue transition-colors group">
            View All Posts <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                  <Calendar size={16} />
                  <span>{post.createdAt.toLocaleDateString()}</span>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4 line-clamp-2 leading-tight group-hover:text-rainbow-blue transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-auto">
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 font-bold text-brand-dark hover:text-rainbow-blue transition-colors group/link"
                  >
                    Read Article 
                    <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        
        <button className="md:hidden mt-12 w-full py-4 rounded-2xl bg-white border border-slate-200 font-bold text-brand-dark shadow-sm">
          View All Posts
        </button>
      </div>
    </section>
  );
}
