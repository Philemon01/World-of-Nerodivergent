import { motion } from 'motion/react';
import { ArrowRight, Play, Rocket } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-cream rounded-[3.5rem] p-8 md:p-16 lg:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12"
        >
          {/* Text Content */}
          <div className="w-full lg:w-1/2 relative z-10">
            <div className="inline-block px-4 py-1.5 bg-rainbow-orange text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-lg shadow-rainbow-orange/20">
              Celebrating Neurodiversity Together
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-brand-dark mb-8 leading-[1.05]">
              Every Mind <br />
              <span className="text-rainbow-blue">Is A World.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-brand-dark/60 mb-12 max-w-2xl leading-relaxed font-medium">
              A vibrant safe haven celebrating the entire neurodivergent spectrum. From dyslexia and autism to dyscalculia and beyond, we empower every unique mind to shine.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <button className="bg-brand-dark text-white px-10 py-5 rounded-3xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-dark/20 flex items-center justify-center gap-3">
                Join Community <Rocket size={24} />
              </button>
              <button className="bg-white text-brand-dark border-2 border-slate-100 px-10 py-5 rounded-3xl font-black text-lg hover:border-rainbow-blue hover:text-rainbow-blue transition-all">
                Read Our Books
              </button>
            </div>
          </div>

          {/* Image Content */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-4 rounded-[2.5rem] shadow-2xl relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200" 
                alt="Joyful illustrative representation" 
                className="w-full rounded-[2rem] aspect-[4/3] object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rainbow-blue/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rainbow-yellow/5 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
        </motion.div>
      </div>
    </section>
  );
}
