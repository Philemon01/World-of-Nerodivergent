import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="footer" className="bg-white pt-12 pb-24 border-t border-slate-50">
      <div className="container mx-auto px-6">
        {/* Newsletter Banner */}
        <div className="bg-brand-dark text-white rounded-[4rem] p-12 md:p-24 mb-24 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rainbow-blue/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight">Join the Circle & <br/><span className="text-rainbow-orange">Spark Change.</span></h2>
            <p className="text-white/50 text-xl font-medium mb-12">
              Monthly research, unique perspectives, and practical tools delivered directly to your neurodivergent inbox.
            </p>
            <button className="px-12 py-5 bg-white text-brand-dark rounded-3xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/5 mx-auto">
              Jump on the List
            </button>
          </div>
        </div>

        {/* Brand Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rainbow-gradient rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                W
              </div>
              <span className="font-black text-2xl tracking-tighter text-brand-dark">
                World of Neurodivergent
              </span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">
              Advocating for neurodiversity through education, research, and community support. Creating a world where every mind belongs.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-slate-300">Quick Links</h4>
            <ul className="space-y-4">
              {['Insights', 'Resources', 'Books', 'Principles', 'Manifesto'].map(item => (
                <li key={item}>
                  <button className="text-slate-500 hover:text-rainbow-blue font-bold transition-colors">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-slate-300">About the Author</h4>
             <div className="bg-slate-50 rounded-3xl p-6">
                <p className="text-sm font-bold text-slate-500 italic leading-relaxed">
                  "The most valuable asset for a nation is its people, and the most valuable people are those who think differently."
                </p>
                <div className="mt-4 flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-brand-dark flex items-center justify-center text-white font-black text-[10px]">GT</div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gauri Thakkar</span>
                </div>
             </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-slate-300">Support</h4>
            <ul className="space-y-4">
              {['Contact Us', 'Be a Contributor', 'Accessibility', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <button className="text-slate-500 hover:text-rainbow-orange font-bold transition-colors">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-slate-50">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
            © {new Date().getFullYear()} World of Neurodivergent. Created by Gauri Thakkar.
          </p>
          
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Accessibility</span>
            <span>Legal</span>
            <span>DMCA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
