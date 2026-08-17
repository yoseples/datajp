import React, { useRef } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  MapPin, 
  Award, 
  Phone, 
  Mail, 
  Calendar, 
  UserCheck, 
  Edit3, 
  Printer, 
  AlertCircle,
  FileCheck,
  Heart,
  Camera,
  UploadCloud,
  Sparkles
} from 'lucide-react';

export default function StaffDetailModal({ 
  staff, 
  isOpen, 
  onClose, 
  onOpenIdCard, 
  onOpenVerify, 
  onEdit,
  allPlatformData = {}
}) {
  if (!isOpen || !staff) return null;

  // Find concurrent roles across all 3 platforms by matching name
  const concurrentRoles = [];
  if (allPlatformData.jarrakpos) {
    const matched = allPlatformData.jarrakpos.find(s => s.name?.toLowerCase() === staff.name?.toLowerCase());
    if (matched) concurrentRoles.push({ platform: 'JARRAKPOS.COM', role: matched.role, bureau: matched.bureau, badge: 'Siber' });
  }
  if (allPlatformData.jarrakpostv) {
    const matched = allPlatformData.jarrakpostv.find(s => s.name?.toLowerCase() === staff.name?.toLowerCase());
    if (matched) concurrentRoles.push({ platform: 'JARRAKPOS TV', role: matched.role, bureau: matched.bureau, badge: 'TV' });
  }
  if (allPlatformData.jarrakpodcast) {
    const matched = allPlatformData.jarrakpodcast.find(s => s.name?.toLowerCase() === staff.name?.toLowerCase());
    if (matched) concurrentRoles.push({ platform: 'JARRAK PODCAST', role: matched.role, bureau: matched.bureau, badge: 'Podcast' });
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Photo Background Gradient */}
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 p-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            
            {/* Profile Photo with quick edit trigger */}
            <div 
              className="relative group cursor-pointer shrink-0"
              onClick={() => {
                onClose();
                onEdit(staff);
              }}
              title="Klik untuk ubah foto / data personel"
            >
              <img
                src={staff.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                alt={staff.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-rose-600 shadow-xl group-hover:opacity-80 transition-opacity"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-black/50 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white mb-1" />
                <span className="text-[9px] font-bold text-white">Ganti Foto</span>
              </div>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-600 text-white mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                {staff.division}
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {staff.name}
              </h2>
              <p className="text-sm font-semibold text-rose-400 mt-0.5">
                {staff.role}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-300 font-mono">
                <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  NIP: {staff.nip || staff.id}
                </span>
                <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  ID: {staff.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto text-xs sm:text-sm">
          
          {/* Card: Status Legalitas & UKW */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              Status Dewan Pers & KTA Digital
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Status Keanggotaan</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  {staff.status || 'Aktif'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Jenjang UKW</span>
                <span className="font-bold text-amber-700 mt-0.5 block">
                  {staff.ukwLevel || 'Belum UKW'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Masa KTA</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {staff.ktaExpiry || '2028-12-31'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Golongan Darah</span>
                <span className="font-bold text-rose-600 mt-0.5 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  {staff.bloodType || 'O'}
                </span>
              </div>
            </div>

            {staff.ukwNumber && staff.ukwNumber !== '-' && (
              <div className="mt-3 text-xs bg-white p-2.5 rounded-xl border border-slate-200/60 flex items-center justify-between">
                <span className="text-slate-500 font-medium">No. Registrasi UKW Dewan Pers:</span>
                <span className="font-mono font-bold text-slate-800">{staff.ukwNumber}</span>
              </div>
            )}
          </div>

          {/* Concurrent Roles Across Media Group */}
          {concurrentRoles.length > 1 && (
            <div className="bg-gradient-to-r from-slate-900 to-rose-950 text-white rounded-2xl p-4 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Portofolio Jabatan Lintas Media Group ({concurrentRoles.length} Platform)
                </span>
                <span className="text-[10px] bg-rose-600/60 px-2 py-0.5 rounded-full font-bold text-white">
                  Multi-Role
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {concurrentRoles.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-[9px] font-bold text-rose-400 uppercase block font-mono">
                      {item.platform}
                    </span>
                    <strong className="text-xs text-white block mt-0.5 leading-snug">
                      {item.role}
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {item.bureau}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Penempatan & Kontak */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Biro Penempatan */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-sky-600">
                <MapPin className="w-4 h-4" />
                Wilayah Biro Liputan
              </h5>
              <p className="font-semibold text-slate-800">{staff.bureau}</p>
              {staff.address && (
                <p className="text-xs text-slate-500 mt-1">
                  Alamat: {staff.address}
                </p>
              )}
            </div>

            {/* Hubungi Personel */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-emerald-600">
                <Phone className="w-4 h-4" />
                Kontak & Komunikasi
              </h5>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Telepon/WA:</span>
                  <a href={`tel:${staff.phone}`} className="font-semibold text-rose-600 hover:underline">
                    {staff.phone || '-'}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email:</span>
                  <a href={`mailto:${staff.email}`} className="font-semibold text-slate-800 hover:underline">
                    {staff.email || '-'}
                  </a>
                </div>
                {staff.emergencyContact && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Darurat:</span>
                    <span className="font-semibold text-amber-700">{staff.emergencyContact}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Bio / Penugasan Khusus */}
          {staff.bio && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-slate-700">
                <FileCheck className="w-4 h-4 text-rose-600" />
                Catatan Penugasan Redaksi
              </h5>
              <p className="text-slate-600 text-xs leading-relaxed">
                {staff.bio}
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(staff);
              }}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              Edit Data / Ganti Foto
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenVerify(staff);
              }}
              className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-emerald-300 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Verifikasi QR
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenIdCard(staff);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-rose-900/20 transition-all active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            Buka KTA Digital & Cetak
          </button>

        </div>

      </div>
    </div>
  );
}
