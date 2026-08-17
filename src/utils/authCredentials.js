export const AUTH_STORAGE_KEY = 'JARRAKPOS_AUTH_CREDENTIALS_V2';

export const SYSTEM_ROLES = {
  DEVELOPER: 'Developer',
  ADMIN: 'Admin',
  WARTAWAN: 'Wartawan'
};

export const DEFAULT_CREDENTIALS = {
  developer: {
    username: 'developer',
    email: 'developer@jarrakpos.com',
    password: 'Baratbawah43',
    role: SYSTEM_ROLES.DEVELOPER,
    roleTitle: 'Developer (Full Root & Cloud Access)',
    name: 'Kang Ocep (Lead Developer)',
    badge: 'Super Developer',
    description: 'Akses penuh seluruh sistem, database Supabase, dan manajemen akun.',
    staffId: 'JP-RED-015'
  },
  admin: {
    username: 'admin',
    email: 'admin@jarrakpos.com',
    password: 'jarrakmediagroup',
    role: SYSTEM_ROLES.ADMIN,
    roleTitle: 'Admin (Pimpinan Redaksi & HRD)',
    name: 'I Gede Putu Sudiarta, S.H.',
    badge: 'Administrator Redaksi',
    description: 'Akses manajemen seluruh dewan redaksi, edit data, dan cetak KTA massal.',
    staffId: 'JP-RED-001'
  },
  wartawan: {
    username: 'pewarta',
    email: 'pewarta@jarrakpos.com',
    password: '12345',
    role: SYSTEM_ROLES.WARTAWAN,
    roleTitle: 'Wartawan (Portal Mandiri)',
    name: 'Asep (Wartawan Biro DPR RI)',
    badge: 'Jurnalis / Wartawan',
    description: 'Akses portal mandiri untuk melihat KTA, QR verifikasi, dan ganti foto sendiri.',
    staffId: 'JP-RED-028'
  }
};

export const getStoredCredentials = () => {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
      return DEFAULT_CREDENTIALS;
    }
    const parsed = JSON.parse(saved);
    return { ...DEFAULT_CREDENTIALS, ...parsed };
  } catch (err) {
    console.error('Error reading credentials:', err);
    return DEFAULT_CREDENTIALS;
  }
};

export const saveStoredCredentials = (creds) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(creds));
  } catch (err) {
    console.error('Error saving credentials:', err);
  }
};

export const updateRoleCredentials = (roleKey, newUsername, newPassword, newName = null) => {
  const current = getStoredCredentials();
  const targetKey = roleKey.toLowerCase();
  
  if (current[targetKey]) {
    current[targetKey] = {
      ...current[targetKey],
      username: newUsername.trim(),
      email: newUsername.includes('@') ? newUsername.trim() : current[targetKey].email,
      password: newPassword.trim(),
      ...(newName ? { name: newName.trim() } : {})
    };
    saveStoredCredentials(current);
    return { success: true, updated: current[targetKey] };
  }
  return { success: false, error: 'Role tidak ditemukan' };
};

export const authenticateUser = (inputIdentifier, inputPassword, allStaff = []) => {
  const creds = getStoredCredentials();
  const query = inputIdentifier.trim().toLowerCase();
  const pass = inputPassword.trim();

  // 1. Check against Developer credentials
  const dev = creds.developer;
  if ((query === dev.username.toLowerCase() || query === dev.email.toLowerCase()) && pass === dev.password) {
    return {
      username: dev.username,
      email: dev.email,
      name: dev.name,
      role: SYSTEM_ROLES.DEVELOPER,
      badge: dev.badge,
      staffId: dev.staffId
    };
  }

  // 2. Check against Admin credentials
  const adm = creds.admin;
  if ((query === adm.username.toLowerCase() || query === adm.email.toLowerCase()) && pass === adm.password) {
    return {
      username: adm.username,
      email: adm.email,
      name: adm.name,
      role: SYSTEM_ROLES.ADMIN,
      badge: adm.badge,
      staffId: adm.staffId
    };
  }

  // 3. Check against Wartawan (pewarta) credentials
  const war = creds.wartawan;
  if ((query === war.username.toLowerCase() || query === war.email.toLowerCase()) && pass === war.password) {
    return {
      username: war.username,
      email: war.email,
      name: war.name,
      role: SYSTEM_ROLES.WARTAWAN,
      badge: war.badge,
      staffId: war.staffId
    };
  }

  // 4. Check against any individual staff email in the database with wartawan password or custom password
  if (Array.isArray(allStaff)) {
    const matched = allStaff.find(s => s.email && s.email.toLowerCase() === query);
    if (matched && (pass === war.password || pass === '12345')) {
      return {
        username: matched.email.split('@')[0],
        email: matched.email,
        name: matched.name,
        role: SYSTEM_ROLES.WARTAWAN,
        badge: `${matched.role} (${matched.bureau})`,
        staffId: matched.id
      };
    }
  }

  return null;
};
