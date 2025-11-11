const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/create', (req, res) => {
  const apiKey = 'sk_live_' + crypto.randomBytes(24).toString('hex');
  res.json({ apiKey });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
