import React, { useRef, useState } from 'react';
import { 
  Building2, 
  UserPlus, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  Printer, 
  Search,
  Database,
  Users,
  LogOut,
  UserCheck,
  CreditCard,
  User,
  Globe,
  Tv,
  Mic,
  ChevronDown,
  LayoutGrid,
  KeyRound,
  Menu,
  X
} from 'lucide-react';
import { exportToCSV, exportToJSON } from '../utils/storage';
import { SYSTEM_ROLES } from '../utils/authCredentials';
import { MEDIA_PLATFORMS } from '../data/mediaPlatforms';
import logoJarrakpos from '../assets/logo-jarrakpos.png';

export default function Navbar({ 
  currentUser,
  currentPlatform = 'jarrakpos',
  onSwitchPlatform,
  onOpenHub,
  onOpenSettingsModal,
  onLogout,
  staffList, 
  onOpenAddModal, 
  onResetData, 
  onImportData, 
  onOpenVerifyModal,
  onOpenSupabaseModal,
  onOpenMyIdCard,
  isSupabaseActive,
  searchQuery,
  setSearchQuery,
  activeView,
  setActiveView
}) {
  const fileInputRef = useRef(null);
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDeveloper = currentUser?.role === SYSTEM_ROLES.DEVELOPER;
  const isAdmin = currentUser?.role === SYSTEM_ROLES.ADMIN || isDeveloper;
  const isWartawan = currentUser?.role === SYSTEM_ROLES.WARTAWAN;

  const platformInfo = MEDIA_PLATFORMS[currentPlatform.toUpperCase()] || MEDIA_PLATFORMS.JARRAKPOS;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (Array.isArray(parsed)) {
          onImportData(parsed);
        } else {
          alert('Format file JSON tidak valid!');
        }
      } catch (err) {
        alert('Gagal membaca file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Media Switcher Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div 
              onClick={onOpenHub}
              className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white p-1 shadow-glow border border-rose-500/40 shrink-0 cursor-pointer hover:scale-105 transition-transform"
              title="Kembali ke Pilihan Platform Media"
            >
              <img
                src={logoJarrakpos}
                alt="Jarrakpos Logo"
                className="w-full h-full object-contain"
              />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" title="Sistem Aktif"></div>
            </div>

            {/* Platform Switcher Dropdown */}
            <div className="relative min-w-0">
              <div 
                onClick={() => setIsPlatformMenuOpen(!isPlatformMenuOpen)}
                className="cursor-pointer group flex items-center gap-1.5 sm:gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-sm sm:text-lg tracking-tight text-white group-hover:text-rose-400 transition-colors truncate">
                      {platformInfo.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-white transition-transform shrink-0" />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-rose-300/90 font-medium hidden sm:block truncate">
                    {platformInfo.badge}
                  </p>
                </div>
              </div>

              {/* Dropdown Menu */}
              {isPlatformMenuOpen && (
                <div 
                  className="absolute left-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setIsPlatformMenuOpen(false)}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
                    <span>Ganti Platform Media</span>
                    <LayoutGrid className="w-3.5 h-3.5 text-rose-400" />
                  </div>

                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => {
                        onSwitchPlatform('jarrakpos');
                        setIsPlatformMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        currentPlatform === 'jarrakpos' 
                          ? 'bg-rose-600 text-white' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Globe className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <div className="leading-tight">JARRAKPOS.COM</div>
                        <span className="text-[9px] opacity-80 block font-normal">Portal Berita Siber</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onSwitchPlatform('jarrakpostv');
                        setIsPlatformMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        currentPlatform === 'jarrakpostv' 
                          ? 'bg-red-600 text-white' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Tv className="w-4 h-4 text-red-400 shrink-0" />
                      <div>
                        <div className="leading-tight">JARRAKPOS TV</div>
                        <span className="text-[9px] opacity-80 block font-normal">Streaming &amp; Siaran Visual</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onSwitchPlatform('jarrakpodcast');
                        setIsPlatformMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        currentPlatform === 'jarrakpodcast' 
                          ? 'bg-amber-600 text-white' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Mic className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <div className="leading-tight">JARRAK PODCAST</div>
                        <span className="text-[9px] opacity-80 block font-normal">Talkshow Studio</span>
                      </div>
                    </button>
                  </div>

                  <div className="pt-2 mt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        onOpenHub();
                        setIsPlatformMenuOpen(false);
                      }}
                      className="w-full text-center py-1.5 text-[11px] font-bold text-rose-400 hover:text-rose-300 hover:bg-slate-800/80 rounded-lg transition-all"
                    >
                      Buka Halaman Pilihan Portal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search bar on Desktop */}
          {isAdmin && (
            <div className="hidden lg:flex items-center flex-1 max-w-xs xl:max-w-sm mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Cari redaksi ${platformInfo.name}...`}
                  className="w-full bg-slate-800/90 hover:bg-slate-800 text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 sm:gap-2.5">
            
            {/* Account Settings Button */}
            <button
              onClick={onOpenSettingsModal}
              title="Pengaturan Username & Password Akun"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition-all"
            >
              <KeyRound className="w-3.5 h-3.5 text-rose-400" />
              <span>Ganti Password</span>
            </button>

            {/* Switch Media Hub Button */}
            <button
              onClick={onOpenHub}
              title="Ganti Pilihan Platform Media"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition-all"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Portal Hub</span>
            </button>

            {/* DEVELOPER ONLY: Supabase Setup Button */}
            {isDeveloper && (
              <button
                onClick={onOpenSupabaseModal}
                title={isSupabaseActive ? "Supabase Cloud Database Terhubung" : "Konfigurasi Database Cloud Supabase"}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isSupabaseActive
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60 hover:bg-emerald-900 shadow-sm'
                    : 'bg-slate-800 text-amber-300 border-amber-500/40 hover:bg-slate-700'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">
                  {isSupabaseActive ? 'Cloud Supabase' : 'Setup Supabase'}
                </span>
                <span className={`w-2 h-2 rounded-full ${isSupabaseActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              </button>
            )}

            {/* ADMIN & DEVELOPER: Add Staff Button */}
            {isAdmin && (
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-xs px-3 sm:px-4 py-2 rounded-xl shadow-lg shadow-rose-900/30 transition-all active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tambah Redaksi</span>
              </button>
            )}

            {/* WARTAWAN: My ID Card Quick Button */}
            {isWartawan && (
              <button
                onClick={onOpenMyIdCard}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-rose-900/30 transition-all active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>KTA Saya</span>
              </button>
            )}

            {/* Public QR Check Modal Trigger */}
            <button
              onClick={() => onOpenVerifyModal(null)}
              title="Cek Verifikasi Wartawan Publik"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-medium text-xs px-2.5 py-2 rounded-xl border border-slate-700 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden xl:inline">Validasi</span>
            </button>

            {/* User Profile Info & Logout */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="hidden xl:block text-right">
                  <div className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-rose-400 font-medium truncate max-w-[120px]">
                    {currentUser.role}
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Keluar dari Akun"
                  className="flex items-center gap-1 bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-700/80 p-2 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

          {/* Mobile Right Controls: Ganti Password, Tambah/KTA, and Hamburger */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onOpenSettingsModal}
              title="Ganti Password Akun"
              className="p-2 bg-slate-800 text-rose-400 rounded-xl border border-slate-700"
            >
              <KeyRound className="w-4 h-4" />
            </button>

            {isAdmin && (
              <button
                onClick={onOpenAddModal}
                className="p-2 bg-rose-600 text-white rounded-xl shadow-md"
                title="Tambah Redaksi"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            )}

            {isWartawan && (
              <button
                onClick={onOpenMyIdCard}
                className="p-2 bg-rose-600 text-white rounded-xl shadow-md"
                title="KTA Digital Saya"
              >
                <CreditCard className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-2 animate-in slide-in-from-top-2 duration-150">
            {currentUser && (
              <div className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-xl text-xs">
                <div>
                  <div className="font-bold text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-rose-400 font-semibold">{currentUser.role}</div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg text-xs font-bold border border-rose-700/50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => {
                  onOpenHub();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-800 text-slate-200 rounded-xl border border-slate-700"
              >
                <LayoutGrid className="w-4 h-4 text-rose-400" />
                <span>Pilih Platform</span>
              </button>

              <button
                onClick={() => {
                  onOpenSettingsModal();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-800 text-rose-300 rounded-xl border border-slate-700"
              >
                <KeyRound className="w-4 h-4 text-rose-400" />
                <span>Ganti Password</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => {
                  onOpenVerifyModal(null);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-800 text-emerald-300 rounded-xl border border-slate-700"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Validasi KTA</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    exportToCSV(staffList);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-800 text-slate-300 rounded-xl border border-slate-700"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download CSV</span>
                </button>
              )}
            </div>

            {isDeveloper && (
              <button
                onClick={() => {
                  onOpenSupabaseModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 p-2.5 bg-emerald-950/80 text-emerald-300 rounded-xl border border-emerald-800 text-xs font-bold"
              >
                <Database className="w-4 h-4" />
                <span>Kelola Cloud Supabase</span>
              </button>
            )}
          </div>
        )}

      </div>
    </header>
  );
}
