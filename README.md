# Mental Health Chatbot

Aplikasi chatbot kesehatan mental yang menggunakan Google Gemini AI untuk memberikan dukungan dan bimbingan kepada pengguna.

## Fitur

- Chat interaktif dengan AI untuk konseling kesehatan mental
- Quick replies untuk memudahkan interaksi
- Respons yang dipersonalisasi berdasarkan input pengguna
- Antarmuka yang ramah pengguna dengan Tailwind CSS

## Teknologi yang Digunakan

- Frontend: HTML, JavaScript, Tailwind CSS
- Backend: Node.js, Express.js
- AI: Google Gemini AI

## Cara Menjalankan Aplikasi

### Prasyarat

- Node.js (versi 14 atau lebih baru)
- API Key Google Gemini AI

### Langkah-langkah Instalasi

1. Clone repository ini

```bash
git clone https://github.com/Isaaja/mental_health_chatbot.git
cd mental_health_chatbot
```

2. Install dependencies backend

```bash
cd backend
npm install
```

3. Buat file `.env` di folder backend dengan isi:

```
GEMINI_API_KEY=your_api_key_here
```

4. Jalankan backend

```bash
node app.js
```

5. Buka file `frontend/index.html` di browser Anda

## Struktur Aplikasi

### Frontend

- `index.html`: Halaman utama aplikasi
- `style.css`: Styling tambahan
- `app.js`: Logika frontend dan interaksi dengan backend

### Backend

- `app.js`: Server Express dan konfigurasi
- `api/chat-bot/route.js`: Endpoint API untuk chatbot
  - POST `/api/chat-bot`: Endpoint untuk mengirim pesan ke AI
  - GET `/api/chat-bot/quick-replies`: Endpoint untuk mendapatkan quick replies

## Alur Aplikasi

1. Pengguna membuka aplikasi dan melihat pesan selamat datang
2. Quick replies awal ditampilkan dengan opsi:

   - "I'm feeling anxious"
   - "I'm feeling depressed"
   - "I need someone to talk to"

3. Pengguna dapat:

   - Memilih quick reply
   - Mengetik pesan sendiri
   - Mengirim pesan dengan tombol Send atau Enter

4. Setelah pengguna mengirim pesan:

   - Pesan ditampilkan di chat
   - AI memberikan respons
   - Quick replies diperbarui sesuai dengan konteks percakapan

5. Quick replies akan berubah sesuai dengan tahap percakapan:
   - Tahap 1: Masalah awal
   - Tahap 2: Pertanyaan lanjutan
   - Tahap 3: Solusi dan saran
