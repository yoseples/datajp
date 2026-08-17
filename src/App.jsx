import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { 
  MEDIA_PLATFORMS, 
  INITIAL_JARRAKPOSTV_STAFF, 
  INITIAL_JARRAKPODCAST_STAFF 
} from './data/mediaPlatforms';
import { INITIAL_STAFF } from './data/initialData';
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
import KtaExpiryModal from './components/KtaExpiryModal';
import MediaHubSelector from './components/MediaHubSelector';
import LoginPage, { SYSTEM_ROLES } from './components/LoginPage';
import WartawanPortal from './components/WartawanPortal';
import ScrollToTop from './components/ScrollToTop';
import logoJarrakpos from './assets/logo-jarrakpos.png';
import { 
  Building2, 
  Globe, 
  Tv,
  Mic,
  ShieldCheck, 
  Users, 
  Sparkles, 
  Database,
  Cloud,
  AlertCircle,
  Plus,
  ArrowLeft,
  LayoutGrid
} from 'lucide-react';

const USER_STORAGE_KEY = 'JARRAKPOS_AUTH_USER_V1';
const SELECTED_PLATFORM_KEY = 'JARRAKPOS_ACTIVE_PLATFORM_V1';

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

  // Active Media Platform State: 'hub' | 'jarrakpos' | 'jarrakpostv' | 'jarrakpodcast'
  const [currentPlatform, setCurrentPlatform] = useState(() => {
    return localStorage.getItem(SELECTED_PLATFORM_KEY) || 'hub';
  });

  // Master State per platform
  const [platformData, setPlatformData] = useState(() => {
    // Load each platform's stored staff
    const loadPlatform = (key, initial) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initial;
      } catch {
        return initial;
      }
    };

    return {
      jarrakpos: getStoredStaff(),
      jarrakpostv: loadPlatform(MEDIA_PLATFORMS.JARRAKPOSTV.storageKey, INITIAL_JARRAKPOSTV_STAFF),
      jarrakpodcast: loadPlatform(MEDIA_PLATFORMS.JARRAKPODCAST.storageKey, INITIAL_JARRAKPODCAST_STAFF)
    };
  });

  const activeStaffList = useMemo(() => {
    if (currentPlatform === 'jarrakpostv') return platformData.jarrakpostv;
    if (currentPlatform === 'jarrakpodcast') return platformData.jarrakpodcast;
    return platformData.jarrakpos;
  }, [platformData, currentPlatform]);

  const [activeView, setActiveView] = useState('orgchart'); // 'orgchart' | 'table' | 'grid'
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
  const [isExpiryModalOpen, setIsExpiryModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Close all modals & return cleanly to home
  const returnToHome = useCallback(() => {
    setIsFormModalOpen(false);
    setIsDetailModalOpen(false);
    setIsIdCardModalOpen(false);
    setIsVerifyModalOpen(false);
    setIsSupabaseModalOpen(false);
    setIsExpiryModalOpen(false);
    setSelectedStaffForDetail(null);
    setSelectedStaffForIdCard(null);
    setSelectedStaffForVerify(null);
    setEditingStaff(null);
  }, []);

  // Helper to open modal with browser history state
  const openModalWithHistory = (setter, staff = null, targetStaffSetter = null, modalName = 'modal') => {
    if (targetStaffSetter && staff) {
      targetStaffSetter(staff);
    }
    setter(true);
    window.history.pushState({ modal: modalName }, '');
  };

  // Listen to Browser Back Button (popstate event) -> Return to Home
  useEffect(() => {
    const handlePopState = (e) => {
      returnToHome();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [returnToHome]);

  // Check current user role
  const isDeveloper = currentUser?.role === SYSTEM_ROLES.DEVELOPER;
  const isAdmin = currentUser?.role === SYSTEM_ROLES.ADMIN || isDeveloper;
  const isWartawan = currentUser?.role === SYSTEM_ROLES.WARTAWAN;

  // Protect Wartawan role: Disable Right Click & Print/Save Shortcuts
  useEffect(() => {
    if (isWartawan) {
      const disableContextMenu = (e) => e.preventDefault();
      const disableKeyShortcuts = (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'u')) {
          e.preventDefault();
        }
      };
      window.addEventListener('contextmenu', disableContextMenu);
      window.addEventListener('keydown', disableKeyShortcuts);
      return () => {
        window.removeEventListener('contextmenu', disableContextMenu);
        window.removeEventListener('keydown', disableKeyShortcuts);
      };
    }
  }, [isWartawan]);

  // Handle Platform Switch
  const handleSelectPlatform = (platformId) => {
    setCurrentPlatform(platformId);
    localStorage.setItem(SELECTED_PLATFORM_KEY, platformId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Beralih ke Portal Redaksi: ${MEDIA_PLATFORMS[platformId.toUpperCase()]?.name}`);
  };

  // Find Wartawan's own profile
  const myStaffProfile = useMemo(() => {
    if (!currentUser) return null;
    return activeStaffList.find(
      s => (currentUser.staffId && s.id === currentUser.staffId) ||
           (currentUser.email && s.email && s.email.toLowerCase() === currentUser.email.toLowerCase()) ||
           (currentUser.name && s.name.toLowerCase().includes(currentUser.name.toLowerCase()))
    ) || activeStaffList[0];
  }, [currentUser, activeStaffList]);

  // Expiring KTA list for active platform
  const expiringStaffList = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return activeStaffList.filter(s => {
      if (!s.ktaExpiry) return false;
      const expYear = parseInt(s.ktaExpiry.slice(0, 4));
      return expYear <= currentYear + 1;
    });
  }, [activeStaffList]);

  // Auth Handlers
  const handleLoginSuccess = (user, remember) => {
    setCurrentUser(user);
    setCurrentPlatform('hub'); // Take user to Media Hub Selector after login
    localStorage.setItem(SELECTED_PLATFORM_KEY, 'hub');
    if (remember) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast(`Selamat datang, ${user.name}! Silakan pilih platform media.`);
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda ingin keluar dari sistem Bank Data Jarrakpos?')) {
      setCurrentUser(null);
      setCurrentPlatform('hub');
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(SELECTED_PLATFORM_KEY);
      returnToHome();
      showToast('Anda telah keluar dari sistem.', 'info');
    }
  };

  // Filter logic for Admin & Developer
  const filteredStaff = useMemo(() => {
    return activeStaffList.filter((staff) => {
      if (selectedDivision !== 'Semua Divisi' && staff.division !== selectedDivision) return false;
      if (selectedBureau !== 'Semua Biro' && staff.bureau !== selectedBureau) return false;
      if (selectedUkw !== 'Semua UKW' && staff.ukwLevel !== selectedUkw) return false;
      if (selectedStatus !== 'Semua Status' && staff.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = staff.name?.toLowerCase().includes(q);
        const matchRole = staff.role?.toLowerCase().includes(q);
        const matchNip = staff.nip?.toLowerCase().includes(q);
        const matchBureau = staff.bureau?.toLowerCase().includes(q);
        const matchUkw = staff.ukwNumber?.toLowerCase().includes(q);
        if (!matchName && !matchRole && !matchNip && !matchBureau && !matchUkw) return false;
      }
      return true;
    });
  }, [activeStaffList, selectedDivision, selectedBureau, selectedUkw, selectedStatus, searchQuery]);

  // Handlers per platform
  const handleSaveStaff = async (staffData) => {
    const pKey = currentPlatform === 'jarrakpostv' ? 'jarrakpostv' : currentPlatform === 'jarrakpodcast' ? 'jarrakpodcast' : 'jarrakpos';
    const list = platformData[pKey];
    let updated;
    const exists = list.some(s => s.id === staffData.id);
    
    if (exists) {
      updated = list.map(s => s.id === staffData.id ? staffData : s);
      showToast(`Data "${staffData.name}" berhasil diperbarui!`);
    } else {
      updated = [staffData, ...list];
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      showToast(`Anggota redaksi "${staffData.name}" berhasil ditambahkan!`);
    }
    
    setPlatformData(prev => ({ ...prev, [pKey]: updated }));
    
    // Save to respective localStorage
    const storageKey = MEDIA_PLATFORMS[pKey.toUpperCase()]?.storageKey || 'JARRAKPOS_STAFF_DATABASE_V2_OFFICIAL';
    localStorage.setItem(storageKey, JSON.stringify(updated));

    if (pKey === 'jarrakpos' && isSupabaseActive) {
      try {
        await saveStaffToSupabase(staffData);
      } catch (err) {
        console.error('Failed to sync save to Supabase:', err);
      }
    }
  };

  const handleRenewKta = async (staff) => {
    const updatedStaff = {
      ...staff,
      ktaExpiry: '2029-12-31',
      status: 'Aktif'
    };
    await handleSaveStaff(updatedStaff);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    showToast(`KTA "${staff.name}" berhasil diperpanjang hingga 31 Desember 2029!`);
  };

  const handleDeleteStaff = async (id) => {
    if (!isAdmin) {
      alert('Hanya Admin dan Developer yang memiliki hak menghapus data!');
      return;
    }

    const pKey = currentPlatform === 'jarrakpostv' ? 'jarrakpostv' : currentPlatform === 'jarrakpodcast' ? 'jarrakpodcast' : 'jarrakpos';
    const list = platformData[pKey];
    const target = list.find(s => s.id === id);
    if (!target) return;
    if (confirm(`Apakah Anda yakin ingin menghapus "${target.name}" dari database redaksi ${MEDIA_PLATFORMS[pKey.toUpperCase()]?.name}?`)) {
      const updated = list.filter(s => s.id !== id);
      setPlatformData(prev => ({ ...prev, [pKey]: updated }));
      
      const storageKey = MEDIA_PLATFORMS[pKey.toUpperCase()]?.storageKey || 'JARRAKPOS_STAFF_DATABASE_V2_OFFICIAL';
      localStorage.setItem(storageKey, JSON.stringify(updated));
      showToast(`"${target.name}" telah dihapus.`, 'info');
    }
  };

  const handleResetData = () => {
    if (!isDeveloper) {
      alert('Hanya Developer yang dapat mereset database master!');
      return;
    }
    const pKey = currentPlatform === 'jarrakpostv' ? 'jarrakpostv' : currentPlatform === 'jarrakpodcast' ? 'jarrakpodcast' : 'jarrakpos';
    let freshData = INITIAL_STAFF;
    if (pKey === 'jarrakpostv') freshData = INITIAL_JARRAKPOSTV_STAFF;
    if (pKey === 'jarrakpodcast') freshData = INITIAL_JARRAKPODCAST_STAFF;

    setPlatformData(prev => ({ ...prev, [pKey]: freshData }));
    const storageKey = MEDIA_PLATFORMS[pKey.toUpperCase()]?.storageKey || 'JARRAKPOS_STAFF_DATABASE_V2_OFFICIAL';
    localStorage.setItem(storageKey, JSON.stringify(freshData));
    showToast(`Database ${MEDIA_PLATFORMS[pKey.toUpperCase()]?.name} berhasil direset.`);
  };

  const handleImportData = (newData) => {
    if (!isDeveloper) {
      alert('Hanya Developer yang dapat mengimpor database JSON mentah!');
      return;
    }
    const pKey = currentPlatform === 'jarrakpostv' ? 'jarrakpostv' : currentPlatform === 'jarrakpodcast' ? 'jarrakpodcast' : 'jarrakpos';
    setPlatformData(prev => ({ ...prev, [pKey]: newData }));
    const storageKey = MEDIA_PLATFORMS[pKey.toUpperCase()]?.storageKey || 'JARRAKPOS_STAFF_DATABASE_V2_OFFICIAL';
    localStorage.setItem(storageKey, JSON.stringify(newData));
    showToast(`Berhasil mengimpor ${newData.length} data personil!`);
  };

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    openModalWithHistory(setIsFormModalOpen, null, null, 'add-staff');
  };

  const handleOpenEditModal = (staff) => {
    setEditingStaff(staff);
    openModalWithHistory(setIsFormModalOpen, staff, setEditingStaff, 'edit-staff');
  };

  const handleOpenDetailModal = (staff) => {
    openModalWithHistory(setIsDetailModalOpen, staff, setSelectedStaffForDetail, 'staff-detail');
  };

  const handleOpenIdCardModal = (staff) => {
    openModalWithHistory(setIsIdCardModalOpen, staff, setSelectedStaffForIdCard, 'staff-idcard');
  };

  const handleOpenVerifyModal = (staff = null) => {
    openModalWithHistory(setIsVerifyModalOpen, staff || myStaffProfile || activeStaffList[0], setSelectedStaffForVerify, 'verify-qr');
  };

  const handleOpenSupabaseModal = () => {
    openModalWithHistory(setIsSupabaseModalOpen, null, null, 'supabase-config');
  };

  const handleOpenExpiryModal = () => {
    openModalWithHistory(setIsExpiryModalOpen, null, null, 'kta-expiry');
  };

  // 1. IF NOT LOGGED IN -> Show LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} allStaff={activeStaffList} />;
  }

  // 2. IF ON MEDIA HUB -> Show MediaHubSelector (Selection of Jarrakpos.com, JarrakposTV, Jarrak Podcast)
  if (currentPlatform === 'hub') {
    return (
      <MediaHubSelector
        currentUser={currentUser}
        onSelectPlatform={handleSelectPlatform}
        onLogout={handleLogout}
        platformStaffCounts={{
          jarrakpos: platformData.jarrakpos.length,
          jarrakpostv: platformData.jarrakpostv.length,
          jarrakpodcast: platformData.jarrakpodcast.length
        }}
      />
    );
  }

  const activePlatformInfo = MEDIA_PLATFORMS[currentPlatform.toUpperCase()] || MEDIA_PLATFORMS.JARRAKPOS;

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

      {/* Main Navbar with Media Platform Switcher */}
      <Navbar
        currentUser={currentUser}
        currentPlatform={currentPlatform}
        onSwitchPlatform={handleSelectPlatform}
        onOpenHub={() => setCurrentPlatform('hub')}
        onLogout={handleLogout}
        staffList={activeStaffList}
        onOpenAddModal={handleOpenAddModal}
        onResetData={handleResetData}
        onImportData={handleImportData}
        onOpenVerifyModal={handleOpenVerifyModal}
        onOpenSupabaseModal={handleOpenSupabaseModal}
        onOpenMyIdCard={() => handleOpenIdCardModal(myStaffProfile)}
        isSupabaseActive={isSupabaseActive}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* ============================================================================== */}
        {/* CASE 1: ROLE WARTAWAN -> HANYA MELIHAT & MENGELOLA PROFILNYA SENDIRI */}
        {/* ============================================================================== */}
        {isWartawan ? (
          <WartawanPortal
            staff={myStaffProfile}
            onOpenIdCard={handleOpenIdCardModal}
            onOpenVerify={handleOpenVerifyModal}
            onEditProfile={handleOpenEditModal}
          />
        ) : (
          /* ============================================================================== */
          /* CASE 2: ROLE ADMIN & DEVELOPER -> FULL ACCESS KE BAGAN, TABEL & KARTU */
          /* ============================================================================== */
          <>
            {/* Hero Section Banner with Platform Switcher Pill */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 p-6 sm:p-8 text-white shadow-xl mb-8 border border-slate-800">
              <div className="relative z-10 max-w-3xl">
                
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <button
                    onClick={() => setCurrentPlatform('hub')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-300 text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Ganti Platform Media</span>
                  </button>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {activePlatformInfo.badge}
                  </div>
                  
                  {isDeveloper && currentPlatform === 'jarrakpos' && (
                    <div 
                      onClick={handleOpenSupabaseModal}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                        isSupabaseActive
                          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900'
                          : 'bg-amber-950/80 border-amber-500/50 text-amber-300 hover:bg-amber-900'
                      }`}
                    >
                      <Database className="w-3 h-3" />
                      <span>{isSupabaseActive ? 'Cloud Supabase Aktif' : 'Penyimpanan Lokal (Klik Setup Supabase)'}</span>
                    </div>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight flex items-center gap-3">
                  <span>{activePlatformInfo.name}</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {activePlatformInfo.description}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-rose-900/40 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Redaksi {activePlatformInfo.name}
                </button>
                <button
                  onClick={() => handleOpenVerifyModal(null)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl border border-slate-700 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verifikasi QR Kartu Pers
                </button>
                <button
                  onClick={() => setCurrentPlatform('hub')}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl border border-slate-700 transition-all"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Pilih Platform Lain</span>
                </button>
              </div>

              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            </div>

            {/* Dashboard Metric Statistics */}
            <DashboardStats 
              staffList={activeStaffList} 
              onOpenExpiryModal={handleOpenExpiryModal}
            />

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
                {/* View 1: Bagan Struktur Redaksi (Default) */}
                {activeView === 'orgchart' && (
                  <OrgChart
                    staffList={filteredStaff}
                    onViewDetail={handleOpenDetailModal}
                    onViewIdCard={handleOpenIdCardModal}
                  />
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

                {/* View 3: Card Grid */}
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
              </>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-white py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-3.5">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white p-1 shadow-glow border border-rose-500/40 shrink-0">
                <img
                  src={logoJarrakpos}
                  alt="Jarrakpos Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  JARRAK<span className="text-rose-500">POS</span>.COM - PT JARRAK POS MEDIA NUSANTARA
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kantor Pusat: Jalan Danau Tempe No. 30, Desa Sanur Kauh, Denpasar Selatan, Denpasar, Bali 80227
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>Telp: <strong className="text-rose-400">(0361) 4481522</strong></span>
                  <span>•</span>
                  <span>Email: <strong className="text-slate-300">admin@jarrakpos.com</strong></span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 text-center md:text-right">
              <p>© {new Date().getFullYear()} Jarrakpos.com. All Rights Reserved.</p>
              <p className="mt-0.5">Sistem Database Redaksi</p>
            </div>

          </div>
        </div>
      </footer>

      {/* Modals with Clean Return to Home on Close */}
      <StaffFormModal
        isOpen={isFormModalOpen}
        onClose={returnToHome}
        onSave={handleSaveStaff}
        initialData={editingStaff}
      />

      <StaffDetailModal
        staff={selectedStaffForDetail}
        isOpen={isDetailModalOpen}
        onClose={returnToHome}
        onOpenIdCard={handleOpenIdCardModal}
        onOpenVerify={handleOpenVerifyModal}
        onEdit={handleOpenEditModal}
        allPlatformData={platformData}
      />

      <IdCardModal
        staff={selectedStaffForIdCard}
        isOpen={isIdCardModalOpen}
        onClose={returnToHome}
        onVerify={handleOpenVerifyModal}
        canDownload={isAdmin}
        currentPlatform={currentPlatform}
      />

      <PublicVerifyModal
        staff={selectedStaffForVerify}
        allStaff={activeStaffList}
        isOpen={isVerifyModalOpen}
        onClose={returnToHome}
        onSelectStaff={(s) => setSelectedStaffForVerify(s)}
      />

      <KtaExpiryModal
        isOpen={isExpiryModalOpen}
        onClose={returnToHome}
        expiringStaffList={expiringStaffList}
        onRenewKta={handleRenewKta}
        onOpenIdCard={handleOpenIdCardModal}
        onEditStaff={handleOpenEditModal}
      />

      {isDeveloper && (
        <SupabaseModal
          isOpen={isSupabaseModalOpen}
          onClose={returnToHome}
          staffList={activeStaffList}
          onSupabaseConfigured={loadDatabase}
        />
      )}

      {/* Floating Scroll to Top Button */}
      <ScrollToTop />

    </div>
  );
}
