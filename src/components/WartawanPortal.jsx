import React, { useRef } from 'react';
import { 
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
  Camera, 
  UploadCloud, 
  Sparkles,
  Heart,
  FileCheck,
  Building,
  CheckCircle2
} from 'lucide-react';

export default function WartawanPortal({
  staff,
  onOpenIdCard,
  onOpenVerify,
  onEditPhoto,
  onEditProfile
}) {
  const fileInputRef = useRef(null);

  if (!staff) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto my-10">
        <h3 className="text-lg font-bold text-slate-800">Profil Wartawan Tidak Ditemukan</h3>
        <p className="text-xs text-slate-500 mt-1">Data anggota Anda belum terhubung dengan akun ini.</p>
      </div>
    );
  }

  const isExpired = () => {
    if (!staff.ktaExpiry) return false;
    return new Date(staff.ktaExpiry) < new Date();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Banner Portal Wartawan */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Photo with Change Trigger */}
          <div 
            className="relative group cursor-pointer shrink-0"
            onClick={() => onEditProfile(staff)}
            title="Klik untuk ganti foto profil resmi"
          >
            <img
              src={staff.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
              alt={staff.name}
              className="w-28 h-32 sm:w-36 sm:h-40 rounded-3xl object-cover border-4 border-rose-600 shadow-2xl group-hover:scale-105 transition-all bg-slate-800"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-slate-950/60 rounded-3xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 mb-1 text-rose-400" />
              <span className="text-[10px] font-bold">Ganti Foto</span>
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-rose-600 text-white shadow-lg border-2 border-slate-900">
              <Camera className="w-4 h-4" />
            </div>
          </div>

          {/* Profile Identity */}
          <div className="text-center sm:text-left flex-1 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Portal Mandiri Jurnalis Resmi Jarrakpos
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {staff.name}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-sm">
                {staff.role}
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                {staff.bureau}
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-800 text-amber-300 text-xs font-mono font-bold border border-slate-700">
                NIP: {staff.nip || staff.id}
              </span>
            </div>

            <p className="text-xs text-slate-300 pt-2 leading-relaxed max-w-xl">
              Selamat datang di portal keanggotaan pers Anda. Di sini Anda dapat mencetak Kartu Pers (KTA) Digital, mengecek QR Code verifikasi publik di lapangan, serta memperbarui pas foto dan data kontak Anda.
            </p>
          </div>

        </div>

        {/* Action Buttons Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenIdCard(staff)}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-rose-900/40 transition-all active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            <span>Buka &amp; Unduh KTA Digital Resmi</span>
          </button>

          <button
            onClick={() => onOpenVerify(staff)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Cek Halaman Verifikasi QR</span>
          </button>

          <button
            onClick={() => onEditProfile(staff)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-700 transition-all"
          >
            <Edit3 className="w-4 h-4 text-sky-400" />
            <span>Ubah Foto &amp; Biodata</span>
          </button>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      </div>

      {/* Grid Status & Dossier Pribadi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Status Anggota */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Status Keanggotaan</span>
          <div className="flex items-center gap-1.5 mt-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-lg font-black text-emerald-700">{staff.status || 'Aktif'}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Terdaftar resmi di Dewan Redaksi</p>
        </div>

        {/* Status UKW */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Sertifikasi Dewan Pers</span>
          <div className="flex items-center gap-1.5 mt-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-lg font-black text-slate-900">{staff.ukwLevel || 'Belum UKW'}</span>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-1 truncate" title={staff.ukwNumber}>
            {staff.ukwNumber || '-'}
          </p>
        </div>

        {/* Masa Berlaku KTA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Masa Berlaku Kartu Pers</span>
          <div className="flex items-center gap-1.5 mt-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            <span className="text-lg font-black text-slate-900">{staff.ktaExpiry || '2028-12-31'}</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Status Kartu Valid</p>
        </div>

        {/* Golongan Darah */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Golongan Darah</span>
          <div className="flex items-center gap-1.5 mt-2">
            <Heart className="w-5 h-5 text-rose-600" />
            <span className="text-lg font-black text-rose-700">{staff.bloodType || 'O'}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Data Medis Lapangan</p>
        </div>

      </div>

      {/* Detail Kontak & Penugasan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Info Kontak & Penempatan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-rose-600" />
            Informasi Biro &amp; Kontak Resmi
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Biro / Wilayah Liputan:</span>
              <span className="font-bold text-slate-900">{staff.bureau}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Divisi Redaksi:</span>
              <span className="font-bold text-slate-900">{staff.division}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Nomor WhatsApp / HP:</span>
              <span className="font-bold text-rose-600">{staff.phone || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Email Terdaftar:</span>
              <span className="font-bold text-slate-900">{staff.email || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Kontak Darurat:</span>
              <span className="font-bold text-amber-700">{staff.emergencyContact || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 font-medium">Alamat Domisili:</span>
              <span className="font-medium text-slate-700 text-right max-w-xs">{staff.address || '-'}</span>
            </div>
          </div>
        </div>

        {/* Legalitas & Catatan Penugasan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            Legalitas &amp; Rubrik Penugasan
          </h3>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800 block mb-1">Catatan Penugasan / Spesialisasi:</strong>
            {staff.bio || 'Wartawan resmi peliputan berita daerah & nasional Jarrakpos.com.'}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
            <strong className="text-emerald-950 block mb-1">Perlindungan Hukum Pers:</strong>
            Dalam menjalankan tugas jurnalistik, pemegang kartu pers ini dilindungi oleh <strong>Pasal 8 Undang-Undang Pokok Pers No. 40 Tahun 1999</strong> serta Kode Etik Jurnalistik.
          </div>
        </div>

      </div>

    </div>
  );
}
