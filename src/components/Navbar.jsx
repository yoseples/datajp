import React, { useRef } from 'react';
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
  UserCheck
} from 'lucide-react';
import { exportToCSV, exportToJSON } from '../utils/storage';
import logoJarrakpos from '../assets/logo-jarrakpos.png';

export default function Navbar({ 
  currentUser,
  onLogout,
  staffList, 
  onOpenAddModal, 
  onResetData, 
  onImportData, 
  onOpenVerifyModal,
  searchQuery,
  setSearchQuery,
  activeView,
  setActiveView
}) {
  const fileInputRef = useRef(null);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white p-1 shadow-glow border border-rose-500/40 shrink-0">
              <img
                src={logoJarrakpos}
                alt="Jarrakpos Logo"
                className="w-full h-full object-contain"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" title="Sistem Aktif"></div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                  JARRAK<span className="text-rose-500">POS</span>.COM
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-rose-950 text-rose-300 border border-rose-800/80 rounded-full">
                  Redaksi & HRD
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Sistem Bank Data & Kartu Pers Dewan Redaksi Nasional
              </p>
            </div>
          </div>

          {/* Quick Search in Navbar (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIP, jabatan, atau biro..."
                className="w-full bg-slate-800/90 hover:bg-slate-800 text-slate-100 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
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

          {/* Action Buttons & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Direct Add Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-2.5 rounded-xl shadow-lg shadow-rose-900/30 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Redaksi</span>
              <span className="sm:hidden">Tambah</span>
            </button>

            {/* Quick Verify Modal Trigger */}
            <button
              onClick={() => onOpenVerifyModal(null)}
              title="Cek Verifikasi Wartawan Publik"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-medium text-xs px-3 py-2.5 rounded-xl border border-slate-700 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden lg:inline">Cek Validasi KTA</span>
            </button>

            {/* Export Dropdown / Buttons */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => exportToCSV(staffList)}
                title="Export Data ke Excel (CSV)"
                className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                CSV
              </button>
              <button
                onClick={() => exportToJSON(staffList)}
                title="Backup Seluruh Database (JSON)"
                className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                Backup
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Restore / Import JSON"
                className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-sky-400" />
                Restore
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* User Profile Info & Logout */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="hidden xl:block text-right">
                  <div className="text-xs font-bold text-white leading-tight truncate max-w-[140px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-rose-400 font-medium truncate max-w-[140px]">
                    {currentUser.badge || currentUser.role}
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title={`Keluar (${currentUser.email})`}
                  className="flex items-center gap-1 bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-700/80 p-2.5 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={() => {
                if (confirm('Kembalikan database ke data bawaan Dewan Redaksi Jarrakpos?')) {
                  onResetData();
                }
              }}
              title="Reset ke Data Bawaan"
              className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
