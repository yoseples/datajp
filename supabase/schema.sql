-- ==============================================================================
-- SKEMA DATABASE DEWAN REDAKSI & KARYAWAN JARRAKPOS (SUPABASE POSTGRESQL)
-- Salin dan jalankan skrip ini di SQL Editor Supabase Dashboard Anda
-- ==============================================================================

-- 1. Buat Tabel staff_jarrakpos
CREATE TABLE IF NOT EXISTS public.staff_jarrakpos (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    division TEXT NOT NULL,
    bureau TEXT NOT NULL,
    hierarchy_level INTEGER DEFAULT 5,
    nip TEXT,
    email TEXT,
    phone TEXT,
    ukw_level TEXT DEFAULT 'Belum UKW',
    ukw_number TEXT DEFAULT '-',
    status TEXT DEFAULT 'Aktif',
    join_date DATE DEFAULT CURRENT_DATE,
    kta_expiry DATE DEFAULT '2028-12-31',
    photo_url TEXT,
    address TEXT,
    bio TEXT,
    emergency_contact TEXT,
    blood_type TEXT DEFAULT 'O',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.staff_jarrakpos ENABLE ROW LEVEL SECURITY;

-- 3. Buat Kebijakan Akses (Public Read & Authenticated/Anon Insert/Update/Delete)
CREATE POLICY "Allow public read access"
ON public.staff_jarrakpos
FOR SELECT
USING (true);

CREATE POLICY "Allow anon and auth insert access"
ON public.staff_jarrakpos
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow anon and auth update access"
ON public.staff_jarrakpos
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anon and auth delete access"
ON public.staff_jarrakpos
FOR DELETE
USING (true);

-- 4. Indexing untuk Pencarian Cepat
CREATE INDEX IF NOT EXISTS idx_staff_name ON public.staff_jarrakpos(name);
CREATE INDEX IF NOT EXISTS idx_staff_division ON public.staff_jarrakpos(division);
CREATE INDEX IF NOT EXISTS idx_staff_bureau ON public.staff_jarrakpos(bureau);
CREATE INDEX IF NOT EXISTS idx_staff_nip ON public.staff_jarrakpos(nip);

-- 5. Komentar Tabel
COMMENT ON TABLE public.staff_jarrakpos IS 'Database resmi jajaran Dewan Redaksi dan Karyawan Jarrakpos.com';
