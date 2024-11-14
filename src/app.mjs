// morgan importálása
import express from 'express';
import morgan from 'morgan';
import axios from 'axios';

const app = express();
const port = 3000;

// Morgan middleware a kérések naplózásához
app.use(morgan('dev'));

// JSON-kérés feldolgozás engedélyezése
app.use(express.json());

// Hibakezelő middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Hiba kiírása a konzolra
  res.status(500).json({ error: 'Belső szerver hiba' }); // Hibaüzenet visszaküldése
});

// /api/hello végpont
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Hugging Face API lekérdezés funkciója
app.post('/api/query', async (req, res) => {
  const { inputText } = req.body;
  console.log('Kapott inputText:', inputText); // Ellenőrizd, hogy érkezik-e adat

  if (!inputText) {
    console.error('Hiányzik az inputText');
    return res.status(400).json({ error: 'inputText mező kötelező' });
  }

  try {
    const result = await queryHuggingFace(inputText);
    console.log('AI válasz:', result); // Ellenőrizd az AI válaszát
    res.json({ result });
  } catch (error) {
    console.error('API hívás hiba:', error.message);
    res.status(500).json({ error: 'Nem sikerült a Hugging Face API lekérdezése' });
  }
});

// Útvonal a Hugging Face API lekérdezéséhez
app.post('/api/query', async (req, res) => {
  const { inputText } = req.body;
  if (!inputText) {
    return res.status(400).json({ error: 'inputText mező kötelező' }); // Ha nincs input, hibával tér vissza
  }

  try {
    const result = await queryHuggingFace(inputText);
    res.json({ result }); // Visszatér a lekérdezés eredményével
  } catch (error) {
    res.status(500).json({ error: 'Nem sikerült a Hugging Face API lekérdezése' }); // Hibaüzenet küldése
  }
});

// Szerver indítása
app.listen(port, () => {
  console.log(`Backend fut a http://localhost:${port} címen`);
});
