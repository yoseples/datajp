import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  KeyRound, 
  Code2, 
  ShieldAlert
} from 'lucide-react';
import { 
  getStoredCredentials, 
  authenticateUser, 
  SYSTEM_ROLES 
} from '../utils/authCredentials';
import logoJarrakpos from '../assets/logo-jarrakpos.png';

export { SYSTEM_ROLES };

export default function LoginPage({ onLoginSuccess, allStaff = [] }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState(getStoredCredentials);

  useEffect(() => {
    setCredentials(getStoredCredentials());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const authResult = authenticateUser(identifier, password, allStaff);

      if (authResult) {
        onLoginSuccess(authResult, rememberMe);
      } else {
        setErrorMsg('Username / email atau kata sandi tidak valid. Silakan periksa kembali kredensial Anda.');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickLogin = (roleKey) => {
    const cred = credentials[roleKey];
    if (cred) {
      setIdentifier(cred.username);
      setPassword(cred.password);
      setErrorMsg('');
      setIsLoading(true);
      setTimeout(() => {
        const authResult = authenticateUser(cred.username, cred.password, allStaff);
        if (authResult) {
          onLoginSuccess(authResult, true);
        } else {
          setIsLoading(false);
        }
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-rose-500 selection:text-white">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-rose-600/15 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-red-600/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none"></div>

      {/* Top Brand Header */}
      <div className="max-w-md mx-auto w-full text-center relative z-10 pt-2 sm:pt-4">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-1.5 shadow-2xl border-2 border-rose-500/50 mb-3 animate-in zoom-in-75">
          <img src={logoJarrakpos} alt="Jarrakpos" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
          JARRAK<span className="text-rose-500">POS</span>.COM
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Sistem Database Dewan Redaksi &amp; Bank Data Karyawan
        </p>
      </div>

      {/* Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-4 sm:py-6 relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
          
          <div className="mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-rose-500" />
              <span>Masuk ke Sistem</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Gunakan username atau email terdaftar untuk mengakses database redaksi.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username or Email Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-rose-400" />
                <span>Username atau Email</span>
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="developer / admin / pewarta"
                required
                className="w-full bg-slate-950/80 border border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 transition-all font-mono"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Password / Kata Sandi</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-2xl pl-4 pr-11 py-3 text-sm text-white placeholder-slate-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-700 bg-slate-950 text-rose-600 focus:ring-rose-500"
                />
                <span>Ingat Akun Saya</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <span>Masuk ke Database</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Quick Login Section */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5 text-center">
              Pilihan Login 1-Klik (Demo Cepat):
            </span>

            <div className="space-y-2">
              
              {/* Developer Option */}
              <button
                type="button"
                onClick={() => handleQuickLogin('developer')}
                className="w-full text-left p-2.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-950/80 text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-800/60 shrink-0">
                    DEV
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-purple-300 truncate">
                      Developer (Root Access)
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      User: {credentials.developer?.username} | Pass: ••••••••
                    </div>
                  </div>
                </div>
                <span className="text-[10px] bg-purple-950 text-purple-300 font-bold px-2 py-0.5 rounded-lg border border-purple-800 shrink-0">
                  Full Root
                </span>
              </button>

              {/* Admin Option */}
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="w-full text-left p-2.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-950/80 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-800/60 shrink-0">
                    ADM
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-rose-300 truncate">
                      Admin (Pimpinan Redaksi)
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      User: {credentials.admin?.username} | Pass: ••••••••
                    </div>
                  </div>
                </div>
                <span className="text-[10px] bg-rose-950 text-rose-300 font-bold px-2 py-0.5 rounded-lg border border-rose-800 shrink-0">
                  Redaksi
                </span>
              </button>

              {/* Wartawan Option */}
              <button
                type="button"
                onClick={() => handleQuickLogin('wartawan')}
                className="w-full text-left p-2.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-800/60 shrink-0">
                    WAR
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                      Wartawan / Pewarta
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      User: {credentials.wartawan?.username} | Pass: ••••••••
                    </div>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded-lg border border-emerald-800 shrink-0">
                  Self Portal
                </span>
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center text-xs text-slate-500 py-3 relative z-10">
        <p>© {new Date().getFullYear()} JARRAK MEDIA GROUP. All rights reserved.</p>
        <p className="text-[11px] text-slate-600 mt-0.5">Sistem Database Terpadu Jarrakpos</p>
      </div>

    </div>
  );
}
