import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuth } from '../lib/AuthContext';
import { LogIn, User, LogOut, LayoutDashboard, ChevronDown, Chrome, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AuthButton() {
  const { user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setIsOpen(false);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 p-1 px-3 bg-white rounded-full border border-slate-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-rainbow-gradient flex items-center justify-center text-white border-2 border-white shadow-sm">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User size={16} />
            )}
          </div>
          <span className="text-sm font-black text-brand-dark hidden sm:block max-w-[100px] truncate">
            {user.displayName?.split(' ')[0] || 'Member'}
          </span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] shadow-2xl shadow-brand-dark/10 border border-slate-100 p-6 z-[60]"
            >
              <div className="mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account</p>
                <p className="text-brand-dark font-black truncate">{user.email}</p>
              </div>

              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 p-3 text-slate-600 hover:text-rainbow-blue font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  <User size={18} />
                  My Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center gap-3 p-3 text-slate-600 hover:text-rainbow-blue font-bold rounded-xl hover:bg-slate-50 transition-all"
                  >
                    <LayoutDashboard size={18} />
                    Admin Portal
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 text-rainbow-red hover:bg-rainbow-red/5 font-bold rounded-xl transition-all border border-transparent hover:border-rainbow-red/20"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-8 py-3 bg-brand-dark text-white rounded-full font-black text-sm shadow-xl shadow-brand-dark/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
      >
        Sign In <LogIn size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-72 bg-white rounded-[2.5rem] shadow-2xl shadow-brand-dark/10 border border-slate-100 p-8 z-[60]"
          >
            <h3 className="text-xl font-black text-brand-dark mb-6 leading-tight">Welcome to the Community</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 p-4 bg-slate-50 text-brand-dark font-black rounded-2xl hover:bg-slate-100 transition-all group"
              >
                <Chrome size={20} className="text-rainbow-blue group-hover:scale-110 transition-transform" />
                Google Sign In
              </button>

              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-3 p-4 border-2 border-slate-100 text-brand-dark font-black rounded-2xl hover:bg-slate-50 transition-all"
              >
                <LogIn size={20} className="text-slate-400" />
                Email Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-3 p-4 bg-brand-dark text-white font-black rounded-2xl hover:scale-105 transition-all shadow-lg shadow-brand-dark/20"
              >
                <UserPlus size={20} />
                Create Account
              </Link>
            </div>

            <p className="mt-6 text-[10px] text-slate-400 font-bold text-center leading-relaxed">
              By signing in, you agree to our <br/>
              <span className="text-slate-600">Terms of Service</span> and <span className="text-slate-600">Privacy Policy</span>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
