import React, { useState, useEffect } from 'react';
import { 
  X, 
  KeyRound, 
  ShieldCheck, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Shield,
  RotateCcw
} from 'lucide-react';
import { 
  getStoredCredentials, 
  saveStoredCredentials, 
  DEFAULT_CREDENTIALS,
  SYSTEM_ROLES 
} from '../utils/authCredentials';

export default function AccountSettingsModal({ 
  isOpen, 
  onClose, 
  currentUser,
  onCredentialsUpdated 
}) {
  const [credentials, setCredentials] = useState(getStoredCredentials);
  const [selectedRole, setSelectedRole] = useState(() => {
    if (currentUser?.role === SYSTEM_ROLES.DEVELOPER) return 'developer';
    if (currentUser?.role === SYSTEM_ROLES.ADMIN) return 'admin';
    return 'wartawan';
  });
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load selected role data into inputs
  useEffect(() => {
    const creds = getStoredCredentials();
    setCredentials(creds);
    if (creds[selectedRole]) {
      setUsername(creds[selectedRole].username);
      setPassword(creds[selectedRole].password);
      setName(creds[selectedRole].name);
    }
    setSaveSuccess(false);
    setErrorMessage('');
  }, [selectedRole, isOpen]);

  if (!isOpen) return null;

  const isDeveloper = currentUser?.role === SYSTEM_ROLES.DEVELOPER;
  const isAdmin = currentUser?.role === SYSTEM_ROLES.ADMIN;

  const handleSave = (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Username dan Password tidak boleh kosong!');
      return;
    }

    const updated = {
      ...credentials,
      [selectedRole]: {
        ...credentials[selectedRole],
        username: username.trim(),
        password: password.trim(),
        name: name.trim() || credentials[selectedRole].name
      }
    };

    saveStoredCredentials(updated);
    setCredentials(updated);
    setSaveSuccess(true);
    if (onCredentialsUpdated) onCredentialsUpdated(updated);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan semua username dan password ke pengaturan awal pabrik?')) {
      saveStoredCredentials(DEFAULT_CREDENTIALS);
      setCredentials(DEFAULT_CREDENTIALS);
      setUsername(DEFAULT_CREDENTIALS[selectedRole].username);
      setPassword(DEFAULT_CREDENTIALS[selectedRole].password);
      setName(DEFAULT_CREDENTIALS[selectedRole].name);
      setSaveSuccess(true);
      if (onCredentialsUpdated) onCredentialsUpdated(DEFAULT_CREDENTIALS);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 text-slate-900">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 p-5 sm:p-6 text-white flex items-center justify-between border-b border-rose-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-600/30 text-rose-400 border border-rose-500/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                Pengaturan User &amp; Password Akun
              </h3>
              <p className="text-xs text-slate-400">
                Ubah nama pengguna &amp; kata sandi akses sistem redaksi
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
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Role Tab Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Pilih Role Akun yang Ingin Diubah:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('developer')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                  selectedRole === 'developer'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <span>Developer</span>
                <span className={`text-[10px] font-normal ${selectedRole === 'developer' ? 'text-rose-200' : 'text-slate-400'}`}>
                  Root Access
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                  selectedRole === 'admin'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <span>Admin</span>
                <span className={`text-[10px] font-normal ${selectedRole === 'admin' ? 'text-rose-200' : 'text-slate-400'}`}>
                  Dewan Redaksi
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('wartawan')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                  selectedRole === 'wartawan'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <span>Wartawan</span>
                <span className={`text-[10px] font-normal ${selectedRole === 'wartawan' ? 'text-rose-200' : 'text-slate-400'}`}>
                  Pewarta Mandiri
                </span>
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {saveSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Username &amp; Password untuk <strong>{selectedRole.toUpperCase()}</strong> berhasil diperbarui!</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Nama Tampilan Akun</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap Pemegang Akun"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-medium"
              />
            </div>

            {/* Username / Login ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-500" />
                <span>Username Login *</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (misal: developer, admin, pewarta)"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-mono font-bold"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-500" />
                <span>Password Baru *</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password Baru"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-3 flex items-center gap-2.5">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-rose-900/20 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Kredensial</span>
              </button>

              {(isDeveloper || isAdmin) && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  title="Kembalikan ke password default bawaan"
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl border border-slate-200 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

          </form>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Kredensial disimpan lokal secara aman di browser
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
