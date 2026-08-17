import React from 'react';
import { 
  Globe, 
  Tv, 
  Mic, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Building2,
  LogOut,
  Radio,
  Video
} from 'lucide-react';
import { MEDIA_PLATFORMS } from '../data/mediaPlatforms';
import logoJarrakpos from '../assets/logo-jarrakpos.png';

export default function MediaHubSelector({ 
  currentUser, 
  onSelectPlatform, 
  onLogout,
  platformStaffCounts = {}
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-rose-500 selection:text-white">
      
      {/* Background Ambient Lights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-600/10 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Top Bar with User Info & Logout */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between relative z-10 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-rose-500/50 flex items-center justify-center">
            <img src={logoJarrakpos} alt="Jarrakpos" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1">
              JARRAK<span className="text-rose-500">POS</span> MEDIA GROUP
            </span>
            <p className="text-[11px] text-slate-400">Integrated Multi-Platform News Network</p>
          </div>
        </div>

        {currentUser && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-rose-400 font-semibold uppercase">
                {currentUser.role}
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Keluar dari Akun"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-700 text-xs font-medium transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Selector Content */}
      <div className="max-w-6xl mx-auto w-full my-auto py-10 relative z-10">
        
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-in fade-in zoom-in-95 duration-300">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-950/90 border border-rose-700/80 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Pusat Database Terpadu Media Group
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Pilih Platform Redaksi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Pilih entitas media Jarrakpos yang ingin Anda kelola. Masing-masing platform memiliki susunan dewan redaksi, tim produksi, dan kartu pers resmi tersendiri.
          </p>
        </div>

        {/* 3 Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          
          {/* 1. JARRAKPOS.COM */}
          <div 
            onClick={() => onSelectPlatform('jarrakpos')}
            className="bg-slate-900/90 hover:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-slate-800 hover:border-rose-500 shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-950/90 text-rose-400 border border-rose-700/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-lg">
                  <Globe className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-rose-300 border border-slate-700">
                  {MEDIA_PLATFORMS.JARRAKPOS.badge}
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-black text-white group-hover:text-rose-400 transition-colors">
                JARRAKPOS.COM
              </h2>
              <p className="text-xs font-semibold text-rose-300/90 mt-1">
                {MEDIA_PLATFORMS.JARRAKPOS.title}
              </p>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                {MEDIA_PLATFORMS.JARRAKPOS.description}
              </p>
            </div>

            <div className="mt-6 sm:mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-400">
                <span className="text-white font-extrabold text-sm">{platformStaffCounts.jarrakpos || 50}</span> Anggota Redaksi
              </div>
              
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 group-hover:translate-x-1 transition-transform">
                <span>Buka Portal</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-rose-700"></div>
          </div>

          {/* 2. JARRAKPOSTV */}
          <div 
            onClick={() => onSelectPlatform('jarrakpostv')}
            className="bg-slate-900/90 hover:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-slate-800 hover:border-red-500 shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-950/90 text-red-400 border border-red-700/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all shadow-lg">
                  <Tv className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-red-300 border border-slate-700">
                  {MEDIA_PLATFORMS.JARRAKPOSTV.badge}
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-black text-white group-hover:text-red-400 transition-colors flex items-center gap-2">
                <span>JARRAKPOS TV</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-600/30 border border-red-500/50 text-[9px] font-bold text-red-300 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> Live
                </span>
              </h2>
              <p className="text-xs font-semibold text-red-300/90 mt-1">
                {MEDIA_PLATFORMS.JARRAKPOSTV.title}
              </p>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                {MEDIA_PLATFORMS.JARRAKPOSTV.description}
              </p>
            </div>

            <div className="mt-6 sm:mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-400">
                <span className="text-white font-extrabold text-sm">{platformStaffCounts.jarrakpostv || 6}</span> Tim Redaksi &amp; Siaran
              </div>
              
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 group-hover:translate-x-1 transition-transform">
                <span>Buka Portal</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-rose-700"></div>
          </div>

          {/* 3. JARRAK PODCAST */}
          <div 
            onClick={() => onSelectPlatform('jarrakpodcast')}
            className="bg-slate-900/90 hover:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-slate-800 hover:border-amber-500 shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-amber-950/90 text-amber-400 border border-amber-700/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-lg">
                  <Mic className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-amber-300 border border-slate-700">
                  {MEDIA_PLATFORMS.JARRAKPODCAST.badge}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                JARRAK PODCAST
              </h2>
              <p className="text-xs font-semibold text-amber-300/90 mt-1">
                {MEDIA_PLATFORMS.JARRAKPODCAST.title}
              </p>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                {MEDIA_PLATFORMS.JARRAKPODCAST.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-400">
                <span className="text-white font-extrabold text-sm">{platformStaffCounts.jarrakpodcast || 4}</span> Host &amp; Tim Studio
              </div>
              
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>Buka Portal</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-600"></div>
          </div>

        </div>

      </div>

      {/* Footer Notice */}
      <div className="max-w-6xl mx-auto w-full text-center text-xs text-slate-500 pt-6 border-t border-slate-800/80 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} JARRAK MEDIA GROUP. All rights reserved.</p>
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sistem Bank Data Terpadu Multi-Media Redaksi</span>
        </div>
      </div>

    </div>
  );
}
