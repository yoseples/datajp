# JARRAKPOS.COM - Database Dewan Redaksi & Bank Data Karyawan

Aplikasi web modern dan komprehensif untuk mengelola **Database Dewan Redaksi, Wartawan, dan Bank Data Karyawan Jarrakpos (jarrakpos.com)**.

🌐 **Live View Demo**: [https://yoseples.github.io/datajp/](https://yoseples.github.io/datajp/)

---

## ✨ Fitur Utama
1. **Bank Data Dewan Redaksi**: Inventarisasi Dewan Pembina, Penasehat, Pemimpin Redaksi, Redpel, Redaktur Desk, Korlip, Reporter Biro Daerah, Multimedia, dan Staf.
2. **KTA Digital (Digital Press Card)**: Generator Kartu Pers Jarrakpos standar Dewan Pers (Sisi Depan & Belakang) dengan QR Code verifikasi, siap cetak atau unduh PNG beresolusi tinggi.
3. **Verifikasi Keabsahan Jurnalis (QR Code & NIP)**: Halaman verifikasi publik untuk memeriksa keaslian KTA wartawan di lapangan.
4. **Bagan Struktur Organisasi Redaksi (Interactive Org Chart)**: Visualisasi susunan hierarki manajemen redaksi.
5. **Dashboard Statistik & Status UKW**: Pemantauan sertifikasi UKW Dewan Pers (Utama, Madya, Muda) dan alert masa kedaluwarsa KTA.
6. **Export CSV & Backup/Restore Database**: Backup/restore instan via JSON dan unduh rekap Excel/CSV.

---

## 🚀 Cara Menjalankan Secara Lokal

```bash
# Clone repository
git clone https://github.com/yoseples/datajp.git
cd datajp

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka browser di: `http://localhost:3000/`

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite 6
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Digital Card Generator**: HTML2Canvas & QRCode
- **Effects**: Canvas Confetti
- **Deployment**: GitHub Pages
