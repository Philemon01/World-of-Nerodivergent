import { motion } from 'motion/react';

export default function Founder() {
  return (
    <section id="founder" className="py-12 bg-brand-dark text-white overflow-hidden relative">
      {/* Decorative gradient background blobls */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rainbow-violet/10 rounded-full blur-[100px] -z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rainbow-blue/10 rounded-full blur-[100px] -z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative p-1 rounded-[2rem] bg-rainbow-gradient">
              <div className="aspect-square rounded-[1.8rem] overflow-hidden bg-brand-dark">
                <img 
                  src="/founder.png" 
                  alt="Gauri Thakkar"
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            
            <motion.div 
              initial={{ rotate: 12, scale: 0.5 }}
              whileInView={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-1"
            >
              <div className="w-full h-full rounded-[1.2rem] bg-rainbow-gradient flex items-center justify-center text-xl">
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
            <span className="text-rainbow-orange font-bold tracking-widest uppercase text-[10px] mb-3 block">The Founder's Journey</span>
            <h2 className="text-2xl md:text-3xl font-black mb-5 leading-tight">
              Gauri Thakkar's <br />
              <span className="text-rainbow-gradient">Vision of Hope.</span>
            </h2>
            <div className="space-y-5 text-base text-slate-300 leading-relaxed font-light">
              <p>
                My name is <span className="text-white font-bold underline decoration-rainbow-yellow decoration-3 underline-offset-4">Gauri Thakkar</span>, and I believe every mind is a universe of color.
              </p>
              <p>
                As I balanced my professional life with supporting my family's unique needs, I realized that neurodiversity isn't a deficit to be fixed—it's a different way of experiencing the world's beauty.
              </p>
              <p>
                "World of Neurodivergent" is my commitment to turning that beauty into a professional platform for advocacy, education, and resources that celebrate the entire spectrum.
              </p>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-white/5 border-l-4 border-rainbow-gradient text-slate-100 font-medium italic text-base leading-relaxed relative">
              <div className="absolute -top-3 -left-1.5 w-6 h-6 rounded-full bg-rainbow-gradient" />
              "We don't need to fix neurodivergent minds; we need to fix the world's understanding of the vibrant spectrum of human thought."
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
