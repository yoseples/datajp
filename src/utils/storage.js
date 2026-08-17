import { INITIAL_STAFF } from '../data/initialData';

const STORAGE_KEY = 'JARRAKPOS_STAFF_DATABASE_V2_OFFICIAL';

export const getStoredStaff = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STAFF));
      return INITIAL_STAFF;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STAFF;
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return INITIAL_STAFF;
  }
};

export const saveStoredStaff = (staffList) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staffList));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
};

export const resetToInitialStaff = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STAFF));
    return INITIAL_STAFF;
  } catch (err) {
    console.error('Error resetting database:', err);
    return INITIAL_STAFF;
  }
};

// Export to CSV
export const exportToCSV = (staffList) => {
  const headers = [
    'ID',
    'NIP / No KTA',
    'Nama Lengkap',
    'Jabatan',
    'Divisi',
    'Biro / Wilayah',
    'Status UKW',
    'Nomor Sertifikat UKW',
    'Status Anggota',
    'Masa Berlaku KTA',
    'Tanggal Bergabung',
    'Email',
    'No Telepon/WA',
    'Alamat',
    'Kontak Darurat'
  ];

  const rows = staffList.map(s => [
    `"${s.id || ''}"`,
    `"${s.nip || ''}"`,
    `"${s.name || ''}"`,
    `"${s.role || ''}"`,
    `"${s.division || ''}"`,
    `"${s.bureau || ''}"`,
    `"${s.ukwLevel || ''}"`,
    `"${s.ukwNumber || ''}"`,
    `"${s.status || ''}"`,
    `"${s.ktaExpiry || ''}"`,
    `"${s.joinDate || ''}"`,
    `"${s.email || ''}"`,
    `"${s.phone || ''}"`,
    `"${(s.address || '').replace(/"/g, '""')}"`,
    `"${(s.emergencyContact || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Database_Dewan_Redaksi_Jarrakpos_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export JSON Backup
export const exportToJSON = (staffList) => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(staffList, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `Jarrakpos_Backup_DB_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
