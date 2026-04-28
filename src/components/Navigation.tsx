import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Principles', href: '#rules' },
    { name: 'Founder', href: '#founder' },
    { name: 'Books', href: '#' },
    { name: 'Resources', href: '#' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none">
      <nav 
        className={`w-full container mx-auto pointer-events-auto transition-all duration-500 rounded-[2rem] border border-white/40 shadow-xl overflow-hidden relative ${
          isScrolled ? 'bg-white/80 backdrop-blur-xl py-3 shadow-rainbow-blue/5' : 'bg-white/60 backdrop-blur-md py-4'
        }`}
      >
        <div className="px-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-rainbow-gradient rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-rainbow-blue/20 group-hover:rotate-12 transition-transform duration-300">
              W
            </div>
            <span className="font-bold text-xl tracking-tight text-brand-dark hidden sm:block">
              World of <span className="text-rainbow-gradient opacity-80 group-hover:opacity-100 transition-opacity">Neurodivergent</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-slate-600 hover:text-rainbow-gradient font-bold transition-all neuro-focus-ring px-2 py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rainbow-gradient group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <button className="bg-brand-dark text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all duration-300 neuro-focus-ring active:scale-95">
              Join Now
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-brand-dark w-10 h-10 flex items-center justify-center rounded-full bg-white/50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/90 backdrop-blur-lg overflow-hidden"
            >
              <div className="px-8 py-10 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    className="text-2xl font-bold text-slate-700 hover:text-rainbow-gradient transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <button className="bg-brand-dark text-white w-full py-4 rounded-2xl font-bold text-lg shadow-lg">
                  Join Community
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
