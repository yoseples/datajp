import React from 'react';
import { 
  X, 
  AlertTriangle, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  RefreshCw, 
  User, 
  Phone, 
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

export default function KtaExpiryModal({
  isOpen,
  onClose,
  expiringStaffList,
  onRenewKta,
  onOpenIdCard,
  onEditStaff
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 text-slate-900">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-rose-950 p-6 text-white flex items-center justify-between border-b border-amber-900/40">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
                Daftar KTA Perlu Perpanjangan
              </h3>
              <p className="text-xs text-amber-200/80">
                Ditemukan {expiringStaffList.length} personil redaksi yang masa berlaku Kartu Pers (KTA) mendekati habis / kedaluwarsa
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
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs sm:text-sm">
          
          {/* Quick Notice Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="block font-bold">Instruksi Administrasi Redaksi:</strong>
              Personel di bawah ini masa berlaku kartu persnya telah habis atau mendekati batas akhir penugasan. Anda dapat melakukan perpanjangan masa berlaku 3 tahun ke depan (s/d 31 Desember 2028) dengan sekali klik tombol <strong>"Perpanjang KTA"</strong>.
            </div>
          </div>

          {/* List of Expiring Staff */}
          <div className="space-y-3 pt-2">
            {expiringStaffList.map((staff) => {
              const isPast = staff.ktaExpiry && new Date(staff.ktaExpiry) < new Date();

              return (
                <div 
                  key={staff.id}
                  className="bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-2xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  
                  {/* Photo & Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={staff.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                      alt={staff.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md shrink-0 bg-slate-200"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80';
                      }}
                    />
                    
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm truncate group-hover:text-rose-600 transition-colors">
                          {staff.name}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isPast ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isPast ? 'Kedaluwarsa' : 'Segera Habis'}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-rose-700 mt-0.5">
                        {staff.role} • <span className="text-slate-600 font-normal">{staff.bureau}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1 font-bold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                          <Calendar className="w-3 h-3 text-amber-600" />
                          Berlaku S/D: {staff.ktaExpiry || '2025-12-31'}
                        </span>
                        {staff.phone && (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            {staff.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto justify-end">
                    
                    {/* Quick 1-Click Renew Button */}
                    <button
                      onClick={() => onRenewKta(staff)}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all active:scale-95"
                      title="Perpanjang masa aktif KTA ke 31 Desember 2028"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Perpanjang KTA</span>
                    </button>

                    {/* View KTA */}
                    <button
                      onClick={() => {
                        onClose();
                        onOpenIdCard(staff);
                      }}
                      className="p-2 bg-white hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 transition-all"
                      title="Buka KTA Digital"
                    >
                      <CreditCard className="w-4 h-4 text-rose-600" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Total {expiringStaffList.length} kartu pers memerlukan tindakan
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold text-white transition-all"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
