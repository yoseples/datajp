import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  RotateCw,
  CheckCircle2,
  Phone,
  Globe,
  Lock,
  Eye
} from 'lucide-react';
import logoJarrakpos from '../assets/logo-jarrakpos.png';

export default function IdCardModal({ 
  staff, 
  isOpen, 
  onClose, 
  onVerify,
  canDownload = true // Only Admin & Developer can download/print
}) {
  const [qrUrl, setQrUrl] = useState('');
  const [activeSide, setActiveSide] = useState('front'); // 'front' | 'back'
  const cardFrontRef = useRef(null);
  const cardBackRef = useRef(null);

  useEffect(() => {
    if (staff) {
      const verifyData = `https://jarrakpos.com/verifikasi-pers?id=${encodeURIComponent(staff.id)}&nip=${encodeURIComponent(staff.nip || '')}&name=${encodeURIComponent(staff.name)}`;
      
      QRCode.toDataURL(verifyData, {
        width: 300,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
      .then(url => setQrUrl(url))
      .catch(err => console.error('QR Gen error:', err));
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  const handlePrint = () => {
    if (!canDownload) {
      alert('Fitur Cetak KTA hanya dapat diakses oleh Admin dan Developer!');
      return;
    }
    window.print();
  };

  const handleDownload = async (side) => {
    if (!canDownload) {
      alert('Fitur Unduh Berkas KTA hanya dapat diakses oleh Admin dan Developer!');
      return;
    }

    const targetRef = side === 'front' ? cardFrontRef.current : cardBackRef.current;
    if (!targetRef) return;

    try {
      const canvas = await html2canvas(targetRef, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `KTA_JARRAKPOS_${staff.name.replace(/[^a-zA-Z0-9]/g, '_')}_${side.toUpperCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      alert('Gagal mengunduh kartu: ' + err.message);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none"
      onContextMenu={(e) => e.preventDefault()} // Disable Right Click on ID Card Modal
    >
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-xl bg-white border border-rose-500/40 w-9 h-9 flex items-center justify-center">
              <img src={logoJarrakpos} alt="Jarrakpos" className="w-full h-full object-contain pointer-events-none" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                Kartu Tanda Anggota (KTA) Digital Resmi
              </h3>
              <p className="text-xs text-slate-400">
                Format Standar Pers Jarrakpos.com &amp; Dewan Pers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Side Switcher & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSide('front')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeSide === 'front'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Sisi Depan (Front)
              </button>
              <button
                onClick={() => setActiveSide('back')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeSide === 'back'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Sisi Belakang (Back)
              </button>
            </div>

            {/* Download & Print Controls (Restricted to Admin & Developer) */}
            {canDownload ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(activeSide)}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-700 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  Unduh PNG
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak KTA
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-400 text-xs">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Unduh/Cetak KTA dikhususkan untuk Admin Redaksi</span>
              </div>
            )}
          </div>

          {/* ID Card Display Area (Protected with no-context-menu) */}
          <div 
            id="printable-id-card" 
            className="flex flex-wrap justify-center items-center gap-8 py-4 select-none"
            onContextMenu={(e) => e.preventDefault()}
          >
            
            {/* FRONT CARD */}
            <div 
              ref={cardFrontRef}
              className={`w-[320px] h-[510px] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between select-none text-slate-900 ${
                activeSide === 'front' ? 'ring-4 ring-rose-500/50 block' : 'hidden sm:flex opacity-60 hover:opacity-100 cursor-pointer'
              }`}
              onClick={() => setActiveSide('front')}
              style={{
                background: 'linear-gradient(180deg, #0a0f1d 0%, #1e1b4b 28%, #ffffff 28.1%, #f8fafc 100%)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Card Top Header */}
              <div className="p-4 pt-4 text-center text-white relative">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-white p-0.5 shadow-md flex items-center justify-center shrink-0">
                      <img src={logoJarrakpos} alt="Jarrakpos" className="w-full h-full object-contain pointer-events-none" />
                    </div>
                    <div className="text-left leading-none">
                      <span className="font-black text-sm tracking-tight text-white block">
                        JARRAK<span className="text-rose-400">POS.COM</span>
                      </span>
                      <span className="text-[7.5px] font-bold text-slate-300 tracking-wider uppercase">
                        BERSAMA MEMBANGUN BANGSA
                      </span>
                    </div>
                  </div>

                  <div className="px-2 py-0.5 rounded-full bg-rose-600/90 text-[9px] font-bold uppercase tracking-widest text-white border border-rose-400/40">
                    PERS
                  </div>
                </div>

                <div className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest mt-1.5 border-t border-slate-700/60 pt-1">
                  KARTU PERS / MEDIA RESMI
                </div>
              </div>

              {/* Photo & Badge Section */}
              <div className="px-6 flex flex-col items-center mt-2 flex-1">
                
                {/* Photo with Frame */}
                <div className="relative">
                  <img
                    src={staff.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                    alt={staff.name}
                    className="w-28 h-32 rounded-2xl object-cover border-4 border-white shadow-xl bg-slate-200 pointer-events-none"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-900 text-rose-400 font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full border border-slate-700 shadow-md whitespace-nowrap">
                    {staff.nip || staff.id}
                  </div>
                </div>

                {/* Name & Role */}
                <div className="text-center mt-4 w-full">
                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                    {staff.name}
                  </h3>
                  <div className="inline-block mt-1 px-3 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs">
                    {staff.role}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">
                    {staff.bureau}
                  </p>
                </div>

                {/* UKW Dewan Pers & Validity Badge */}
                <div className="w-full bg-slate-100/90 rounded-xl p-2.5 mt-3 border border-slate-200/80 text-[10px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Status UKW:</span>
                    <span className="font-bold text-amber-800">{staff.ukwLevel || 'Belum UKW'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Berlaku Hingga:</span>
                    <span className="font-mono font-bold text-slate-900">{staff.ktaExpiry || '2028-12-31'}</span>
                  </div>
                </div>

              </div>

              {/* Card Footer with QR & Barcode */}
              <div className="bg-slate-900 text-white p-3 px-4 flex items-center justify-between rounded-b-3xl border-t border-slate-800">
                <div className="flex items-center gap-2">
                  {qrUrl && (
                    <img 
                      src={qrUrl} 
                      alt="QR Verification" 
                      className="w-12 h-12 rounded-lg bg-white p-0.5 shadow-sm pointer-events-none"
                    />
                  )}
                  <div className="text-left">
                    <span className="text-[8px] uppercase tracking-widest text-slate-400 block font-bold">
                      Scan Verifikasi
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      RESMI AKTIF
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[8px] text-slate-400 block font-mono">PT JARRAK POS MEDIA</span>
                  <span className="text-[9px] font-bold text-rose-400">jarrakpos.com</span>
                </div>
              </div>
            </div>

            {/* BACK CARD */}
            <div 
              ref={cardBackRef}
              className={`w-[320px] h-[510px] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between select-none text-slate-900 ${
                activeSide === 'back' ? 'ring-4 ring-rose-500/50 block' : 'hidden sm:flex opacity-60 hover:opacity-100 cursor-pointer'
              }`}
              onClick={() => setActiveSide('back')}
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Back Header */}
              <div className="bg-slate-900 text-white p-4 pt-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-white p-0.5 flex items-center justify-center">
                    <img src={logoJarrakpos} alt="Jarrakpos" className="w-full h-full object-contain pointer-events-none" />
                  </div>
                  <span className="text-xs font-bold tracking-wider text-rose-400 uppercase">JARRAKPOS.COM</span>
                </div>
                <h4 className="font-extrabold text-[11px] tracking-wider text-white uppercase">
                  KETENTUAN KARTU PERS RESMI
                </h4>
                <p className="text-[8px] text-slate-300 font-medium">
                  UNDANG-UNDANG POKOK PERS NO. 40 TAHUN 1999
                </p>
              </div>

              {/* Legal Points */}
              <div className="p-4 text-[10px] text-slate-700 space-y-2.5 leading-relaxed flex-1">
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-rose-600">1.</span>
                  <span>Pemegang kartu ini adalah <strong>Wartawan/Anggota Resmi Jarrakpos.com</strong> yang dilindungi oleh UU Pers No. 40 Tahun 1999 dalam menjalankan tugas jurnalistik.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-rose-600">2.</span>
                  <span>Wajib menjunjung tinggi <strong>Kode Etik Jurnalistik (KEJ)</strong> dan asas praduga tak bersalah dalam setiap peliputan.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-rose-600">3.</span>
                  <span>Kepada instansi pemerintah, TNI/Polri, swasta, dan masyarakat dimohon memberikan bantuan &amp; kemudahan informasi.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-rose-600">4.</span>
                  <span>Kartu ini tidak berlaku apabila masa berlaku habis atau anggota telah diberhentikan oleh Dewan Redaksi.</span>
                </div>

                {/* Company Legal Notice */}
                <div className="mt-3 p-2 rounded-xl bg-slate-100 border border-slate-200 text-[9px] text-slate-600">
                  <div className="font-bold text-slate-800">Diterbitkan Oleh:</div>
                  <div>PT JARRAK POS MEDIA NUSANTARA</div>
                  <div>SK Kemenkumham: AHU-0012389.AH.01.01</div>
                  <div>Dewan Pers Terverifikasi Administrasi &amp; Faktual</div>
                </div>
              </div>

              {/* Back Footer with Digital Signature Stamp */}
              <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-left">
                <div>
                  <span className="text-[9px] font-bold text-slate-800 block">Denpasar, Bali</span>
                  <span className="text-[8px] text-slate-500 block">Pemimpin Redaksi / P.J.</span>
                  <div className="my-1">
                    <span className="font-serif italic text-rose-800 font-extrabold text-xs block -rotate-3">
                      [Jarrakpos Signature]
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-900 underline block">
                    I Putu Agus Sastrawan, S.I.Kom.
                  </span>
                </div>

                {/* Official Stamp */}
                <div className="w-16 h-16 rounded-full border-2 border-rose-600/80 flex flex-col items-center justify-center text-[7px] font-extrabold text-rose-700 uppercase tracking-tighter p-1 text-center -rotate-12 bg-rose-50/50 pointer-events-none">
                  <span>PT JARRAK POS</span>
                  <span className="text-slate-900 font-black">REDAKSI</span>
                  <span>BALI - INDONESIA</span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Notice for Field Reporting */}
          <div className="bg-rose-950/40 border border-rose-900/60 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-slate-300">
                Tunjukkan QR Code ini kepada narasumber atau instansi untuk memverifikasi keaslian status tugas pers Anda di lapangan.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onVerify(staff);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold whitespace-nowrap transition-all text-xs"
            >
              Uji Halaman Verifikasi
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
