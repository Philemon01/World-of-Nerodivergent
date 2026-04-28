import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative py-24 lg:py-36 overflow-hidden bg-white">
      <div className="container mx-auto px-6 relative z-10 pt-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-sm font-bold text-slate-500 mb-8 shadow-sm">
                <Sparkles size={16} className="text-rainbow-orange animate-pulse" />
                <span>Celebrating Neurodiversity Together</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tight text-brand-dark mb-8 leading-[1.05]">
                Every Mind <br />
                <span className="text-rainbow-gradient">Is A World.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 mb-10 leading-relaxed font-medium">
                A vibrant safe haven celebrating the entire neurodivergent spectrum. From dyslexia and autism to dyscalculia and beyond, we empower every unique mind to shine.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <button className="bg-brand-dark text-white px-10 py-5 rounded-[2rem] font-bold text-xl hover:bg-rainbow-orange hover:shadow-orange-200/50 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 neuro-focus-ring">
                  Join Community
                  <ArrowRight size={24} />
                </button>
                <button className="bg-white text-brand-dark border-2 border-slate-100 px-10 py-5 rounded-[2rem] font-bold text-xl hover:border-rainbow-yellow hover:text-rainbow-orange transition-all duration-300 neuro-focus-ring">
                  Read Our Books
                </button>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="relative rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-white group"
            >
              <img 
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200" 
                alt="Diverse happy children laughing and playing together outdoors"
                className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Rainbow Blobs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rainbow-yellow/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rainbow-blue/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
