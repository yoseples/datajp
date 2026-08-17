import React from 'react';
import { 
  CreditCard, 
  Eye, 
  Edit3, 
  Trash2, 
  MapPin, 
  Award, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  Mail,
  UserCheck
} from 'lucide-react';

export default function StaffCard({ 
  staff, 
  onViewDetail, 
  onViewIdCard, 
  onVerify, 
  onEdit, 
  onDelete 
}) {
  const getUkwBadge = (ukw) => {
    switch (ukw) {
      case 'Wartawan Utama':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Wartawan Madya':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
      case 'Wartawan Muda':
        return 'bg-slate-100 text-slate-800 border-slate-300 font-medium';
      default:
        return 'bg-slate-50 text-slate-400 border-slate-200';
    }
  };

  const isExpired = () => {
    if (!staff.ktaExpiry) return false;
    const exp = new Date(staff.ktaExpiry);
    return exp < new Date();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Header Banner with Division & Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 px-4 py-2.5 flex items-center justify-between text-white border-b border-rose-900/30">
        <span className="text-[11px] font-semibold tracking-wide text-slate-300 truncate max-w-[190px]">
          {staff.division}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border flex items-center gap-1 ${
          staff.status === 'Aktif' 
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
            : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          {staff.status || 'Aktif'}
        </span>
      </div>

      {/* Main Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        
        {/* Photo + Identity Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <img
              src={staff.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
              alt={staff.name}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-rose-600/30 shadow-md group-hover:scale-105 transition-transform duration-300 bg-slate-100"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute -bottom-1 -right-1 bg-rose-600 text-white p-1 rounded-lg shadow-sm border border-white">
              <ShieldCheck className="w-3 h-3" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-rose-600 transition-colors line-clamp-2">
              {staff.name}
            </h3>
            <p className="text-xs font-semibold text-rose-700 mt-0.5">
              {staff.role}
            </p>
            <p className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1">
              <span>NIP:</span>
              <span className="font-semibold text-slate-700">{staff.nip || staff.id}</span>
            </p>
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
          
          {/* Bureau Location */}
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className="truncate font-medium">{staff.bureau}</span>
          </div>

          {/* UKW Dewan Pers Status */}
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className={`px-2 py-0.5 rounded-md text-[10px] border ${getUkwBadge(staff.ukwLevel)}`}>
              {staff.ukwLevel || 'Belum UKW'}
            </span>
            {staff.ukwNumber && staff.ukwNumber !== '-' && (
              <span className="text-[10px] font-mono text-slate-400 truncate max-w-[130px]" title={staff.ukwNumber}>
                {staff.ukwNumber}
              </span>
            )}
          </div>

          {/* KTA Expiry Date */}
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              Masa KTA:
            </span>
            <span className={`font-semibold ${isExpired() ? 'text-rose-600' : 'text-slate-700'}`}>
              {staff.ktaExpiry || '2028-12-31'}
            </span>
          </div>

        </div>

        {/* Bio excerpt if exists */}
        {staff.bio && (
          <p className="text-xs text-slate-500 mt-3 line-clamp-2 italic">
            "{staff.bio}"
          </p>
        )}

      </div>

      {/* Action Footer */}
      <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
        
        {/* Main Actions (ID Card & Detail) */}
        <div className="flex items-center gap-1.5 flex-1">
          <button
            onClick={() => onViewIdCard(staff)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold py-2 px-3 rounded-xl shadow-sm transition-all active:scale-95"
            title="Buka Kartu Pers Digital & Cetak"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>KTA Digital</span>
          </button>

          <button
            onClick={() => onViewDetail(staff)}
            className="flex items-center justify-center p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-all"
            title="Lihat Biodata & Riwayat Lengkap"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onVerify(staff)}
            className="flex items-center justify-center p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-all"
            title="Simulasi Verifikasi QR Publik"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Admin Actions (Edit / Delete) */}
        <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
          <button
            onClick={() => onEdit(staff)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit Data Personel"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => onDelete(staff.id)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            title="Hapus Dari Database"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
