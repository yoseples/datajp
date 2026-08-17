import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  Sparkles,
  KeyRound,
  Code2,
  ShieldAlert,
  User
} from 'lucide-react';
import logoJarrakpos from '../assets/logo-jarrakpos.png';

export const SYSTEM_ROLES = {
  DEVELOPER: 'Developer',
  ADMIN: 'Admin',
  WARTAWAN: 'Wartawan'
};

const PRESET_ACCOUNTS = [
  {
    role: SYSTEM_ROLES.DEVELOPER,
    roleTitle: 'Developer (Full Root & Cloud Access)',
    email: 'developer@jarrakpos.com',
    pass: 'dev123',
    name: 'Kang Ocep (Lead Developer)',
    badge: 'Super Developer',
    description: 'Akses penuh ke seluruh sistem, konfigurasi Supabase, dan master data.',
    staffId: 'JP-RED-015'
  },
  {
    role: SYSTEM_ROLES.ADMIN,
    roleTitle: 'Admin (Pimpinan Redaksi & HRD)',
    email: 'admin@jarrakpos.com',
    pass: 'admin123',
    name: 'I Gede Putu Sudiarta, S.H.',
    badge: 'Administrator Redaksi',
    description: 'Akses manajemen seluruh dewan redaksi, tambah/edit anggota, dan cetak massal.',
    staffId: 'JP-RED-001'
  },
  {
    role: SYSTEM_ROLES.WARTAWAN,
    roleTitle: 'Wartawan (Hanya Profil Mandiri)',
    email: 'asep.dpr@jarrakpos.com',
    pass: 'wartawan123',
    name: 'Asep (Wartawan Biro DPR RI)',
    badge: 'Jurnalis / Wartawan',
    description: 'Hanya dapat melihat, mengunduh KTA, dan memperbarui foto/profil miliknya sendiri.',
    staffId: 'JP-RED-028'
  }
];

export default function LoginPage({ onLoginSuccess, allStaff = [] }) {
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
      const inputEmail = email.trim().toLowerCase();

      // 1. Check Developer preset
      if (inputEmail === 'developer@jarrakpos.com' && password === 'dev123') {
        onLoginSuccess({
          email: 'developer@jarrakpos.com',
          name: 'Kang Ocep',
          role: SYSTEM_ROLES.DEVELOPER,
          badge: 'Super Developer',
          staffId: 'JP-RED-015'
        }, rememberMe);
        return;
      }

      // 2. Check Admin preset
      if ((inputEmail === 'admin@jarrakpos.com' || inputEmail === 'dewan.redaksi@jarrakpos.com' || inputEmail === 'pemred@jarrakpos.com') && (password === 'admin123' || password === 'pemred123')) {
        onLoginSuccess({
          email: inputEmail,
          name: 'I Gede Putu Sudiarta, S.H.',
          role: SYSTEM_ROLES.ADMIN,
          badge: 'Administrator Redaksi',
          staffId: 'JP-RED-001'
        }, rememberMe);
        return;
      }

      // 3. Check matched staff by email as Wartawan
      const matchedStaff = allStaff.find(
        s => s.email && s.email.toLowerCase() === inputEmail
      );

      if (matchedStaff) {
        onLoginSuccess({
          email: matchedStaff.email,
          name: matchedStaff.name,
          role: SYSTEM_ROLES.WARTAWAN,
          badge: `${matchedStaff.role} (${matchedStaff.bureau})`,
          staffId: matchedStaff.id
        }, rememberMe);
        return;
      }

      // 4. Fallback: if password is valid
      if (password.length >= 4) {
        onLoginSuccess({
          email: inputEmail,
          name: inputEmail.split('@')[0].toUpperCase(),
          role: SYSTEM_ROLES.WARTAWAN,
          badge: 'Wartawan Mandiri',
          staffId: allStaff[0]?.id || 'JP-RED-028'
        }, rememberMe);
      } else {
        setErrorMsg('Email atau kata sandi tidak valid. Silakan pilih salah satu role akun di bawah.');
        setIsLoading(false);
      }
    }, 500);
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

      {/* Brand Header with Official Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center relative z-10">
        <div className="inline-flex items-center justify-center p-3 rounded-3xl bg-white shadow-2xl shadow-rose-900/40 border-2 border-rose-500/50 mb-4 animate-in zoom-in-90 duration-300 hover:scale-105 transition-transform">
          <img
            src={logoJarrakpos}
            alt="Logo Resmi Jarrakpos.com"
            className="w-24 h-24 object-contain drop-shadow-md"
          />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          JARRAK<span className="text-rose-500">POS</span>.COM
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
          Portal Sistem Bank Data & Database Dewan Redaksi
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-800 text-slate-100">
          
          <div className="mb-6 pb-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Masuk Sesuai Hak Akses</h2>
              <p className="text-xs text-slate-400">Pilih Role: Developer, Admin, atau Wartawan</p>
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
                Email Akun Pers / Staf
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@jarrakpos.com"
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
              <span className="text-slate-500 text-[11px]">3 Role Tersedia</span>
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
                  <span>Masuk ke Sistem</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Login Presets for 3 Roles */}
          <div className="mt-6 pt-5 border-t border-slate-800" id="demo">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Pilih 3 Role Akun Demo (1 Klik):
            </span>

            <div className="space-y-2.5">
              {PRESET_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-rose-500 transition-all flex items-start justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                        acc.role === SYSTEM_ROLES.DEVELOPER 
                          ? 'bg-purple-950 text-purple-300 border-purple-700'
                          : acc.role === SYSTEM_ROLES.ADMIN
                          ? 'bg-rose-950 text-rose-300 border-rose-700'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      }`}>
                        {acc.role}
                      </span>
                      <span className="font-bold text-xs text-white group-hover:text-rose-400 transition-colors truncate">
                        {acc.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                      {acc.description}
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      {acc.email} (pass: {acc.pass})
                    </div>
                  </div>
                  
                  <span className="text-[10px] px-2.5 py-1 rounded-lg font-bold bg-slate-900 text-rose-300 border border-slate-700 shrink-0 self-center">
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
          <span>Sistem Hak Akses Berjenjang Pers Jarrakpos.com</span>
        </div>

      </div>

    </div>
  );
}
