# PulseHQ — Enterprise Social Media Monitoring & Strategic Intelligence Platform

[![Tier-1 Enterprise Spec](https://img.shields.io/badge/Spec-Tier--1%20Enterprise%20%28%24500K%20Grade%29-3b82f6?style=for-the-badge&logo=shield)](https://github.com/Nazca13/PulseHQ)
[![License: Enterprise Proprietary](https://img.shields.io/badge/License-Enterprise%20Proprietary-8b5cf6?style=for-the-badge)](https://github.com/Nazca13/PulseHQ)
[![Theme: Industrial NOC Dark](https://img.shields.io/badge/Theme-Industrial%20NOC%20Dark-10b981?style=for-the-badge)](https://github.com/Nazca13/PulseHQ)
[![Interactivity: D3.js + Leaflet + Chart.js](https://img.shields.io/badge/Engine-D3.js%20v7%20%7C%20Leaflet%20%7C%20Chart.js-f43f5e?style=for-the-badge)](https://github.com/Nazca13/PulseHQ)

> **PulseHQ** adalah platform **Enterprise Social Media Intelligence & Cyber Reconnaissance** kelas industri yang dirancang khusus untuk Network Operations Center (NOC), tim Government PR, Brand Reputation Crisis Team, serta Cyber Intelligence Analyst. Platform ini menggabungkan *Real-Time Firehose Streaming*, *NLP Sentiment & Aspect Analysis*, *Cross-Platform Digital Footprint Reconnaissance*, *Buzzer Bot Audit Scoring*, serta *Interactive Force-Directed Entity Graphing*.

---

## 📑 Daftar Isi (Table of Contents)

1. [Executive Overview & Value Proposition](#-executive-overview--value-proposition)
2. [Product Requirement Document (PRD)](#-product-requirement-document-prd)
   - [2.1 Visi & Tujuan Produk](#21-visi--tujuan-produk)
   - [2.2 Target Pengguna (User Personas)](#22-target-pengguna-user-personas)
   - [2.3 Spesifikasi Modul Utama (9 Core Views)](#23-spesifikasi-modul-utama-9-core-views)
3. [Spesifikasi Fitur Deep-Dive Per Modul](#-spesifikasi-fitur-deep-dive-per-modul)
   - [Modul 1: Command Center (NOC Dashboard)](#modul-1-command-center-noc-dashboard)
   - [Modul 2: Account Investigation & Bot Audit](#modul-2-account-investigation--bot-audit)
   - [Modul 3: Entity Network Graph Studio](#modul-3-entity-network-graph-studio)
   - [Modul 4: Live Firehose Stream](#modul-4-live-firehose-stream)
   - [Modul 5: Geo-Intelligence & Regional Heatmap](#modul-5-geo-intelligence--regional-heatmap)
   - [Modul 6: Share of Voice (SOV) & Benchmark Matrix](#modul-6-share-of-voice-sov--benchmark-matrix)
   - [Modul 7: Crisis Command Center & Dynamic Playbook](#modul-7-crisis-command-center--dynamic-playbook)
   - [Modul 8: Executive Report Builder Studio](#modul-8-executive-report-builder-studio)
   - [Modul 9: Enterprise Settings & API Key Vault](#modul-9-enterprise-settings--api-key-vault)
4. [Desain Sistem & Estetika (NOC Visual Spec)](#-desain-sistem--estetika-noc-visual-spec)
5. [Arsitektur Teknis & Teknologi](#-arsitektur-teknis--teknologi)
6. [Struktur Direktori & File Map](#-struktur-direktori--file-map)
7. [Panduan Instalasi & Jalankan Lokal](#-panduan-instalasi--jalankan-lokal)
8. [Matriks Respon & Skalabilitas (Responsiveness Spec)](#-matriks-respon--skalabilitas-responsiveness-spec)
9. [Lisensi & Kontribusi](#-lisensi--kontribusi)

---

## 🌐 Executive Overview & Value Proposition

Dalam lanskap digital kontemporer, serangan opini publik terkoordinasi (kampanye buzzer, disinformasi, botnet farm, serta *black-hat PR*) terjadi dalam hitungan detik. Alat monitoring konvensional sering kali lambat, menyajikan visualisasi standar yang kaku, serta terbatas pada agregasi angka tanpa kemampuan forensik mendalam.

**PulseHQ** hadir sebagai solusi Tier-1 Command Center yang dirancang tanpa kompromi (*Zero AI-Slop Aesthetic*), menghadirkan visualisasi gelap (*Obsidian Industrial Dark Mode*) tingkat tinggi yang teruji untuk pemantauan 24/7 di ruang kendali (NOC display).

### Keunggulan Utama (Key Differentiators):
- **Bot & Authenticity Scoring**: Deteksi algoritmis rasio follower/following, *burst-posting patterns*, serta sintesis foto profil berbasis AI (StyleGAN detection).
- **Cross-Platform Digital Footprint**: Pelacakan otomatis entitas akun lintas platform (X/Twitter, TikTok, Instagram, Telegram, Reddit, LinkedIn).
- **Starburst Radial D3 Forensics**: Visualisasi korelasi akun utama hingga 6 cabang investigasi forensik (Syndicate Ring, Attack Target, Vault Alias, Activity Heatmap, & Deleted Archive).
- **Live Firehose Stream**: Penyerapan jutaan sinyal percakapan publik secara *real-time* dengan klasifikasi sentimen NLP (Positif, Netral, Negatif, Krisis).
- **Dynamic SOP Crisis Engine**: Panduan mitigasi krisis otomatis dari Trigger Alert hingga *Official Statement Dispatch*.
- **Executive PDF Report Studio**: Pembuat laporan eksekutif siap cetak dengan *Print Paper Live Preview*.

---

## 📋 Product Requirement Document (PRD)

### 2.1 Visi & Tujuan Produk
- **Visi**: Menjadi sistem komando intelijen media sosial standar industri global untuk deteksi dini krisis, pemetaan jaringan aktor provokatif, serta sintesis laporan strategis.
- **Tujuan Utama**:
  1. Menurunkan *Mean Time to Detect (MTTD)* sinyal krisis media sosial hingga di bawah 60 detik.
  2. Membongkar jaringan buzzer (*Syndicate Buzzer Ring*) hingga ke node aktor penggerak utama.
  3. Menyediakan antarmuka ultra-responsif, berkerataan data tinggi (*high density*), dan bebas distraksi visual (*zero gradients*).

### 2.2 Target Pengguna (User Personas)
| Persona | Role & Focus | Tantangan Utama | Solusi PulseHQ |
| :--- | :--- | :--- | :--- |
| **NOC Operator** | Monitoring sinyal krisis 24/7 | Terlalu banyak alert palsu (*noise*) | Live Firehose + Alarm Crisis Signal Tier 1-3 |
| **Cyber Forensic Analyst** | Audit keaslian akun & buzzer ring | Menghubungkan titik antar platform | Account Investigation & Starburst D3 Graph |
| **Public Relations Director** | Respon krisis & Share of Voice | Mengetahui dampak krisis terhadap kompetitor | SOV Matrix & Dynamic Crisis Playbook |
| **C-Level Executive** | Pengambilan keputusan eksekutif | Membutuhkan ringkasan laporan siap cetak | Report Builder Studio & PDF Paper Preview |

### 2.3 Spesifikasi Modul Utama (9 Core Views)

```
                       ┌──────────────────────────────────────────┐
                       │          PULSEHQ DASHBOARD SYSTEM        │
                       └────────────────────┬─────────────────────┘
                                            │
   ┌───────────────────┬────────────────────┼────────────────────┬───────────────────┐
   │                   │                    │                    │                   │
┌──┴───────────────┐ ┌─┴────────────────┐ ┌─┴────────────────┐ ┌─┴────────────────┐ ┌─┴────────────────┐
│ Command Center   │ │ Account Invest.  │ │ Entity Graph     │ │ Live Firehose    │ │ Geo-Intel Map    │
│ (NOC Dashboard)  │ │ (Bot Audit)      │ │ (D3 Physics)     │ │ (Stream Sockets) │ │ (Leaflet Heat)   │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
   │                   │                    │                    │                   │
   └───────────────────┼────────────────────┼────────────────────┴───────────────────┘
                       │                    │
             ┌─────────┴──────────┐ ┌───────┴───────────┐ ┌──────────────────┐
             │ SOV Matrix         │ │ Crisis Playbook   │ │ Report Builder   │
             │ (SOV Benchmark)    │ │ (SOP Automations) │ │ (PDF Studio)     │
             └────────────────────┘ └───────────────────┘ └──────────────────┘
```

---

## 🔬 Spesifikasi Fitur Deep-Dive Per Modul

### Modul 1: Command Center (NOC Dashboard)
- **Crisis Signal Banner**: Alert interaktif dengan indikator fluktuasi volume percakapan negatif yang dapat di-dismiss atau dipicu ke Crisis Playbook.
- **KPI Metrics Deck**:
  - *Total Mentions Volume*: 5.42M (+12.4% vs kemarin).
  - *Net Sentiment Score*: +34.2 (Skor indeks gabungan NLP).
  - *Bot Attack Rate*: 14.8% (Indikator ancaman merah jika > 10%).
  - *Reach Potential*: 42.8M tayangan percakapan.
- **Predictive Trend Chart**: Grafik garis ganda Chart.js yang memproyeksikan volume percakapan aktual vs prediksi algoritma AI untuk 12 jam ke depan.
- **Aspect-Based Sentiment Breakdown**: Progress bar sentimen pada variabel *Product Quality*, *Customer Support*, *Pricing*, dan *Brand Reputation*.

### Modul 2: Account Investigation & Bot Audit
Modul forensik khusus untuk membedah akun mencurigakan secara tuntas:
1. **Target Account Inspection Header**:
   - Menampilkan Avatar, Handle (`@buzz_master_id`), ID Registrasi, Lokasi IP Proxy, dan Timestamp Pembuatan Akun.
2. **Bot & Authenticity Gauge Chart**:
   - Radial Gauge Chart (0–100) dengan indikator visual *Bot Probability Score (87%)*.
   - Label Status Otomatis: `Genuine` (<30%), `Suspicious` (30–70%), `Bot / Amplification Node` (>70%).
3. **Cross-Platform Digital Footprint**:
   - Badging status keaktifan akun lintas media sosial: *TikTok (Active)*, *Instagram (Active)*, *Telegram Channel (Flagged)*, *Reddit (Inactive)*, *LinkedIn (Found)*.
4. **Starburst Radial D3 Forensics Graph**:
   - Menggunakan D3.js Force Simulation khusus.
   - Akun target di pusat (`fx`, `fy`), dikelilingi **6 Hub Forensik Utama**:
     - `1. Buzzer Syndicate Ring` (28 akun bot terkoordinasi).
     - `2. Cross-Platform Footprint` (Jejak digital 5 platform).
     - `3. Campaign Attack Target` (Sasaran kampanye negatif #BrandGagal).
     - `4. Historical Alias Vault` (Riwayat pergantian username).
     - `5. Behavioral Automation` (Pola posting 24/7 tanpa jeda tidur).
     - `6. Deleted Content Archive` (Arsip cuitan yang dihapus).
   - Fitur Interaktif: Drag node, hover highlight, tooltip glassmorphic, serta *Inspector Drawer Panel* saat node diklik.
5. **24/7 Activity Heatmap Grid**:
   - Grid 7 hari x 24 jam yang menunjukkan jam-jam aktif posting akun untuk mendeteksi perilaku otomatisasi botnet.
6. **Entity Correlation & Co-Mention Table**:
   - Matriks korelasi Pearson antara akun target dengan node sekunder lengkap dengan Sync Burst lag dan Security Flag.

### Modul 3: Entity Network Graph Studio
- **Canvas Physics Engine**: Simulasi force D3.js v7 berkinerja tinggi (60 FPS) dengan canvas renderer.
- **Node Classification System**:
  - *Brands* (Biru), *KOLs / Influencers* (Hijau), *Media Outlets* (Ungu), *Topics / Hashtags* (Kuning), *Buzzer Networks* (Merah).
- **Control HUD**:
  - Search filter instan, pemicu filter kategori (*All, Brands, KOLs, Media, Topics, Buzzers*), Slider Pengatur Physics Force (*Charge Strength*, *Link Distance*, *Collide Radius*).
- **Slide-in Inspector Drawer**:
  - Panel informasi mendalam yang bergeser dari kanan saat node diklik, menampilkan statistik audiens, daftar platform terikat, dan aksi isolasi node.

### Modul 4: Live Firehose Stream
- **Real-Time Data Ingestion**: Feed postingan dari X, TikTok, Instagram, YouTube, dan LinkedIn.
- **Filter Bar**: Filter cepat berdasarkan platform, status sentimen, dan status ancaman.
- **Live Stream Controls**: Tombol Pause/Play stream percakapan untuk analisis mendalam tanpa tertinggal data.

### Modul 5: Geo-Intelligence & Regional Heatmap
- **Leaflet.js Map Integration**: Peta kustom gelap Indonesia dengan marker pulse animasi di kota-kota utama (Jakarta, Surabaya, Bandung, Medan, Makassar).
- **Regional Sentiment Breakdown**: Bar chart dan statistik daftar provinsi dengan volume percakapan serta dominasi sentimen terkuat.

### Modul 6: Share of Voice (SOV) & Benchmark Matrix
- **Head-to-Head Enterprise Matrix Table**:
  - Perbandingan langsung antara *BrandX (Our Brand)* vs *Kompetitor A, B, dan C*.
  - Parameter: Mentions Volume, Reach, SOV %, Net Sentiment Score, Virality Ratio, KOL Backing, dan Dominant Channel.
- **Analytics Charts Deck**:
  - *Donut Chart*: Distirbusi SOV % antar kompetitor.
  - *Bar Chart*: Dominasi Platform Media Sosial.
  - *Radar Chart*: Perbandingan 6 Dimensi Performa Brand.

### Modul 7: Crisis Command Center & Dynamic Playbook
- **Threat Level Gauge & Badge**: Indikator *Threat Level 4 (CRITICAL)* dengan pengukur eskalasi otomatis.
- **Interactive SOP Checklist**:
  - Langkah 1: *Isolate Source Accounts* (Done).
  - Langkah 2: *Draft PR Counter-Statement* (Active).
  - Langkah 3: *Activate Counter-Influencer Network* (Pending).
  - Langkah 4: *Executive Briefing & Press Dispatch* (Pending).
- **Live Crisis Console Output**: Terminal log hitam yang mencatat setiap aksi mitigasi krisis secara waktu-nyata lengkap dengan timestamp WIB.

### Modul 8: Executive Report Builder Studio
- **Custom Report Configurator**:
  - Pilihan rentang waktu, tipe modul yang dimasukkan, catatan analisis kustom, serta format ekspor (PDF, CSV, JSON).
- **Live Document Paper Preview**:
  - Tampilan kertas dokumen nyata (*Paper Preview*) yang langsung ter-update saat konfigurasi diubah.
- **Print Engine Overrides (`@media print`)**:
  - CSS khusus yang secara otomatis menyembunyikan sidebar, header, dan control panel saat tombol cetak/PDF dipicu, menghasilkan dokumen cetak profesional bersih berlatar putih.

### Modul 9: Enterprise Settings & API Key Vault
- **Workspace Configuration**: Nama workspace, zona waktu default (WIB/WIT/WITA), dan ambang batas alert krisis.
- **API Key Management Vault**: Manajemen API Token dengan masking bintang, status kuota rate-limit, dan aksi regenerasi key.
- **Role-Based Access Control (RBAC)**: Pengaturan hak akses anggota tim (Admin, Analyst, Viewer).

---

## 🎨 Desain Sistem & Estetika (NOC Visual Spec)

PulseHQ mematuhi prinsip desain **Tier-1 Command Center (Apple HIG Precision + Industrial Dark NOC Aesthetic)**:

### Palette Warna (Solid Hex System - Zero Gradients):
| CSS Variable | Hex / Value | Penggunaan |
| :--- | :--- | :--- |
| `--bg-base` | `#0d0e12` | Latar belakang dasar aplikasi |
| `--bg-elevated` | `#13151b` | Sidebar & Header surface |
| `--bg-card` | `#191c24` | Container kartu bento & modul |
| `--border-default` | `#252836` | Garis batas komponen |
| `--blue-500` | `#3b82f6` | Warna aksen utama (Primary Accent) |
| `--emerald-500` | `#10b981` | Sentimen Positif & Status Active |
| `--rose-500` | `#f43f5e` | Sentimen Negatif, Bot Alert, Crisis |
| `--amber-500` | `#f59e0b` | Peringatan & Status Warning |
| `--purple-500` | `#8b5cf6` | Kategori media & fitur PRO |

### Typography Scale:
- **Primary Font**: `'Inter'`, -apple-system, BlinkMacSystemFont, sans-serif.
- **Monospace Font**: `ui-monospace`, `'SFMono-Regular'`, `'Cascadia Code'`, monospace (digunakan pada console log, ID akun, & statistik angka).

---

## 🛠 Arsitektur Teknis & Teknologi

```
+-------------------------------------------------------------------+
|                            FRONTEND UI                            |
|     HTML5 Semantic Views | Vanilla CSS Tier-1 Design System       |
+--------------------------------─┬─────────────────────────────────+
                                  │
+--------------------------------─┴─────────────────────────────────+
|                           ENGINE LAYER                            |
|  js/dashboard.js        js/graph-engine.js      js/graph-data.js   |
|  (Core State & Views)   (D3 Force Simulation)   (Entity Schemas)   |
+─────────┬───────────────────────┬────────────────────────┬────────+
          │                       │                        │
+─────────┴────────+    +─────────┴────────+     +──────────┴────────+
|    D3.js v7      |    |    Chart.js     |     |    Leaflet.js     |
| (Force Graphing) |    | (Analytics Deck)|     |  (Geo Mapping)    |
+──────────────────+    +─────────────────+     +───────────────────+
```

### Library Dependencies:
- **Chart.js** (`cdn.jsdelivr.net/npm/chart.js`): Rendering grafik tren, donut SOV, radar, & bar chart.
- **D3.js v7** (`cdn.jsdelivr.net/npm/d3@7`): Physics engine simulasi force-directed graph.
- **Leaflet.js** (`unpkg.com/leaflet@1.9.4`): Peta geospasial interaktif Indonesia.
- **Phosphor Icons** (`unpkg.com/@phosphor-icons/web`): Iconset enterprise presisi tinggi.

---

## 📁 Struktur Direktori & File Map

```
/
├── index.html                # Main HTML5 Single Page Application (9 Views Included)
├── README.md                 # Dokumentasi Superlengkap & PRD Spesifikasi Sistem
├── SKILLS/                   # Knowledge Items & Manual Specs
├── css/
│   ├── styles.css            # Tier-1 Design System, Responsive Rules & Module Styles
│   └── graph.css             # Obsidian Canvas Overlay, HUD Controls & Drawer CSS
└── js/
    ├── dashboard.js          # Main App Controller, State Engine & Modular Charts
    ├── graph-engine.js       # D3.js v7 Force Simulation Physics & Canvas Renderer
    └── graph-data.js         # Enterprise Entity Schemas, Nodes & Link Datasets
```

---

## 🚀 Panduan Instalasi & Jalankan Lokal

Aplikasi ini menggunakan arsitektur **Pure Web Application (HTML5/CSS3/ES6 JS)** tanpa ketergantungan build tool berat seperti Webpack atau Vite, sehingga dapat langsung dijalankan pada web server lokal mana pun.

### Langkah 1: Clone Repository
```bash
git clone https://github.com/Nazca13/PulseHQ.git
cd PulseHQ
```

### Langkah 2: Jalankan Local Server
Anda dapat menggunakan HTTP server sederhana seperti Python, Node `http-server`, atau VS Code Live Server:

**Menggunakan Python 3:**
```bash
python3 -m http.server 8080
```

**Menggunakan Node.js `serve`:**
```bash
npx serve .
```

### Langkah 3: Buka di Browser
Buka browser favorit Anda dan akses:
```text
http://localhost:8080
```

---

## 📐 Matriks Respon & Skalabilitas (Responsiveness Spec)

PulseHQ dirancang ultra-responsif dari layar monitor 4K NOC hingga perangkat mobile smartphone:

| Breakpoint | Target Device | Penyesuaian Layout |
| :--- | :--- | :--- |
| **> 1440px** | Ultra-Wide NOC Displays | Full 12-Column Bento Grid, Dual Drawer Extended |
| **1024px – 1440px** | Standard Laptops / Desktop | 6-Column Grid Adaption, Compact Sidebar Rail (64px) |
| **768px – 1024px** | iPad / Tablets | Stacked 2-Column KPI, Fluid Canvas Height |
| **< 768px** | Mobile Devices (Portrait/Landscape) | Horizontal Scroll Navigation Bar, Full-Width Cards, Dynamic Canvas Clamp |

---

## ⚖️ Lisensi & Hak Cipta

**PulseHQ Enterprise Social Media Intelligence Platform**  
Copyright © 2026 Indocorp Enterprise & Nazca13. All rights reserved.  
Dokumentasi dan kode sumber ini dilindungi di bawah skema lisensi internal proprietary.
