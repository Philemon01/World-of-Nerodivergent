import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { UserPlus, Mail, Lock, User, Chrome, ArrowRight, AlertCircle } from 'lucide-react';
import { syncUserProfile } from '../lib/services';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await syncUserProfile(userCredential.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncUserProfile(result.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign-up failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-brand-dark mb-3">Join Us</h1>
          <p className="text-slate-500 font-medium">Create an account to join the neurodivergent community.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rainbow-red/10 border border-rainbow-red/20 text-rainbow-red rounded-2xl flex items-center gap-3 text-sm font-bold">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <button 
            onClick={handleGoogleLogin}
            className="w-full py-4 px-6 rounded-2xl border-2 border-slate-100 flex items-center justify-center gap-3 font-black text-brand-dark hover:bg-slate-50 transition-all active:scale-95"
          >
            <Chrome size={20} className="text-rainbow-orange" />
            Sign up with Google
          </button>
        </div>

        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <span className="relative px-4 bg-white text-xs font-black text-slate-300 uppercase tracking-widest">Or create account</span>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-rainbow-orange focus:bg-white outline-none transition-all font-medium"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-rainbow-orange focus:bg-white outline-none transition-all font-medium"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-rainbow-orange focus:bg-white outline-none transition-all font-medium"
                placeholder="Min 6 characters"
                minLength={6}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-dark/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-8"
          >
            {loading ? 'Creating Account...' : <>Sign Up Now <UserPlus size={20} /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-bold">
          Already have an account? <Link to="/login" className="text-rainbow-orange hover:underline">Log in here</Link>
        </p>
      </motion.div>
    </div>
  );
}
