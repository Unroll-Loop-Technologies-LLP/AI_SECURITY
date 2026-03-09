require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { analyzeSourceCode } = require('./securityAgent');
const { scanRepository } = require('./repoScanner');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Lemonade DevSecOps Guardian API' });
});

app.post('/scan/code', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Code is required.' });
    }

    const vulnerabilities = await analyzeSourceCode(code, 'inline');
    return res.json({ vulnerabilities });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to scan code.',
      details: error.message,
    });
  }
});

app.post('/scan/repo', async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) {
      return res.status(400).json({ error: 'repoUrl is required.' });
    }

    const result = await scanRepository(repoUrl);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to scan repository.',
      details: error.message,
    });
  }
});

app.post('/scan/file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'file is required.' });
    }

    const code = req.file.buffer.toString('utf8');
    const vulnerabilities = await analyzeSourceCode(code, req.file.originalname);
    return res.json({ vulnerabilities });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to scan uploaded file.',
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running at http://localhost:${PORT}`);
});
