import React from 'react';
import { 
  CreditCard, 
  Eye, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  MapPin, 
  Award,
  Phone,
  Mail,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function StaffTable({ 
  staffList, 
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

  return (
    <div className="mb-8 space-y-3">
      
      {/* 1. Mobile Card View (< 768px) */}
      <div className="block md:hidden space-y-3">
        {staffList.map((staff) => (
          <div 
            key={staff.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={staff.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                alt={staff.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80';
                }}
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-extrabold text-slate-900 text-sm truncate">
                  {staff.name}
                </h4>
                <p className="text-xs font-semibold text-rose-600 truncate">
                  {staff.role}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span className="font-mono">NIP: {staff.nip || staff.id}</span>
                  <span>•</span>
                  <span className="truncate">{staff.bureau}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs border-t border-slate-100">
              <span className={`px-2 py-0.5 rounded-md text-[10px] border ${getUkwBadge(staff.ukwLevel)}`}>
                {staff.ukwLevel || 'Belum UKW'}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Exp: {staff.ktaExpiry || '2028-12-31'}
              </span>
              <span className="ml-auto px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold">
                {staff.status || 'Aktif'}
              </span>
            </div>

            {/* Mobile Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-1.5">
              <button
                onClick={() => onViewDetail(staff)}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                <span>Profil</span>
              </button>

              <button
                onClick={() => onViewIdCard(staff)}
                className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1 border border-rose-200 transition-all"
              >
                <CreditCard className="w-3.5 h-3.5 text-rose-600" />
                <span>KTA</span>
              </button>

              <button
                onClick={() => onVerify(staff)}
                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition-all"
                title="Verifikasi QR"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>

              {onEdit && (
                <button
                  onClick={() => onEdit(staff)}
                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200 transition-all"
                  title="Edit Data"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(staff.id)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 transition-all"
                  title="Hapus Data"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Desktop Table View (>= 768px) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-200 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-4 px-4">Nama &amp; NIP</th>
                <th className="py-4 px-4">Jabatan &amp; Divisi</th>
                <th className="py-4 px-4">Biro / Wilayah</th>
                <th className="py-4 px-4">Status UKW (Dewan Pers)</th>
                <th className="py-4 px-4">Masa KTA</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-rose-50/40 transition-colors group">
                  
                  {/* Personel Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={staff.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                        alt={staff.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                          {staff.name}
                        </div>
                        <div className="text-xs font-mono text-slate-400">
                          {staff.nip || staff.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role & Division */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 text-xs sm:text-sm">
                      {staff.role}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {staff.division}
                    </div>
                  </td>

                  {/* Bureau */}
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span className="truncate max-w-[180px]">{staff.bureau}</span>
                    </div>
                  </td>

                  {/* UKW Dewan Pers */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className={`inline-block w-fit px-2 py-0.5 rounded-md text-[10px] border ${getUkwBadge(staff.ukwLevel)}`}>
                        {staff.ukwLevel || 'Belum UKW'}
                      </span>
                      {staff.ukwNumber && staff.ukwNumber !== '-' && (
                        <span className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]" title={staff.ukwNumber}>
                          {staff.ukwNumber}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* KTA Expiry */}
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                    {staff.ktaExpiry || '2028-12-31'}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      staff.status === 'Aktif'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {staff.status || 'Aktif'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onViewIdCard(staff)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg transition-all"
                        title="Kartu Pers KTA"
                      >
                        <CreditCard className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onViewDetail(staff)}
                        className="p-1.5 bg-slate-50 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
                        title="Detail Profil"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onVerify(staff)}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-lg transition-all"
                        title="Verifikasi QR"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(staff)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg transition-all"
                          title="Edit Data"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(staff.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg transition-all"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
