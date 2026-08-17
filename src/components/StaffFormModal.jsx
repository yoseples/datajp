import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  User, 
  MapPin, 
  Award, 
  Briefcase, 
  Phone, 
  Mail, 
  Calendar, 
  FileText,
  Image as ImageIcon,
  Shield
} from 'lucide-react';
import { INITIAL_DIVISIONS, REGIONAL_BUREAUS, UKW_LEVELS } from '../data/initialData';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
];

export default function StaffFormModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    role: '',
    division: 'Jurnalis / Wartawan',
    bureau: 'Kantor Pusat (Denpasar - Bali)',
    hierarchyLevel: 5,
    nip: '',
    email: '',
    phone: '',
    ukwLevel: 'Wartawan Muda',
    ukwNumber: '',
    status: 'Aktif',
    joinDate: new Date().toISOString().slice(0, 10),
    ktaExpiry: '2028-12-31',
    photoUrl: SAMPLE_AVATARS[0],
    address: '',
    bio: '',
    emergencyContact: '',
    bloodType: 'O',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const randomId = 'JP-STAFF-' + Math.floor(1000 + Math.random() * 9000);
      setFormData({
        id: randomId,
        name: '',
        role: '',
        division: 'Jurnalis / Wartawan',
        bureau: 'Kantor Pusat (Denpasar - Bali)',
        hierarchyLevel: 5,
        nip: 'JP-PERS-' + Math.floor(100000 + Math.random() * 900000),
        email: '',
        phone: '',
        ukwLevel: 'Wartawan Muda',
        ukwNumber: '',
        status: 'Aktif',
        joinDate: new Date().toISOString().slice(0, 10),
        ktaExpiry: '2028-12-31',
        photoUrl: SAMPLE_AVATARS[Math.floor(Math.random() * SAMPLE_AVATARS.length)],
        address: '',
        bio: '',
        emergencyContact: '',
        bloodType: 'O',
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto adjust hierarchy level based on division
    let hierarchyLevel = formData.hierarchyLevel;
    if (name === 'division') {
      if (value.includes('Pembina') || value.includes('Penasehat')) hierarchyLevel = 1;
      else if (value.includes('Pimpinan Redaksi')) hierarchyLevel = 2;
      else if (value.includes('Redaktur Pelaksana')) hierarchyLevel = 3;
      else if (value.includes('Redaktur Desk') || value.includes('Koordinator')) hierarchyLevel = 4;
      else hierarchyLevel = 5;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'division' ? { hierarchyLevel } : {})
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      alert('Mohon isi Nama Lengkap dan Jabatan!');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 px-6 py-4 flex items-center justify-between text-white border-b border-rose-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-600/30 text-rose-400 border border-rose-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {initialData ? 'Edit Data Anggota Redaksi' : 'Tambah Anggota Dewan Redaksi / Staf'}
              </h3>
              <p className="text-xs text-slate-400">
                Lengkapi bank data keanggotaan pers Jarrakpos.com
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-6 text-xs sm:text-sm">
          
          {/* Section 1: Data Identitas Pokok */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Shield className="w-4 h-4 text-rose-600" />
              1. Identitas Anggota & Jabatan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: I Wayan Agus, S.H."
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan / Posisi Resmi *
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Contoh: Wartawan Daerah / Redpel"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Divisi / Departemen
                </label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  {INITIAL_DIVISIONS.filter(d => d !== 'Semua Divisi').map(div => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Biro / Wilayah Tugas
                </label>
                <select
                  name="bureau"
                  value={formData.bureau}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  {REGIONAL_BUREAUS.filter(b => b !== 'Semua Biro').map(bureau => (
                    <option key={bureau} value={bureau}>{bureau}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Induk Pers (NIP / No KTA)
                </label>
                <input
                  type="text"
                  name="nip"
                  value={formData.nip}
                  onChange={handleChange}
                  placeholder="JP-WR-202401"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Keanggotaan
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Cuti / Non-Aktif">Cuti / Non-Aktif</option>
                  <option value="Alumni / Purna Tugas">Alumni / Purna Tugas</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section 2: Legalitas & Dewan Pers */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Award className="w-4 h-4 text-amber-600" />
              2. Kompetensi & Masa Berlaku KTA
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenjang UKW (Dewan Pers)
                </label>
                <select
                  name="ukwLevel"
                  value={formData.ukwLevel}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800"
                >
                  {UKW_LEVELS.map(ukw => (
                    <option key={ukw} value={ukw}>{ukw}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Sertifikat UKW
                </label>
                <input
                  type="text"
                  name="ukwNumber"
                  value={formData.ukwNumber}
                  onChange={handleChange}
                  placeholder="DP-UKW-1234/PWI/2023"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Masa Berlaku KTA (S/D)
                </label>
                <input
                  type="date"
                  name="ktaExpiry"
                  value={formData.ktaExpiry}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Foto Profil & Avatar */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <ImageIcon className="w-4 h-4 text-sky-600" />
              3. Foto Resmi KTA
            </h4>

            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <img
                  src={formData.photoUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-600 shadow-md shrink-0"
                />
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Foto / Pas Foto
                  </label>
                  <input
                    type="url"
                    name="photoUrl"
                    value={formData.photoUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Sample Presets */}
              <div>
                <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">
                  Atau pilih avatar default:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {SAMPLE_AVATARS.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Avatar ${idx}`}
                      onClick={() => setFormData(p => ({ ...p, photoUrl: url }))}
                      className={`w-10 h-10 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                        formData.photoUrl === url ? 'border-rose-600 scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Kontak & Catatan */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Phone className="w-4 h-4 text-emerald-600" />
              4. Kontak & Biodata Tambahan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Resmi / Pribadi
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="wartawan@jarrakpos.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kontak Darurat (Keluarga)
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Istri / Suami (0812-xxxx)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Golongan Darah
                </label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                  <option value="-">-</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Domisili
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Jl. ..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ringkasan Profil / Rubrik Penugasan
                </label>
                <textarea
                  name="bio"
                  rows="2"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Spesialisasi liputan, riwayat penugasan..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-rose-900/30 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Simpan Data Redaksi
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
