// ===== IMPORT DEPENDENCIES =====
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const crypto = require('crypto');

const app = express();
const port = 3000;

// ===== MIDDLEWARE =====
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // agar bisa baca body JSON

// ===== KONEKSI DATABASE =====
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dzakypratama45', // ubah sesuai password MySQL kamu
  database: 'apikey',         // nama database kamu
  port: 3308                  // port MySQL (ubah kalau beda)
});

db.connect((err) => {
  if (err) {
    console.error('❌ Gagal konek ke database:', err);
  } else {
    console.log('✅ Terhubung ke database MySQL');
  }
});

// ===== ROUTE UTAMA (tampilkan halaman HTML) =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== ROUTE UNTUK MEMBUAT API KEY =====
app.post('/create', (req, res) => {
  console.log('📩 Request POST /create diterima');

  // Generate API Key
  const apiKey = 'sk_live_' + crypto.randomBytes(24).toString('hex');
  console.log('🔑 API Key yang dibuat:', apiKey);

  // Query simpan ke tabel "api"
  const sql = 'INSERT INTO api (apikey) VALUES (?)';
  db.query(sql, [apiKey], (err, result) => {
    if (err) {
      console.error('❌ Gagal menyimpan ke database:', err);
      return res.status(500).json({ error: 'Gagal menyimpan ke database' });
    }

    console.log('✅ API Key berhasil disimpan. ID:', result.insertId);
    res.status(200).json({
      success: true,
      id: result.insertId,
      apiKey: apiKey
    });
  });
});

// ===== JALANKAN SERVER =====
app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
