import React from 'react';
import { 
  Users, 
  Award, 
  MapPin, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp,
  Briefcase,
  ChevronRight
} from 'lucide-react';

export default function DashboardStats({ staffList, onOpenExpiryModal }) {
  const totalStaff = staffList.length;
  
  // Total UKW Certified
  const ukwCertified = staffList.filter(
    s => s.ukwLevel && s.ukwLevel !== 'Belum UKW'
  ).length;

  const ukwUtama = staffList.filter(s => s.ukwLevel === 'Wartawan Utama').length;
  const ukwMadya = staffList.filter(s => s.ukwLevel === 'Wartawan Madya').length;
  const ukwMuda = staffList.filter(s => s.ukwLevel === 'Wartawan Muda').length;
  const belumUkw = staffList.filter(s => s.ukwLevel === 'Belum UKW' || !s.ukwLevel).length;

  // Bureaus Count
  const uniqueBureaus = Array.from(new Set(staffList.map(s => s.bureau))).length;

  // Active status
  const activeStaff = staffList.filter(s => s.status === 'Aktif').length;

  // KTA Expiry Alert (Expiring within next 12 months or already expired)
  const currentYear = new Date().getFullYear();
  const expiringStaffList = staffList.filter(s => {
    if (!s.ktaExpiry) return false;
    const expYear = parseInt(s.ktaExpiry.slice(0, 4));
    return expYear <= currentYear + 1;
  });
  const expiringSoonCount = expiringStaffList.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      
      {/* Card 1: Total Redaksi */}
      <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Personel
          </span>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalStaff}
          </span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {activeStaff} Aktif
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Dewan Redaksi, Jurnalis &amp; Staf Jarrakpos
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-rose-700"></div>
      </div>

      {/* Card 2: Uji Kompetensi Wartawan (UKW) */}
      <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Sertifikasi UKW
          </span>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {ukwCertified}
          </span>
          <span className="text-xs font-medium text-slate-500">
            / {totalStaff} ({Math.round((ukwCertified / (totalStaff || 1)) * 100)}%)
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] font-medium text-slate-600">
          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold">{ukwUtama} Utama</span>
          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold">{ukwMadya} Madya</span>
          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold">{ukwMuda} Muda</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
      </div>

      {/* Card 3: Sebaran Wilayah / Biro */}
      <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Jaringan Biro
          </span>
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {uniqueBureaus}
          </span>
          <span className="text-xs font-medium text-slate-500">Wilayah Liputan</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Pusat Bali, Jakarta, Jatim, Sumut, IKN &amp; Nusantara
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-blue-600"></div>
      </div>

      {/* Card 4: KTA & Validitas Hukum (CLICKABLE TO OPEN EXPIRY MODAL) */}
      <div 
        onClick={() => onOpenExpiryModal && onOpenExpiryModal(expiringStaffList)}
        className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-amber-400 transition-all cursor-pointer group"
        title="Klik untuk melihat detail daftar KTA yang perlu perpanjangan"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            Status KTA Digital
          </span>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
        
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 tracking-tight">
              {expiringSoonCount}
            </span>
            <span className="text-xs font-bold text-amber-700 uppercase">
              Perlu Perpanjangan
            </span>
          </div>

          <span className="text-[11px] font-bold text-rose-600 group-hover:underline flex items-center">
            Detail <ChevronRight className="w-3.5 h-3.5 inline" />
          </span>
        </div>

        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
          {expiringSoonCount > 0 ? (
            <span className="text-amber-700 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Klik untuk lihat daftar personil
            </span>
          ) : (
            <span className="text-emerald-600 font-medium">Semua KTA dalam masa aktif</span>
          )}
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-rose-600"></div>
      </div>

    </div>
  );
}
