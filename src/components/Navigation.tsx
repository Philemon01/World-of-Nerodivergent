import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LayoutDashboard, ShoppingBag, Search, Settings as SettingsIcon, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthButton from './AuthButton';
import { useAuth } from '../lib/AuthContext';
import AccessibilityPanel from './AccessibilityPanel';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Insights', href: '/#blog' },
    { name: 'Books', href: '/#books' },
    { name: 'Resources', href: '/#resources' },
    { name: 'Principles', href: '/#rules' },
    { name: 'About', href: '/#founder' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin', href: '/admin' });
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black text-brand-dark tracking-tighter flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-rainbow-gradient group-hover:rotate-12 transition-transform shadow-lg" />
          <span>
            World of <span className="text-rainbow-blue">Neurodivergent</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            link.href.startsWith('/#') ? (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-bold text-brand-dark transition-colors hover:text-rainbow-orange"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-bold transition-colors ${link.name === 'Admin' ? 'text-rainbow-blue' : 'text-brand-dark'} hover:text-rainbow-orange`}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        {/* Icons Area */}
        <div className="hidden lg:flex items-center gap-6 text-brand-dark/60">
          <button className="hover:text-brand-dark transition-colors"><Search size={20} /></button>
          <Link to={user ? "/dashboard" : "/login"} className="hover:text-brand-dark transition-colors">
            <User size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <AccessibilityPanel />
            {isAdmin && (
              <Link to="/admin" className="hover:text-brand-dark transition-colors">
                <SettingsIcon size={20} />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-brand-dark p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-slate-50 p-8 flex flex-col gap-6 lg:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-lg font-bold text-brand-dark"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-50 flex flex-col gap-4">
               <AuthButton />
               {isAdmin && (
                 <Link to="/admin" className="flex items-center gap-2 font-bold text-rainbow-blue" onClick={() => setIsMobileMenuOpen(false)}>
                   <LayoutDashboard size={20} /> Admin Panel
                 </Link>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
