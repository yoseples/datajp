import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  getStoredStaff, 
  saveStoredStaff, 
  resetToInitialStaff 
} from './utils/storage';
import {
  getSupabaseConfig,
  fetchStaffFromSupabase,
  saveStaffToSupabase,
  deleteStaffFromSupabase,
  syncAllStaffToSupabase
} from './utils/supabaseClient';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import StaffFilters from './components/StaffFilters';
import StaffCard from './components/StaffCard';
import StaffTable from './components/StaffTable';
import OrgChart from './components/OrgChart';
import StaffFormModal from './components/StaffFormModal';
import StaffDetailModal from './components/StaffDetailModal';
import IdCardModal from './components/IdCardModal';
import PublicVerifyModal from './components/PublicVerifyModal';
import SupabaseModal from './components/SupabaseModal';
import LoginPage from './components/LoginPage';
import { 
  Building2, 
  Globe, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Database,
  Cloud,
  AlertCircle,
  Plus
} from 'lucide-react';

const USER_STORAGE_KEY = 'JARRAKPOS_AUTH_USER_V1';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Master State
  const [staffList, setStaffList] = useState([]);
  const [activeView, setActiveView] = useState('grid'); // 'grid' | 'table' | 'orgchart'
  const [isSupabaseActive, setIsSupabaseActive] = useState(false);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);

  // Filter States
  const [selectedDivision, setSelectedDivision] = useState('Semua Divisi');
  const [selectedBureau, setSelectedBureau] = useState('Semua Biro');
  const [selectedUkw, setSelectedUkw] = useState('Semua UKW');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStaffForDetail, setSelectedStaffForDetail] = useState(null);

  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [selectedStaffForIdCard, setSelectedStaffForIdCard] = useState(null);

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedStaffForVerify, setSelectedStaffForVerify] = useState(null);

  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load Data from Supabase or LocalStorage
  const loadDatabase = async () => {
    const config = getSupabaseConfig();
    if (config.url && config.key) {
      setIsLoadingCloud(true);
      try {
        const cloudData = await fetchStaffFromSupabase();
        if (cloudData && cloudData.length > 0) {
          setStaffList(cloudData);
          saveStoredStaff(cloudData);
          setIsSupabaseActive(true);
          showToast(`Terhubung ke Supabase Cloud (${cloudData.length} data dimuat)`, 'success');
        } else {
          // Table empty, seed local data into Supabase
          const local = getStoredStaff();
          setStaffList(local);
          setIsSupabaseActive(true);
          await syncAllStaffToSupabase(local);
          showToast(`Supabase aktif: Otomatis sinkronisasi ${local.length} data redaksi ke cloud!`, 'success');
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local:', err);
        setIsSupabaseActive(false);
        setStaffList(getStoredStaff());
      } finally {
        setIsLoadingCloud(false);
      }
    } else {
      setIsSupabaseActive(false);
      setStaffList(getStoredStaff());
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Auth Handlers
  const handleLoginSuccess = (user, remember) => {
    setCurrentUser(user);
    if (remember) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast(`Selamat datang kembali, ${user.name}!`);
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda ingin keluar dari sistem Bank Data Jarrakpos?')) {
      setCurrentUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      showToast('Anda telah keluar dari sistem.', 'info');
    }
  };

  // Filter logic
  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      // Division filter
      if (selectedDivision !== 'Semua Divisi' && staff.division !== selectedDivision) {
        return false;
      }
      // Bureau filter
      if (selectedBureau !== 'Semua Biro' && staff.bureau !== selectedBureau) {
        return false;
      }
      // UKW filter
      if (selectedUkw !== 'Semua UKW' && staff.ukwLevel !== selectedUkw) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'Semua Status' && staff.status !== selectedStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = staff.name?.toLowerCase().includes(q);
        const matchRole = staff.role?.toLowerCase().includes(q);
        const matchNip = staff.nip?.toLowerCase().includes(q);
        const matchBureau = staff.bureau?.toLowerCase().includes(q);
        const matchUkw = staff.ukwNumber?.toLowerCase().includes(q);
        if (!matchName && !matchRole && !matchNip && !matchBureau && !matchUkw) {
          return false;
        }
      }
      return true;
    });
  }, [staffList, selectedDivision, selectedBureau, selectedUkw, selectedStatus, searchQuery]);

  // Handlers (Hybrid Supabase + Local)
  const handleSaveStaff = async (staffData) => {
    let updated;
    const exists = staffList.some(s => s.id === staffData.id);
    
    if (exists) {
      updated = staffList.map(s => s.id === staffData.id ? staffData : s);
      showToast(`Data "${staffData.name}" berhasil diperbarui!`);
    } else {
      updated = [staffData, ...staffList];
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      showToast(`Anggota redaksi "${staffData.name}" berhasil ditambahkan!`);
    }
    
    setStaffList(updated);
    saveStoredStaff(updated);

    // If Supabase active, save to cloud
    if (isSupabaseActive) {
      try {
        await saveStaffToSupabase(staffData);
      } catch (err) {
        console.error('Failed to sync save to Supabase:', err);
      }
    }
  };

  const handleDeleteStaff = async (id) => {
    const target = staffList.find(s => s.id === id);
    if (!target) return;
    if (confirm(`Apakah Anda yakin ingin menghapus "${target.name}" dari database redaksi?`)) {
      const updated = staffList.filter(s => s.id !== id);
      setStaffList(updated);
      saveStoredStaff(updated);
      showToast(`"${target.name}" telah dihapus dari database.`, 'info');

      if (isSupabaseActive) {
        try {
          await deleteStaffFromSupabase(id);
        } catch (err) {
          console.error('Failed to sync delete to Supabase:', err);
        }
      }
    }
  };

  const handleResetData = () => {
    const freshData = resetToInitialStaff();
    setStaffList(freshData);
    if (isSupabaseActive) {
      syncAllStaffToSupabase(freshData).catch(console.error);
    }
    showToast('Database berhasil direset ke data resmi Jarrakpos.');
  };

  const handleImportData = (newData) => {
    setStaffList(newData);
    saveStoredStaff(newData);
    if (isSupabaseActive) {
      syncAllStaffToSupabase(newData).catch(console.error);
    }
    showToast(`Berhasil mengimpor ${newData.length} data personil redaksi!`);
  };

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (staff) => {
    setEditingStaff(staff);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailModal = (staff) => {
    setSelectedStaffForDetail(staff);
    setIsDetailModalOpen(true);
  };

  const handleOpenIdCardModal = (staff) => {
    setSelectedStaffForIdCard(staff);
    setIsIdCardModalOpen(true);
  };

  const handleOpenVerifyModal = (staff = null) => {
    setSelectedStaffForVerify(staff || staffList[0]);
    setIsVerifyModalOpen(true);
  };

  // If user is not logged in, show LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col justify-between">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 text-xs sm:text-sm font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        staffList={staffList}
        onOpenAddModal={handleOpenAddModal}
        onResetData={handleResetData}
        onImportData={handleImportData}
        onOpenVerifyModal={handleOpenVerifyModal}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        isSupabaseActive={isSupabaseActive}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Hero Section Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 p-6 sm:p-8 text-white shadow-xl mb-8 border border-slate-800">
          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Sistem Bank Data Terpadu Jarrakpos
              </div>
              
              <div 
                onClick={() => setIsSupabaseModalOpen(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  isSupabaseActive
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900'
                    : 'bg-amber-950/80 border-amber-500/50 text-amber-300 hover:bg-amber-900'
                }`}
              >
                <Database className="w-3 h-3" />
                <span>{isSupabaseActive ? 'Cloud Supabase Aktif' : 'Penyimpanan Lokal (Klik untuk Setup Supabase)'}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Database Dewan Redaksi & Bank Data Wartawan
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Pusat inventarisasi resmi jajaran pimpinan redaksi, dewan penasehat, redaktur, wartawan biro daerah, serta sertifikasi kompetensi pers terintegrasi <strong>jarrakpos.com</strong>.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-rose-900/40 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Tambah Personil Redaksi
            </button>
            <button
              onClick={() => handleOpenVerifyModal(null)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl border border-slate-700 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verifikasi QR Kartu Pers
            </button>
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl border border-emerald-700/60 transition-all"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              Kelola Cloud Supabase
            </button>
          </div>

          {/* Decorative Red Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        </div>

        {/* Dashboard Metric Statistics */}
        <DashboardStats staffList={staffList} />

        {/* Filters and Search Bar */}
        <StaffFilters
          selectedDivision={selectedDivision}
          setSelectedDivision={setSelectedDivision}
          selectedBureau={selectedBureau}
          setSelectedBureau={setSelectedBureau}
          selectedUkw={selectedUkw}
          setSelectedUkw={setSelectedUkw}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeView={activeView}
          setActiveView={setActiveView}
          totalResults={filteredStaff.length}
        />

        {/* Dynamic Main View */}
        {filteredStaff.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm max-w-lg mx-auto my-10">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Tidak Ada Data Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tidak ada anggota redaksi yang sesuai dengan filter atau kata kunci pencarian.
            </p>
            <button
              onClick={() => {
                setSelectedDivision('Semua Divisi');
                setSelectedBureau('Semua Biro');
                setSelectedUkw('Semua UKW');
                setSelectedStatus('Semua Status');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <>
            {/* View 1: Card Grid */}
            {activeView === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-12">
                {filteredStaff.map((staff) => (
                  <StaffCard
                    key={staff.id}
                    staff={staff}
                    onViewDetail={handleOpenDetailModal}
                    onViewIdCard={handleOpenIdCardModal}
                    onVerify={handleOpenVerifyModal}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteStaff}
                  />
                ))}
              </div>
            )}

            {/* View 2: Table */}
            {activeView === 'table' && (
              <StaffTable
                staffList={filteredStaff}
                onViewDetail={handleOpenDetailModal}
                onViewIdCard={handleOpenIdCardModal}
                onVerify={handleOpenVerifyModal}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteStaff}
              />
            )}

            {/* View 3: Org Chart */}
            {activeView === 'orgchart' && (
              <OrgChart
                staffList={filteredStaff}
                onViewDetail={handleOpenDetailModal}
                onViewIdCard={handleOpenIdCardModal}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-white py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-600 text-white font-extrabold text-lg">
                JP
              </div>
              <div>
                <div className="font-bold text-sm tracking-tight text-white">
                  JARRAKPOS.COM - PT JARRAK POS MEDIA NUSANTARA
                </div>
                <p className="text-xs text-slate-400">
                  Kantor Pusat: Jl. Hayam Wuruk No. 88, Denpasar, Bali | Biro Jakarta, Surabaya, Medan, IKN
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 text-center md:text-right">
              <p>© {new Date().getFullYear()} Jarrakpos.com. All Rights Reserved.</p>
              <p className="mt-0.5">Sistem Database Dewan Redaksi, Wartawan & Bank Data Karyawan.</p>
            </div>

          </div>
        </div>
      </footer>

      {/* Modals */}
      <StaffFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveStaff}
        initialData={editingStaff}
      />

      <StaffDetailModal
        staff={selectedStaffForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onOpenIdCard={handleOpenIdCardModal}
        onOpenVerify={handleOpenVerifyModal}
        onEdit={handleOpenEditModal}
      />

      <IdCardModal
        staff={selectedStaffForIdCard}
        isOpen={isIdCardModalOpen}
        onClose={() => setIsIdCardModalOpen(false)}
        onVerify={handleOpenVerifyModal}
      />

      <PublicVerifyModal
        staff={selectedStaffForVerify}
        allStaff={staffList}
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onSelectStaff={(s) => setSelectedStaffForVerify(s)}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        staffList={staffList}
        onSupabaseConfigured={loadDatabase}
      />

    </div>
  );
}
