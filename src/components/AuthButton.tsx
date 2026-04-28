import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { useAuth } from '../lib/AuthContext';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

export default function AuthButton() {
  const { user, loading } = useAuth();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) return <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />;

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-bold text-brand-dark">{user.displayName}</span>
          <span className="text-xs text-slate-500">Member</span>
        </div>
        <button 
          onClick={handleLogout}
          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:text-rainbow-red transition-colors group"
          title="Logout"
        >
          <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleLogin}
      className="bg-brand-dark text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
    >
      <LogIn size={18} />
      <span>Join Us</span>
    </button>
  );
}
