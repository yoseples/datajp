import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Award, 
  Calendar, 
  Building2, 
  PhoneCall, 
  Search,
  ExternalLink
} from 'lucide-react';

export default function PublicVerifyModal({ staff, allStaff, isOpen, onClose, onSelectStaff }) {
  const [searchId, setSearchId] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(staff || allStaff?.[0]);

  // Sync if prop changes
  React.useEffect(() => {
    if (staff) {
      setSelectedStaff(staff);
    } else if (allStaff && allStaff.length > 0) {
      setSelectedStaff(allStaff[0]);
    }
  }, [staff, allStaff, isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const found = allStaff.find(
      s => (s.nip && s.nip.toLowerCase().includes(searchId.toLowerCase())) ||
           (s.id && s.id.toLowerCase().includes(searchId.toLowerCase())) ||
           (s.name && s.name.toLowerCase().includes(searchId.toLowerCase()))
    );

    if (found) {
      setSelectedStaff(found);
    } else {
      alert(`Personel dengan NIP / Nama "${searchId}" tidak ditemukan dalam database resmi Jarrakpos!`);
    }
  };

  const isExpired = () => {
    if (!selectedStaff?.ktaExpiry) return false;
    return new Date(selectedStaff.ktaExpiry) < new Date();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900">
        
        {/* Verification Top Header */}
        <div className="bg-emerald-700 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-emerald-100 hover:text-white hover:bg-emerald-800 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-emerald-600 shadow-xl mb-3">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            SISTEM VERIFIKASI KEABSAHAN PERS
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-md mx-auto">
            Layanan Resmi Pengecekan Kartu Tanda Anggota (KTA) & Dewan Redaksi <strong>PT JARRAK POS MEDIA</strong>
          </p>
        </div>

        {/* Quick Search Tool for verifying any NIP */}
        <div className="p-4 bg-slate-100 border-b border-slate-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Cari NIP / Nomor KTA / Nama untuk verifikasi..."
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shrink-0"
            >
              Cek NIP
            </button>
          </form>
        </div>

        {/* Verification Result Dossier */}
        {selectedStaff ? (
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            
            {/* Status Alert Banner */}
            <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
              selectedStaff.status === 'Aktif' && !isExpired()
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className={`p-2 rounded-xl shrink-0 ${
                selectedStaff.status === 'Aktif' && !isExpired()
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white'
              }`}>
                {selectedStaff.status === 'Aktif' && !isExpired() ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>

              <div>
                <div className="font-extrabold text-sm sm:text-base">
                  {selectedStaff.status === 'Aktif' && !isExpired()
                    ? 'TERDAFTAR RESMI & AKTIF DI DEWAN REDAKSI'
                    : 'STATUS KEANGGOTAAN PERLU DIKONFIRMASI'}
                </div>
                <div className="text-xs opacity-90 mt-0.5">
                  Pemegang kartu adalah jurnalis/redaksi resmi terverifikasi PT Jarrak Pos Media.
                </div>
              </div>
            </div>

            {/* Profile Overview */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={selectedStaff.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                alt={selectedStaff.name}
                className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80';
                }}
              />

              <div className="text-center sm:text-left flex-1 space-y-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {selectedStaff.name}
                </h3>
                <p className="text-xs font-bold text-rose-700">
                  {selectedStaff.role}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  Divisi: {selectedStaff.division}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="font-mono text-xs bg-slate-200 px-2.5 py-0.5 rounded-lg font-bold text-slate-800">
                    NIP: {selectedStaff.nip || selectedStaff.id}
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-lg font-bold">
                    {selectedStaff.status || 'Aktif'}
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Detail Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-0.5">Biro / Wilayah Tugas:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  {selectedStaff.bureau}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-0.5">Sertifikasi Dewan Pers:</span>
                <span className="font-bold text-amber-800 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {selectedStaff.ukwLevel || 'Belum UKW'}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-0.5">Masa Berlaku KTA:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Hingga {selectedStaff.ktaExpiry || '2028-12-31'}
                </span>
              </div>

              {/* Office Contact Info */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-rose-600" />
                  Kantor Redaksi PT JARRAK POS MEDIA NUSANTARA
                </div>
                <p>Jalan Danau Tempe No. 30, Desa Sanur Kauh, Denpasar Selatan, Denpasar, Bali 80227</p>
                <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100 text-slate-500">
                  <span>Telp: <strong className="text-rose-600">(0361) 4481522</strong></span>
                  <span>•</span>
                  <span>Email: <strong className="text-slate-700">admin@jarrakpos.com</strong></span>
                </div>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="text-[11px] text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
              <strong>Himbauan untuk Narasumber:</strong> Wartawan resmi Jarrakpos.com selalu dibekali Surat Tugas dan KTA Aktif. Jurnalis Jarrakpos dilarang meminta imbalan uang, memeras, atau melanggar Kode Etik Jurnalistik. Bila ada indikasi pelanggaran, laporkan ke hotline redaksi.
            </div>

          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">
            Pilih atau cari NIP personel untuk memverifikasi.
          </div>
        )}

        {/* Footer Contact Hotline */}
        <div className="bg-slate-900 text-white p-4 px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Hotline Konfirmasi Redaksi Pusat:</span>
            <span className="font-bold text-rose-400 flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" /> (0361) 889201 / redaksi@jarrakpos.com
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
          >
            Tutup Verifikasi
          </button>
        </div>

      </div>
    </div>
  );
}
