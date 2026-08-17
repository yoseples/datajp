import { createClient } from '@supabase/supabase-js';
import { INITIAL_STAFF } from '../data/initialData';

const CONFIG_KEY = 'JARRAKPOS_SUPABASE_CONFIG_V1';

// Get current credentials from env or runtime localStorage
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey) {
    return { url: envUrl, key: envKey, source: 'env' };
  }

  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.key) {
        return { ...parsed, source: 'storage' };
      }
    }
  } catch (err) {
    console.error('Error reading Supabase config:', err);
  }

  return { url: '', key: '', source: 'none' };
};

export const saveSupabaseConfig = (url, key) => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify({ url: url.trim(), key: key.trim() }));
  } catch (err) {
    console.error('Error saving Supabase config:', err);
  }
};

export const clearSupabaseConfig = () => {
  try {
    localStorage.removeItem(CONFIG_KEY);
  } catch (err) {
    console.error('Error clearing Supabase config:', err);
  }
};

// Initialize client instance
let supabaseInstance = null;

export const getSupabaseClient = () => {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;

  if (!supabaseInstance || supabaseInstance.supabaseUrl !== url) {
    try {
      supabaseInstance = createClient(url, key);
    } catch (err) {
      console.error('Failed to create Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
};

// Map DB row (snake_case) to Frontend model (camelCase)
export const mapRowToStaff = (row) => ({
  id: row.id,
  name: row.name,
  role: row.role,
  division: row.division,
  bureau: row.bureau,
  hierarchyLevel: row.hierarchy_level || 5,
  nip: row.nip || '',
  email: row.email || '',
  phone: row.phone || '',
  ukwLevel: row.ukw_level || 'Belum UKW',
  ukwNumber: row.ukw_number || '-',
  status: row.status || 'Aktif',
  joinDate: row.join_date || '',
  ktaExpiry: row.kta_expiry || '2028-12-31',
  photoUrl: row.photo_url || '',
  address: row.address || '',
  bio: row.bio || '',
  emergencyContact: row.emergency_contact || '',
  bloodType: row.blood_type || 'O',
  notes: row.notes || ''
});

// Map Frontend model (camelCase) to DB row (snake_case)
export const mapStaffToRow = (staff) => ({
  id: staff.id,
  name: staff.name,
  role: staff.role,
  division: staff.division,
  bureau: staff.bureau,
  hierarchy_level: staff.hierarchyLevel || 5,
  nip: staff.nip || '',
  email: staff.email || '',
  phone: staff.phone || '',
  ukw_level: staff.ukwLevel || 'Belum UKW',
  ukw_number: staff.ukwNumber || '-',
  status: staff.status || 'Aktif',
  join_date: staff.joinDate || new Date().toISOString().slice(0, 10),
  kta_expiry: staff.ktaExpiry || '2028-12-31',
  photo_url: staff.photoUrl || '',
  address: staff.address || '',
  bio: staff.bio || '',
  emergency_contact: staff.emergencyContact || '',
  blood_type: staff.bloodType || 'O',
  notes: staff.notes || ''
});

// Fetch all staff from Supabase
export const fetchStaffFromSupabase = async () => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client belum dikonfigurasi!');

  const { data, error } = await client
    .from('staff_jarrakpos')
    .select('*')
    .order('hierarchy_level', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapRowToStaff);
};

// Save single staff (Insert or Update)
export const saveStaffToSupabase = async (staff) => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client belum dikonfigurasi!');

  const row = mapStaffToRow(staff);
  const { data, error } = await client
    .from('staff_jarrakpos')
    .upsert(row)
    .select();

  if (error) throw error;
  return data?.[0] ? mapRowToStaff(data[0]) : staff;
};

// Delete staff from Supabase
export const deleteStaffFromSupabase = async (id) => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client belum dikonfigurasi!');

  const { error } = await client
    .from('staff_jarrakpos')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

// Bulk Sync / Seed all data to Supabase
export const syncAllStaffToSupabase = async (staffList) => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client belum dikonfigurasi!');

  const rows = staffList.map(mapStaffToRow);
  const { data, error } = await client
    .from('staff_jarrakpos')
    .upsert(rows, { onConflict: 'id' });

  if (error) throw error;
  return true;
};

// Test Connection
export const testSupabaseConnection = async (testUrl, testKey) => {
  try {
    const tempClient = createClient(testUrl.trim(), testKey.trim());
    const { data, error } = await tempClient
      .from('staff_jarrakpos')
      .select('id')
      .limit(1);

    if (error) {
      // If table doesn't exist yet, it's still a valid connection to Supabase
      if (error.code === '42P01') {
        return { success: true, message: 'Terhubung ke Supabase! (Tabel staff_jarrakpos belum dibuat, silakan jalankan SQL Skema)' };
      }
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Koneksi Supabase Berhasil & Tabel staff_jarrakpos Aktif!' };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
