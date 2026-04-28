import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Post, getPostBySlug } from '../lib/services';
import { Calendar, ArrowLeft, Share2, Clock, User } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPost = async () => {
      if (slug) {
        const data = await getPostBySlug(slug);
        setPost(data);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 flex flex-col items-center">
        <div className="w-full max-w-3xl px-6 space-y-6 animate-pulse">
           <div className="h-4 w-24 bg-slate-100 rounded-full"></div>
           <div className="h-12 w-full bg-slate-100 rounded-2xl"></div>
           <div className="aspect-video w-full bg-slate-50 rounded-[2.5rem]"></div>
           <div className="space-y-3">
             <div className="h-4 w-full bg-slate-50 rounded-full"></div>
             <div className="h-4 w-5/6 bg-slate-50 rounded-full"></div>
             <div className="h-4 w-4/6 bg-slate-50 rounded-full"></div>
           </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white pt-48 text-center px-6">
        <h1 className="text-4xl font-black text-brand-dark mb-4">Post Not Found</h1>
        <p className="text-slate-600 mb-8">The article you're looking for might have been moved or unpublished.</p>
        <Link to="/" className="text-rainbow-blue font-bold flex items-center justify-center gap-2">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <motion.article 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white pt-32 pb-24"
    >
      <div className="container mx-auto px-6 max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-rainbow-blue font-bold transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Insights
        </Link>

        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-6 mb-6 text-sm font-bold text-slate-400">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full text-rainbow-blue">
              {post.category}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {post.createdAt?.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              {Math.ceil(post.content.length / 1000)} min read
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-brand-dark leading-[1.1] mb-8">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rainbow-gradient rounded-full flex items-center justify-center text-white">
                <User size={24} />
              </div>
              <div>
                <div className="font-bold text-brand-dark">World of Neurodivergent</div>
                <div className="text-sm text-slate-500 underline decoration-rainbow-blue decoration-2">Editorial Team</div>
              </div>
            </div>
            <button className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rainbow-blue transition-all">
              <Share2 size={20} />
            </button>
          </div>
        </header>

        {post.coverImage && (
          <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl mb-16 border-4 border-white">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <div className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:text-brand-dark prose-p:text-slate-700 prose-p:leading-relaxed prose-strong:text-brand-dark prose-a:text-rainbow-blue prose-img:rounded-[2rem] markdown-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <footer className="mt-24 p-12 rounded-[3rem] bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold text-brand-dark mb-4">Did you find this helpful?</h3>
          <p className="text-slate-600 mb-8 max-w-lg">
            Our mission is to provide quality information to the neurodivergent community. Share this post if you think it could help someone else.
          </p>
          <div className="flex gap-4">
             <button className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-all">
               Share Insight
             </button>
             <Link to="/" className="bg-white border border-slate-200 text-brand-dark px-8 py-3 rounded-full font-bold shadow-sm active:scale-95 transition-all">
               More Articles
             </Link>
          </div>
        </footer>
      </div>
    </motion.article>
  );
}
