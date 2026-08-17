import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  CloudUpload, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Trash2,
  Server,
  HelpCircle,
  Play
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  testSupabaseConnection, 
  syncAllStaffToSupabase 
} from '../utils/supabaseClient';

const SQL_SCHEMA_TEXT = `-- ==============================================================================
-- 1. BUAT TABEL staff_jarrakpos
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.staff_jarrakpos (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    division TEXT NOT NULL,
    bureau TEXT NOT NULL,
    hierarchy_level INTEGER DEFAULT 5,
    nip TEXT,
    email TEXT,
    phone TEXT,
    ukw_level TEXT DEFAULT 'Belum UKW',
    ukw_number TEXT DEFAULT '-',
    status TEXT DEFAULT 'Aktif',
    join_date DATE DEFAULT CURRENT_DATE,
    kta_expiry DATE DEFAULT '2028-12-31',
    photo_url TEXT,
    address TEXT,
    bio TEXT,
    emergency_contact TEXT,
    blood_type TEXT DEFAULT 'O',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 2. AKTIFKAN ROW LEVEL SECURITY (RLS) & HAPUS POLICY LAMA JIKA ADA
-- ==============================================================================
ALTER TABLE public.staff_jarrakpos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.staff_jarrakpos;
DROP POLICY IF EXISTS "Allow anon insert" ON public.staff_jarrakpos;
DROP POLICY IF EXISTS "Allow anon update" ON public.staff_jarrakpos;
DROP POLICY IF EXISTS "Allow anon delete" ON public.staff_jarrakpos;

-- ==============================================================================
-- 3. BUAT POLICY AKSES LENGKAP (BACA & TULIS)
-- ==============================================================================
CREATE POLICY "Allow public read access" 
ON public.staff_jarrakpos 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow anon insert" 
ON public.staff_jarrakpos 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow anon update" 
ON public.staff_jarrakpos 
FOR UPDATE 
TO public 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow anon delete" 
ON public.staff_jarrakpos 
FOR DELETE 
TO public 
USING (true);

-- ==============================================================================
-- 4. REFRESH SCHEMA CACHE SUPABASE POSTGREST
-- ==============================================================================
NOTIFY pgrst, 'reload schema';`;

export default function SupabaseModal({ 
  isOpen, 
  onClose, 
  staffList, 
  onSupabaseConfigured 
}) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getSupabaseConfig();
      setUrl(current.url || '');
      setKey(current.key || '');
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!url.trim() || !key.trim()) {
      setTestResult({ success: false, message: 'Harap masukkan Supabase URL dan Anon Key!' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await testSupabaseConnection(url, key);
    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      saveSupabaseConfig(url, key);
      onSupabaseConfigured();
    }
  };

  const handleSaveAndSync = async () => {
    if (!url.trim() || !key.trim()) {
      alert('Harap masukkan Supabase URL dan Anon Key terlebih dahulu!');
      return;
    }

    setIsSyncing(true);
    try {
      saveSupabaseConfig(url, key);
      await syncAllStaffToSupabase(staffList);
      setIsSyncing(false);
      alert(`Berhasil mengunggah & menyinkronkan ${staffList.length} data Dewan Redaksi ke Cloud Supabase!`);
      onSupabaseConfigured();
      onClose();
    } catch (err) {
      setIsSyncing(false);
      if (err.message && err.message.includes('staff_jarrakpos')) {
        alert(
          '⚠️ Tabel public.staff_jarrakpos BELUM DIBUAT di Supabase!\n\n' +
          'Solusi (Hanya 1 Menit):\n' +
          '1. Salin tombol "Salin SQL Skema" di bawah.\n' +
          '2. Buka Supabase Dashboard > Menu SQL Editor.\n' +
          '3. Tempel kodenya dan klik tombol hijau "RUN".\n' +
          '4. Setelah itu, klik lagi tombol "Simpan & Unggah" ini.'
        );
      } else {
        alert('Gagal menyinkronkan data: ' + err.message);
      }
    }
  };

  const handleDisconnect = () => {
    if (confirm('Putuskan koneksi ke Cloud Supabase dan kembali ke penyimpanan lokal browser?')) {
      clearSupabaseConfig();
      setUrl('');
      setKey('');
      setTestResult(null);
      onSupabaseConfigured();
      alert('Koneksi Supabase dinonaktifkan.');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 text-slate-900">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 text-white flex items-center justify-between border-b border-emerald-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
                Integrasi Cloud Database Supabase
              </h3>
              <p className="text-xs text-slate-400">
                Penyimpanan data dewan redaksi online real-time di Supabase PostgreSQL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          
          {/* Important Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Wajib Menjalankan SQL Editor di Supabase Dahulu:</strong>
              Supabase memerlukan pembuatan tabel <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-950 font-bold font-mono">public.staff_jarrakpos</code>. Salin kode SQL pada <strong>Langkah 1</strong> di bawah dan jalankan di Supabase Dashboard Anda.
            </div>
          </div>

          {/* Step 1: SQL Schema Setup */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Play className="w-4 h-4 text-emerald-600" />
                Langkah 1: Salin & Jalankan Skrip SQL di Supabase
              </h4>
              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl shadow-sm transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Skrip SQL'}</span>
              </button>
            </div>

            <div className="bg-slate-900 text-slate-200 p-3.5 rounded-2xl font-mono text-[11px] max-h-40 overflow-y-auto border border-slate-800">
              <pre>{SQL_SCHEMA_TEXT}</pre>
            </div>
            
            <p className="text-[11px] text-slate-600 leading-relaxed">
              📍 <strong>Cara Menjalankan:</strong> Buka <strong>Supabase Dashboard &gt; SQL Editor &gt; New Query</strong>, tempel skrip di atas, lalu klik <strong>RUN</strong>.
            </p>
          </div>

          {/* Step 2: Input Credentials */}
          <div className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <Server className="w-4 h-4 text-sky-600" />
              Langkah 2: Masukkan Kredensial Supabase
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project URL (VITE_SUPABASE_URL) *
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Anon / Public API Key (VITE_SUPABASE_ANON_KEY) *
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Test Connection Button & Result */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                {isTesting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>Uji Koneksi Supabase</span>
              </button>

              {url && key && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-rose-50 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Putuskan Koneksi
                </button>
              )}
            </div>

            {testResult && (
              <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 animate-in fade-in ${
                testResult.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{testResult.success ? 'Koneksi Berhasil!' : 'Koneksi Gagal'}</div>
                  <div className="mt-0.5">{testResult.message}</div>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: 1-Click Upload / Sync */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xs text-emerald-950">
                Langkah 3: Sinkronkan Data Redaksi ke Cloud
              </div>
              <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                {staffList.length} Personil Siap Upload
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Klik tombol di bawah untuk otomatis mengunggah seluruh {staffList.length} anggota Dewan Redaksi Jarrakpos ke database Supabase Anda.
            </p>
            <button
              type="button"
              onClick={handleSaveAndSync}
              disabled={isSyncing}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50 text-xs"
            >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CloudUpload className="w-4 h-4" />
              )}
              <span>Simpan &amp; Unggah Semua Data ke Supabase</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-semibold text-emerald-700 hover:underline"
          >
            <span>Buka Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 transition-all"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
