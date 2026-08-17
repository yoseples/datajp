import React from 'react';
import { 
  Filter, 
  LayoutGrid, 
  Table, 
  GitFork, 
  MapPin, 
  Award, 
  Search,
  CheckCircle,
  SlidersHorizontal
} from 'lucide-react';
import { INITIAL_DIVISIONS, REGIONAL_BUREAUS, UKW_LEVELS } from '../data/initialData';

export default function StaffFilters({
  staffList = [],
  selectedDivision,
  setSelectedDivision,
  selectedBureau,
  setSelectedBureau,
  selectedUkw,
  setSelectedUkw,
  selectedStatus,
  setSelectedStatus,
  searchQuery,
  setSearchQuery,
  activeView,
  setActiveView,
  totalResults
}) {
  // Dynamically compute divisions from active staff list
  const availableDivisions = React.useMemo(() => {
    const list = Array.from(new Set(staffList.map(s => s.division))).filter(Boolean);
    return ['Semua Divisi', ...list];
  }, [staffList]);

  // Dynamically compute bureaus from active staff list
  const availableBureaus = React.useMemo(() => {
    const list = Array.from(new Set(staffList.map(s => s.bureau))).filter(Boolean);
    return ['Semua Biro', ...list];
  }, [staffList]);
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 mb-6">
      
      {/* Top Bar: View Switcher (OrgChart First, Table Second, Grid Third) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start overflow-x-auto">
          {/* Bagan Struktur Redaksi (Pertama) */}
          <button
            onClick={() => setActiveView('orgchart')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeView === 'orgchart'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            Bagan Struktur Redaksi
          </button>

          {/* Tabel Data */}
          <button
            onClick={() => setActiveView('table')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeView === 'table'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-blue-600" />
            Tabel Data
          </button>

          {/* Kartu Grid (Posisi Akhir) */}
          <button
            onClick={() => setActiveView('grid')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeView === 'grid'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-slate-600" />
            Kartu Grid
          </button>
        </div>

        {/* Results Counter & Reset Filter */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="font-semibold text-slate-600">
            Ditemukan: <span className="text-rose-600 font-bold">{totalResults}</span> personil
          </span>

          {(selectedDivision !== 'Semua Divisi' || 
            selectedBureau !== 'Semua Biro' || 
            selectedUkw !== 'Semua UKW' || 
            selectedStatus !== 'Semua Status' || 
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedDivision('Semua Divisi');
                setSelectedBureau('Semua Biro');
                setSelectedUkw('Semua UKW');
                setSelectedStatus('Semua Status');
                setSearchQuery('');
              }}
              className="text-rose-600 hover:text-rose-700 font-semibold underline text-xs"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Division Category Pills (Horizontal Scroll) */}
      <div className="pt-4 pb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {availableDivisions.map((div) => {
          const isSelected = selectedDivision === div;
          return (
            <button
              key={div}
              onClick={() => setSelectedDivision(div)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              {div}
            </button>
          );
        })}
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        
        {/* Biro Filter */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-sky-500" /> Biro / Wilayah
          </label>
          <select
            value={selectedBureau}
            onChange={(e) => setSelectedBureau(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
          >
            {availableBureaus.map((bureau) => (
              <option key={bureau} value={bureau}>{bureau}</option>
            ))}
          </select>
        </div>

        {/* UKW Filter */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-500" /> Jenjang UKW (Dewan Pers)
          </label>
          <select
            value={selectedUkw}
            onChange={(e) => setSelectedUkw(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
          >
            <option value="Semua UKW">Semua Tingkat UKW</option>
            {UKW_LEVELS.map((ukw) => (
              <option key={ukw} value={ukw}>{ukw}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-500" /> Status Keanggotaan
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Cuti / Non-Aktif">Cuti / Non-Aktif</option>
            <option value="Alumni / Purna Tugas">Alumni / Purna Tugas</option>
          </select>
        </div>

        {/* Search Field (Mobile / Extra) */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Search className="w-3 h-3 text-rose-500" /> Cari Kata Kunci
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ketik nama / NIP / nomor UKW..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
          />
        </div>

      </div>

    </div>
  );
}
