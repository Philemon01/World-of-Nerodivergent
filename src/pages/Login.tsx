import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { LogIn, Mail, Lock, Chrome, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setIsResetting(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
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
          <h1 className="text-4xl font-black text-brand-dark mb-3">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Continue your journey with the community.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rainbow-red/10 border border-rainbow-red/20 text-rainbow-red rounded-2xl flex items-center gap-3 text-sm font-bold">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {resetSent && (
          <div className="mb-6 p-4 bg-rainbow-green/10 border border-rainbow-green/20 text-rainbow-green rounded-2xl flex items-center gap-3 text-sm font-bold">
            <CheckCircle size={18} />
            Password reset email sent! Please check your inbox.
          </div>
        )}

        {!isResetting ? (
          <>
            <div className="space-y-4 mb-8">
              <button 
                onClick={handleGoogleLogin}
                className="w-full py-4 px-6 rounded-2xl border-2 border-slate-100 flex items-center justify-center gap-3 font-black text-brand-dark hover:bg-slate-50 transition-all active:scale-95"
              >
                <Chrome size={20} className="text-rainbow-blue" />
                Continue with Google
              </button>
            </div>

            <div className="relative mb-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative px-4 bg-white text-xs font-black text-slate-300 uppercase tracking-widest">Or with email</span>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-rainbow-blue focus:bg-white outline-none transition-all font-medium"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                  <button 
                    type="button"
                    onClick={() => setIsResetting(true)}
                    className="text-[10px] font-black text-rainbow-blue uppercase italic"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-rainbow-blue focus:bg-white outline-none transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-dark/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-8"
              >
                {loading ? 'Signing in...' : <>Sign In <LogIn size={20} /></>}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-rainbow-blue focus:bg-white outline-none transition-all font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                className="w-full py-4 bg-rainbow-blue text-white rounded-2xl font-black shadow-lg shadow-rainbow-blue/20 hover:scale-105 transition-all"
              >
                Send Reset Link
              </button>
              <button 
                type="button"
                onClick={() => setIsResetting(false)}
                className="text-sm font-bold text-slate-400 hover:text-brand-dark transition-colors"
              >
                Go back to login
              </button>
            </div>
          </form>
        )}

        <p className="text-center mt-8 text-slate-500 font-bold">
          Don't have an account? <Link to="/signup" className="text-rainbow-blue hover:underline">Sign up for free</Link>
        </p>
      </motion.div>
    </div>
  );
}
