# Lemonade DevSecOps Guardian

Production-ready reference implementation demonstrating AI-assisted DevSecOps workflows using a local Lemonade LLM server with OpenAI-compatible endpoints.

## Architecture

Frontend (React + Vite + Tailwind + Monaco + React Query)
→ Node API (Express)
→ Lemonade LLM Server (`/v1/chat/completions`)
→ Security analysis response (JSON)

## Project Structure

```text
lemonade-devsecops-guardian/
  backend/
    server.js
    lemonadeClient.js
    securityAgent.js
    repoScanner.js
    package.json
  frontend/
    index.html
    vite.config.js
    package.json
    tailwind.config.js
    postcss.config.js
    src/
      main.jsx
      App.jsx
      api.js
      styles.css
      components/
        CodeUploader.jsx
        CodeEditor.jsx
        ScanResults.jsx
        VulnerabilityCard.jsx
  shared/
    prompts.js
```

## Environment Variables

Create `lemonade-devsecops-guardian/backend/.env`:

```bash
LEMONADE_BASE_URL=http://localhost:8000/v1
LEMONADE_API_KEY=local
PORT=4000
```

## Backend Setup

```bash
cd lemonade-devsecops-guardian/backend
npm install
node server.js
```

Available endpoints:
- `GET /health`
- `POST /scan/code` with `{ "code": "..." }`
- `POST /scan/file` with multipart form-data key `file`
- `POST /scan/repo` with `{ "repoUrl": "https://github.com/user/project" }`

## Frontend Setup

```bash
cd lemonade-devsecops-guardian/frontend
npm install
npm run dev
```

Set optional frontend env (`.env`):

```bash
VITE_API_BASE_URL=http://localhost:4000
```

## Demo Flow

1. Paste vulnerable code in Monaco editor.
2. Click **Scan Editor Code**.
3. Review vulnerabilities (type, severity, explanation, secure fix).
4. Optionally upload a file or scan a GitHub repository.
5. Export JSON report.

Example vulnerable code:

```js
const query = "SELECT * FROM users WHERE id=" + id;
```

## Sample Result

```json
{
  "vulnerabilities": [
    {
      "type": "SQL Injection",
      "severity": "high",
      "explanation": "User input is concatenated into SQL query string.",
      "fix": "Use parameterized queries: db.query('SELECT * FROM users WHERE id = ?', [id]);"
    }
  ]
}
```

## Notes

- Repo scanner analyzes `.js`, `.ts`, `.py`, `.java` files.
- Lemonade responses are normalized and shown as vulnerability cards with severity color coding.
- UI follows dark terminal-inspired styling with green accent.
