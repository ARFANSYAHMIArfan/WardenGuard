/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LogIn, ShieldCheck, Lock, Mail, Key, User as UserIcon, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';

export const Login: React.FC = () => {
  const { signIn, signInEmail, signUpEmail, loading, user, isWarden, ensureWardenSession } = useAuth();
  const [mode, setMode] = useState<'options' | 'login' | 'signup'>('options');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const handleLocalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAuthLoading(true);
    try {
      if (mode === 'login') {
        await signInEmail(email, password);
      } else {
        await signUpEmail(email, password, name);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-red-500/5 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center gap-6">
          <motion.div 
            layoutId="logo"
            className="w-20 h-20 rounded-3xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20 shadow-lg shadow-teal-500/10 rotate-3"
          >
             <ShieldCheck size={40} />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase italic">WardenGuard</h1>
            <p className="text-slate-400 text-sm font-medium">Asrama Monitoring & Discipline System</p>
          </div>

          <div className="w-full h-px bg-slate-800" />

          <AnimatePresence mode="wait">
            {user && !isWarden ? (
              <motion.div 
                key="denied"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 w-full"
              >
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400">
                  <Lock size={20} />
                  <p className="text-xs font-semibold text-left">Access Denied: Your account is not authorized as a warden.</p>
                </div>
                <p className="text-slate-500 text-xs italic">For demo purposes, you can authorize yourself below.</p>
                <button
                  onClick={ensureWardenSession}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all"
                >
                  Authorize My Account
                </button>
              </motion.div>
            ) : mode === 'options' ? (
              <motion.div 
                key="options"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 w-full"
              >
                <button
                  disabled={loading}
                  onClick={signIn}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                  Sign in with Google
                </button>
                
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>

                <button
                  onClick={() => setMode('login')}
                  className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-teal-500/20"
                >
                  Login with Warden ID
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-teal-400 transition-colors"
                >
                  Create Local Account
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLocalSubmit}
                className="space-y-4 w-full"
              >
                <div className="flex items-center gap-2 mb-2">
                  <button 
                    type="button"
                    onClick={() => setMode('options')}
                    className="p-1 text-slate-500 hover:text-white"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {mode === 'login' ? 'Warden Login' : 'Register Account'}
                  </span>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase text-left">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  {mode === 'signup' && (
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        type="text" 
                        placeholder="Full Name"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="password" 
                      placeholder="Security Password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-2xl font-bold transition-all shadow-xl shadow-teal-500/20 disabled:opacity-50"
                >
                  {authLoading ? 'Verifying...' : mode === 'login' ? 'Authorize Login' : 'Complete Setup'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-4">
             <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
             System Online & Secure
          </div>
        </div>
      </motion.div>
    </div>
  );
};
