import React, { useState, useMemo } from 'react';
import { X, Lock, Loader2, AlertCircle, Database, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types';
import { AuthService } from '../services/authService';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, users, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we actually have user data from the spreadsheet
  const isDatabaseReady = useMemo(() => users.length > 0, [users]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDatabaseReady) {
      setError("System database is currently offline. Please sync in settings.");
      return;
    }

    setError(null);
    setIsLoggingIn(true);

    try {
      // Premium feel delay
      await new Promise(r => setTimeout(r, 1200));
      
      const user = await AuthService.login(email, password, users);
      
      if (user) {
        onLoginSuccess(user);
      } else {
        setError("Invalid credentials. Please verify your Email/Key.");
      }
    } catch (err) {
      setError("Authentication server error.");
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-[320px] bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white/10">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-white bg-white/5 rounded-lg transition-all"
        >
          <X size={16} />
        </button>
        
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          <div className="text-center space-y-3">
            <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-cyan-400 mx-auto border border-white/10 shadow-xl">
              <Lock size={20} />
            </div>
            <h2 className="text-lg font-black text-white tracking-tight uppercase">Sign In</h2>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 animate-in slide-in-from-top-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <p className="text-[8px] font-black uppercase tracking-widest leading-tight">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com" 
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all font-bold text-[10px] text-white placeholder:text-white/20" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all font-bold text-[10px] text-white placeholder:text-white/20" 
              />
            </div>
          </div>

          <button 
            disabled={isLoggingIn || !isDatabaseReady}
            type="submit" 
            className="w-full py-3 bg-cyan-400 text-slate-950 rounded-lg font-black text-[9px] hover:bg-cyan-300 shadow-lg shadow-cyan-400/10 uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-30 active:scale-95"
          >
            {isLoggingIn ? <Loader2 size={14} className="animate-spin" /> : "Verify Access"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInModal;