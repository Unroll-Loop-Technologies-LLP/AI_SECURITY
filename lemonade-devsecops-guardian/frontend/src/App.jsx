import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { scanCode, scanFile, scanRepo } from './api';
import CodeUploader from './components/CodeUploader';
import CodeEditor from './components/CodeEditor';
import ScanResults from './components/ScanResults';

const EXAMPLE_VULNERABLE_CODE = `// Example vulnerable code\nconst query = "SELECT * FROM users WHERE id=" + id;`;

export default function App() {
  const [code, setCode] = useState(EXAMPLE_VULNERABLE_CODE);
  const [repoUrl, setRepoUrl] = useState('');
  const [vulnerabilities, setVulnerabilities] = useState([]);

  const codeScanMutation = useMutation({
    mutationFn: scanCode,
    onSuccess: (data) => setVulnerabilities(data.vulnerabilities || []),
  });

  const fileScanMutation = useMutation({
    mutationFn: scanFile,
    onSuccess: (data) => setVulnerabilities(data.vulnerabilities || []),
  });

  const repoScanMutation = useMutation({
    mutationFn: scanRepo,
    onSuccess: (data) => setVulnerabilities(data.vulnerabilities || []),
  });

  const isLoading = codeScanMutation.isPending || fileScanMutation.isPending || repoScanMutation.isPending;

  const exportReport = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      vulnerabilities,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'security-report.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="panel">
          <h1 className="text-2xl font-bold text-neon">Lemonade DevSecOps Guardian</h1>
          <p className="text-sm text-zinc-300">
            AI-powered vulnerability detection and secure fix generation with Lemonade LLM.
          </p>
        </header>

        <CodeEditor code={code} onChange={setCode} onScan={() => codeScanMutation.mutate(code)} />

        <div className="grid gap-4 md:grid-cols-2">
          <CodeUploader onUpload={(file) => fileScanMutation.mutate(file)} />
          <section className="panel space-y-3">
            <h3 className="text-lg font-semibold text-neon">Scan GitHub Repository</h3>
            <input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/user/project"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => repoScanMutation.mutate(repoUrl)}
              className="rounded-md bg-neon px-4 py-2 text-sm font-semibold text-zinc-950"
            >
              Scan Repository
            </button>
          </section>
        </div>

        {isLoading && <p className="text-sm text-neon">Scanning in progress...</p>}

        <ScanResults vulnerabilities={vulnerabilities} onExport={exportReport} />
      </div>
    </main>
  );
}
