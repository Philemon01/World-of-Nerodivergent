import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Settings } from 'lucide-react';
import AuthButton from './AuthButton';
import { useAuth } from '../lib/AuthContext';
import AdminDashboard from './AdminDashboard';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const { isAdmin } = useAuth();

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
    { name: 'Books', href: '#books' },
    { name: 'Blog', href: '#blog' },
  ];

  return (
    <>
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
              
              {isAdmin && (
                <button 
                  onClick={() => setIsAdminPanelOpen(true)}
                  className="flex items-center gap-2 text-rainbow-blue font-black hover:text-rainbow-orange transition-colors"
                >
                  <Settings size={18} />
                  Admin Panel
                </button>
              )}

              <AuthButton />
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
                  
                  {isAdmin && (
                    <button 
                      onClick={() => {
                        setIsAdminPanelOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-2xl font-black text-rainbow-blue flex items-center gap-2"
                    >
                      <Settings size={22} />
                      Dashboard
                    </button>
                  )}

                  <div className="pt-4 border-t border-slate-100">
                    <AuthButton />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      <AdminDashboard isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
    </>
  );
}
