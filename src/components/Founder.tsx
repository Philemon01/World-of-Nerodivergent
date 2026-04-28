import { motion } from 'motion/react';

export default function Founder() {
  return (
    <section id="founder" className="py-24 bg-brand-dark text-white overflow-hidden relative">
      {/* Decorative gradient background blobls */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rainbow-violet/10 rounded-full blur-[100px] -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rainbow-blue/10 rounded-full blur-[100px] -z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative p-2 rounded-[3rem] bg-rainbow-gradient">
              <div className="aspect-square rounded-[2.8rem] overflow-hidden bg-brand-dark">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                  alt="Gauri Thakkar"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            
            <motion.div 
              initial={{ rotate: 12, scale: 0.5 }}
              whileInView={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -bottom-8 -right-8 w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center p-1"
            >
              <div className="w-full h-full rounded-[1.8rem] bg-rainbow-gradient flex items-center justify-center text-3xl">
                ❤️
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <span className="text-rainbow-orange font-bold tracking-widest uppercase text-sm mb-6 block">The Founder's Journey</span>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-10 leading-tight">
              Gauri Thakkar's <br />
              <span className="text-rainbow-gradient">Vision of Hope.</span>
            </h2>
            <div className="space-y-8 text-xl text-slate-300 leading-relaxed font-light">
              <p>
                My name is <span className="text-white font-bold underline decoration-rainbow-yellow decoration-4 underline-offset-4">Gauri Thakkar</span>, and I believe every mind is a universe of color.
              </p>
              <p>
                As I balanced my professional life with supporting my family's unique needs, I realized that neurodiversity isn't a deficit to be fixed—it's a different way of experiencing the world's beauty.
              </p>
              <p>
                "World of Neurodivergent" is my commitment to turning that beauty into a professional platform for advocacy, education, and resources that celebrate the entire spectrum.
              </p>
            </div>
            
            <div className="mt-12 p-8 rounded-3xl bg-white/5 border-l-4 border-rainbow-gradient text-slate-100 font-medium italic text-lg leading-relaxed relative">
              <div className="absolute -top-4 -left-2 w-8 h-8 rounded-full bg-rainbow-gradient" />
              "We don't need to fix neurodivergent minds; we need to fix the world's understanding of the vibrant spectrum of human thought."
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
