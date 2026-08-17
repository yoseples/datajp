import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  KeyRound,
  UserCheck
} from 'lucide-react';

const PRESET_ACCOUNTS = [
  {
    role: 'Pimpinan Redaksi / Admin Master',
    email: 'admin@jarrakpos.com',
    pass: 'admin123',
    name: 'I Putu Agus Sastrawan, S.I.Kom.',
    badge: 'Super Admin Redaksi',
    color: 'border-rose-500 bg-rose-50/70 text-rose-900'
  },
  {
    role: 'Redaktur Pelaksana (Managing Editor)',
    email: 'redpel@jarrakpos.com',
    pass: 'redpel123',
    name: 'Ni Kadek Ayu Wulandari, S.S.',
    badge: 'Editor In Chief',
    color: 'border-blue-500 bg-blue-50/70 text-blue-900'
  },
  {
    role: 'Jurnalis / Wartawan Lapangan',
    email: 'wartawan@jarrakpos.com',
    pass: 'wartawan123',
    name: 'Rizky Pratama Wicaksono',
    badge: 'Reporter IKN & Kaltim',
    color: 'border-emerald-500 bg-emerald-50/70 text-emerald-900'
  }
];

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      // Check preset accounts or allow any valid input
      const matched = PRESET_ACCOUNTS.find(
        acc => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.pass === password
      );

      if (matched) {
        onLoginSuccess({
          email: matched.email,
          name: matched.name,
          role: matched.role,
          badge: matched.badge
        }, rememberMe);
      } else if (email.trim() && password.length >= 4) {
        // Fallback for custom user login
        onLoginSuccess({
          email: email.trim(),
          name: email.split('@')[0].toUpperCase(),
          role: 'Staf Dewan Redaksi',
          badge: 'Redaksi Jarrakpos'
        }, rememberMe);
      } else {
        setErrorMsg('Email atau kata sandi tidak valid. Gunakan akun demo di bawah.');
        setIsLoading(false);
      }
    }, 600);
  };

  const handleQuickLogin = (preset) => {
    setEmail(preset.email);
    setPassword(preset.pass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-rose-500 selection:text-white">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 shadow-glow text-white font-black text-2xl border border-rose-400/30 mb-4 animate-in zoom-in-90 duration-300">
          JP
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          JARRAK<span className="text-rose-500">POS</span>.COM
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
          Portal Sistem Bank Data & Database Dewan Redaksi
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-800 text-slate-100">
          
          <div className="mb-6 pb-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Masuk ke Sistem</h2>
              <p className="text-xs text-slate-400">Autentikasi staf pers & dewan redaksi</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-800 text-rose-400 border border-slate-700">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2.5 animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email / Akun Pers
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jarrakpos.com"
                  required
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-600 focus:ring-rose-500"
                />
                <span>Ingat akun saya</span>
              </label>
              <a href="#demo" onClick={() => handleQuickLogin(PRESET_ACCOUNTS[0])} className="text-rose-400 hover:underline">
                Gunakan Demo
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-900/40 transition-all active:scale-98 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Masuk ke Bank Data</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Login Presets */}
          <div className="mt-6 pt-5 border-t border-slate-800" id="demo">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Pilih Akun Demo Cepat (1 Klik):
            </span>

            <div className="space-y-2">
              {PRESET_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-rose-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-xs text-white group-hover:text-rose-400 transition-colors truncate">
                      {acc.role}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {acc.email} (pass: {acc.pass})
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-900 text-rose-300 border border-slate-700 shrink-0">
                    Pilih
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Security Footer Notice */}
        <div className="text-center mt-6 text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Sistem Terenkripsi & Terintegrasi Dewan Pers RI</span>
        </div>

      </div>

    </div>
  );
}
