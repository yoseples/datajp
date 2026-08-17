import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  MapPin, 
  CreditCard, 
  Eye, 
  Users,
  ChevronDown,
  UserCheck
} from 'lucide-react';

export default function OrgChart({ staffList, onViewDetail, onViewIdCard }) {
  // Group staff by hierarchyLevel or division
  const level1 = staffList.filter(s => s.hierarchyLevel === 1 || s.division.includes('Pembina'));
  const level2 = staffList.filter(s => s.hierarchyLevel === 2 || s.division.includes('Pimpinan Redaksi'));
  const level3 = staffList.filter(s => s.hierarchyLevel === 3 || s.division.includes('Redaktur Pelaksana'));
  const level4 = staffList.filter(s => s.hierarchyLevel === 4 || s.division.includes('Redaktur Desk') || s.division.includes('Koordinator'));
  const level5 = staffList.filter(s => s.hierarchyLevel === 5 || (!level1.includes(s) && !level2.includes(s) && !level3.includes(s) && !level4.includes(s)));

  const renderOrgNode = (staff, badgeColor = 'rose') => (
    <div 
      key={staff.id} 
      className="bg-white rounded-2xl border-2 border-slate-200 hover:border-rose-500 shadow-sm hover:shadow-xl transition-all duration-300 p-4 w-72 flex flex-col justify-between shrink-0 group relative"
    >
      {/* Clickable Header & Profile Trigger */}
      <div 
        onClick={() => onViewDetail(staff)}
        className="flex items-start gap-3 cursor-pointer select-none"
        title={`Klik untuk melihat profil lengkap ${staff.name}`}
      >
        <div className="relative shrink-0">
          <img
            src={staff.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
            alt={staff.name}
            className="w-12 h-12 rounded-xl object-cover border border-rose-400 group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" title="Aktif"></div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 text-xs leading-snug truncate group-hover:text-rose-600 transition-colors flex items-center gap-1">
            <span>{staff.name}</span>
          </h4>
          <p className="text-[11px] font-semibold text-rose-700 mt-0.5 truncate">
            {staff.role}
          </p>
          <span className="inline-block px-1.5 py-0.5 text-[9px] font-mono bg-slate-100 text-slate-600 rounded mt-1">
            {staff.bureau.replace('Kantor Pusat (', '').replace(')', '').replace('Biro ', '')}
          </span>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          {staff.ukwLevel || 'Belum UKW'}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(staff);
            }}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            title="Lihat Profil Lengkap"
          >
            <Eye className="w-3.5 h-3.5 text-rose-500" />
            <span>Profil</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewIdCard(staff);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Buka KTA Digital"
          >
            <CreditCard className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl mb-8 overflow-x-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-700/80 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Users className="w-3.5 h-3.5" />
          Hierarki Redaksi Jarrakpos Media
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Bagan Struktur Organisasi Dewan Redaksi
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Klik pada nama atau foto anggota untuk membuka berkas profil &amp; dossier lengkap personil.
        </p>
      </div>

      <div className="min-w-[850px] flex flex-col items-center gap-10">
        
        {/* Tier 1: Dewan Pembina & Penasehat */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-extrabold tracking-widest text-amber-400 uppercase mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Tingkat I: Dewan Pembina & Dewan Penasehat
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {level1.map(staff => renderOrgNode(staff, 'amber'))}
          </div>
        </div>

        <ChevronDown className="w-6 h-6 text-rose-500 animate-bounce" />

        {/* Tier 2: Pemimpin Redaksi */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-extrabold tracking-widest text-rose-400 uppercase mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            Tingkat II: Pemimpin Redaksi & Wakil Pemred (Penanggung Jawab)
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {level2.map(staff => renderOrgNode(staff, 'rose'))}
          </div>
        </div>

        <ChevronDown className="w-6 h-6 text-rose-500 animate-bounce" />

        {/* Tier 3: Redaktur Pelaksana */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-extrabold tracking-widest text-sky-400 uppercase mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            Tingkat III: Redaktur Pelaksana (Managing Editor)
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {level3.map(staff => renderOrgNode(staff, 'sky'))}
          </div>
        </div>

        <ChevronDown className="w-6 h-6 text-rose-500 animate-bounce" />

        {/* Tier 4: Redaktur Desk & Korlip */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-extrabold tracking-widest text-emerald-400 uppercase mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Tingkat IV: Redaktur Desk Rubrik & Koordinator Liputan
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {level4.map(staff => renderOrgNode(staff, 'emerald'))}
          </div>
        </div>

        <ChevronDown className="w-6 h-6 text-rose-500 animate-bounce" />

        {/* Tier 5: Jurnalis Lapangan, Multimedia, Staf */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-extrabold tracking-widest text-indigo-400 uppercase mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            Tingkat V: Wartawan / Reporter Biro, Multimedia, IT & Keuangan
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {level5.map(staff => renderOrgNode(staff, 'indigo'))}
          </div>
        </div>

      </div>
    </div>
  );
}
